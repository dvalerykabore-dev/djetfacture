import { createClient } from './client';

export interface ClientRecord {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  rccm?: string;
  ifu?: string;
  created_at?: string;
}

export interface OrganizationRecord {
  id?: string;
  name: string;
  rccm?: string;
  ifu?: string;
  ninea?: string;
  tax_regime?: string;
  currency?: string;
  default_tax_rate?: number;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  bank_details?: any;
  mobile_money?: any;
  logo_path?: string;
}

export interface InvoiceRecord {
  id: string;
  organization_id?: string;
  client_id: string;
  number: string | null;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  notes?: string;
  public_token?: string;
  client_name?: string;
}

// 1. Service Client
export async function getClientsFromSupabase(): Promise<ClientRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Erreur chargement clients Supabase:', error.message);
    return [];
  }

  return data || [];
}

export async function createClientInSupabase(clientData: Partial<ClientRecord>): Promise<ClientRecord | null> {
  const supabase = createClient();
  
  // Obtenir ou créer une organisation par défaut
  let orgId = await getDefaultOrganizationId();
  
  const payload = {
    organization_id: orgId,
    name: clientData.name,
    contact_name: clientData.contact_name || clientData.name,
    email: clientData.email || '',
    phone: clientData.phone || '',
    city: clientData.city || 'Dakar',
    country: clientData.country || 'Sénégal',
    rccm: clientData.rccm || '',
    ifu: clientData.ifu || '',
  };

  const { data, error } = await supabase
    .from('clients')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Erreur création client Supabase:', error.message);
    throw error;
  }

  return data;
}

export async function deleteClientInSupabase(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) {
    console.error('Erreur suppression client Supabase:', error.message);
    return false;
  }
  return true;
}

// 2. Service Organisation
export async function getDefaultOrganizationId(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.from('organizations').select('id').limit(1);
  
  if (data && data.length > 0 && data[0]) {
    return data[0].id;
  }

  // Si aucune organisation n'existe encore, en créer une par défaut
  const { data: newOrg, error } = await supabase
    .from('organizations')
    .insert([{
      name: 'Mon Entreprise',
      country: 'Sénégal',
      currency: 'XOF',
      default_tax_rate: 18.00
    }])
    .select()
    .single();

  if (error || !newOrg) {
    return '00000000-0000-0000-0000-000000000000';
  }

  return newOrg.id;
}

export async function getOrganizationSettings(): Promise<OrganizationRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('organizations').select('*').limit(1).single();
  if (error) return null;
  return data;
}

export async function saveOrganizationSettings(settings: Partial<OrganizationRecord>): Promise<OrganizationRecord | null> {
  const supabase = createClient();
  const orgId = await getDefaultOrganizationId();

  const { data, error } = await supabase
    .from('organizations')
    .update(settings)
    .eq('id', orgId)
    .select()
    .single();

  if (error) {
    console.error('Erreur sauvegarde paramètres Supabase:', error.message);
    return null;
  }

  return data;
}

// 3. Service Factures
export async function getInvoicesFromSupabase(): Promise<InvoiceRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Erreur lecture factures Supabase:', error.message);
    return [];
  }

  return (data || []).map((inv: any) => ({
    ...inv,
    client_name: inv.clients?.name || 'Client',
  }));
}

export async function createInvoiceInSupabase(invoiceData: {
  client_id: string;
  issue_date: string;
  due_date: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }>;
}): Promise<InvoiceRecord | null> {
  const supabase = createClient();
  const orgId = await getDefaultOrganizationId();

  let subtotal = 0;
  let tax_total = 0;

  invoiceData.items.forEach(item => {
    const lineSub = Math.round(item.quantity * item.unit_price);
    const lineTax = Math.round(lineSub * (item.tax_rate / 100));
    subtotal += lineSub;
    tax_total += lineTax;
  });

  const total = subtotal + tax_total;

  const { data: inv, error: invErr } = await supabase
    .from('invoices')
    .insert([{
      organization_id: orgId,
      client_id: invoiceData.client_id,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      subtotal,
      tax_total,
      total,
      notes: invoiceData.notes || '',
      status: 'draft'
    }])
    .select()
    .single();

  if (invErr || !inv) {
    console.error('Erreur création facture Supabase:', invErr?.message);
    throw invErr;
  }

  // Insérer les lignes de facture
  const itemsPayload = invoiceData.items.map(item => {
    const line_subtotal = Math.round(item.quantity * item.unit_price);
    return {
      invoice_id: inv.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      line_subtotal
    };
  });

  await supabase.from('invoice_items').insert(itemsPayload);

  return inv;
}
