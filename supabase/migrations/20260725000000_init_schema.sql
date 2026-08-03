-- DJETFACTURE — Schema SQL Initial & Policies RLS (Conformité OHADA)
-- Execute in Supabase SQL Editor or via Supabase CLI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Helper SECURITY DEFINER pour éviter la récursion infinie sur organization_members
CREATE OR REPLACE FUNCTION public.user_org_ids()
RETURNS TABLE (org_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid();
$$;

-- 2. Enums
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('wave', 'orange_money', 'mtn_momo', 'moov_money', 'cash', 'bank_transfer', 'check');

-- 3. Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Organizations
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rccm text,
  ifu text,
  ninea text,
  tax_regime text DEFAULT 'Régime Réel Simplifié',
  currency text DEFAULT 'XOF' NOT NULL,
  default_tax_rate numeric(5,2) DEFAULT 18.00 NOT NULL,
  phone text,
  email text,
  address text,
  city text,
  country text DEFAULT 'Sénégal' NOT NULL,
  bank_details jsonb DEFAULT '{}'::jsonb,
  mobile_money jsonb DEFAULT '{}'::jsonb,
  logo_path text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Organization Members
CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role DEFAULT 'member' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(organization_id, user_id)
);

-- 6. Clients
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  city text,
  country text DEFAULT 'Sénégal',
  rccm text,
  ifu text,
  archived_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Document Counters (Numérotation séquentielle OHADA sans trou)
CREATE TABLE public.document_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  doc_type text DEFAULT 'invoice' NOT NULL,
  year integer NOT NULL,
  last_value integer DEFAULT 0 NOT NULL,
  UNIQUE(organization_id, doc_type, year)
);

-- 8. Invoices
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  number text, -- NULL tant que draft
  status public.invoice_status DEFAULT 'draft' NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  currency text DEFAULT 'XOF' NOT NULL,
  subtotal bigint DEFAULT 0 NOT NULL,
  tax_total bigint DEFAULT 0 NOT NULL,
  total bigint DEFAULT 0 NOT NULL,
  amount_paid bigint DEFAULT 0 NOT NULL,
  notes text,
  public_token text UNIQUE,
  pdf_path text,
  credit_note_of uuid REFERENCES public.invoices(id),
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 9. Invoice Items
CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit_price bigint NOT NULL CHECK (unit_price >= 0),
  discount_percent numeric(5,2) DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
  tax_rate numeric(5,2) DEFAULT 18.00 NOT NULL,
  line_subtotal bigint NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 10. Payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount bigint NOT NULL CHECK (amount > 0),
  payment_date date DEFAULT CURRENT_DATE NOT NULL,
  method public.payment_method NOT NULL,
  reference text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 11. Activity Logs
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 12. Vue v_invoices pour dériver 'partial' et 'overdue' sans cron
CREATE OR REPLACE VIEW public.v_invoices
WITH (security_invoker = true)
AS
SELECT 
  i.*,
  (i.total - i.amount_paid) AS balance_due,
  CASE
    WHEN i.status = 'cancelled' THEN 'cancelled'::text
    WHEN i.status = 'paid' THEN 'paid'::text
    WHEN i.status = 'draft' THEN 'draft'::text
    WHEN i.amount_paid > 0 AND i.amount_paid < i.total THEN 'partial'::text
    WHEN i.status = 'sent' AND i.due_date < CURRENT_DATE AND i.amount_paid < i.total THEN 'overdue'::text
    ELSE i.status::text
  END AS display_status
FROM public.invoices i;

-- 13. Trigger pour mettre à jour amount_paid lors d'un versement
CREATE OR REPLACE FUNCTION public.update_invoice_amount_paid()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.invoices
  SET 
    amount_paid = (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE invoice_id = NEW.invoice_id),
    status = CASE 
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE invoice_id = NEW.invoice_id) >= total THEN 'paid'::public.invoice_status
      ELSE status
    END,
    paid_at = CASE
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE invoice_id = NEW.invoice_id) >= total THEN now()
      ELSE paid_at
    END
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_payment_inserted
AFTER INSERT OR DELETE OR UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_invoice_amount_paid();

-- 14. RPC finalize_invoice (Transaction atomique OHADA)
CREATE OR REPLACE FUNCTION public.finalize_invoice(p_invoice_id uuid)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv public.invoices;
  v_year integer;
  v_next_num integer;
  v_formatted_num text;
  v_token text;
BEGIN
  -- Récupérer la facture
  SELECT * INTO v_inv FROM public.invoices WHERE id = p_invoice_id FOR UPDATE;
  
  IF v_inv.id IS NULL THEN
    RAISE EXCEPTION 'Facture introuvable';
  END IF;

  IF v_inv.status != 'draft' THEN
    RAISE EXCEPTION 'Seule une facture brouillon peut être finalisée';
  END IF;

  v_year := EXTRACT(YEAR FROM v_inv.issue_date);

  -- Incrémenter le compteur atomiquement sans trou
  INSERT INTO public.document_counters (organization_id, doc_type, year, last_value)
  VALUES (v_inv.organization_id, 'invoice', v_year, 1)
  ON CONFLICT (organization_id, doc_type, year)
  DO UPDATE SET last_value = document_counters.last_value + 1
  RETURNING last_value INTO v_next_num;

  -- Formater le numéro OHADA (FAC-2026-0001)
  v_formatted_num := 'FAC-' || v_year || '-' || LPAD(v_next_num::text, 4, '0');
  v_token := encode(gen_random_bytes(16), 'hex');

  -- Mettre à jour la facture en statut 'sent'
  UPDATE public.invoices
  SET
    number = v_formatted_num,
    status = 'sent',
    public_token = v_token,
    sent_at = now(),
    updated_at = now()
  WHERE id = p_invoice_id
  RETURNING * INTO v_inv;

  RETURN v_inv;
END;
$$;

-- 15. Activer Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 16. Policies RLS Multi-tenancy
CREATE POLICY "Les membres voient leur organisation"
  ON public.organizations FOR SELECT
  USING (id IN (SELECT org_id FROM public.user_org_ids()));

CREATE POLICY "Les membres voient les clients de leur organisation"
  ON public.clients FOR ALL
  USING (organization_id IN (SELECT org_id FROM public.user_org_ids()));

CREATE POLICY "Les membres lisent les factures de leur organisation"
  ON public.invoices FOR SELECT
  USING (organization_id IN (SELECT org_id FROM public.user_org_ids()));

CREATE POLICY "Accès public par token pour la consultation"
  ON public.invoices FOR SELECT
  USING (public_token IS NOT NULL);

CREATE POLICY "Les membres gèrent les lignes de facture"
  ON public.invoice_items FOR ALL
  USING (invoice_id IN (SELECT id FROM public.invoices WHERE organization_id IN (SELECT org_id FROM public.user_org_ids())));

CREATE POLICY "Les membres gèrent les paiements"
  ON public.payments FOR ALL
  USING (invoice_id IN (SELECT id FROM public.invoices WHERE organization_id IN (SELECT org_id FROM public.user_org_ids())));
