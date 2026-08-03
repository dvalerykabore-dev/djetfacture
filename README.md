# 🚀 DJETFACTURE — SaaS de Facturation OHADA & FCFA

DJETFACTURE est une plateforme de facturation et de suivi financier conçue spécifiquement pour les entrepreneurs, indépendants et PME en Afrique (UEMOA / CEMAC).

---

## 📌 Principes directeurs & Spécificités Métier

1. **Arithmétique Entière FCFA** :
   - Tous les montants sont gérés en entiers (`bigint`) sans aucun flottant. Le FCFA ayant un exposant `0`, `1 500 FCFA` se stocke `1500`.
   - Les totaux sont recalculés et vérifiés côté serveur.

2. **Numérotation OHADA Atomique et Immuable** :
   - Numérotation séquentielle sans trou (`FAC-2026-0001`) attribuée atomiquement en base de données lors de la finalisation via RPC Postgres (`finalize_invoice`).
   - Facture envoyée immuable (toute modification s'effectue par un Avoir).

3. **Infrastructures d'Encaissement & Distribution Locales** :
   - Instructions de règlement **Wave, Orange Money, MTN MoMo** imprimées directement sur le document.
   - Bouton de distribution et de relance d'impayés **WhatsApp** avec message pré-rempli et lien public sécurisé `/f/[token]`.

4. **Multi-Tenancy & Sécurité RLS** :
   - Row Level Security (RLS) activée sur toutes les tables.
   - Helper `SECURITY DEFINER` `public.user_org_ids()` évitant les boucles de récursion.

---

## 🛠 Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript Strict (`noUncheckedIndexedAccess`)
- **CSS** : Tailwind CSS v3.4
- **Base / Auth / Storage** : Supabase (Postgres 15, Auth, Storage RLS)
- **Validation** : Zod & React Hook Form
- **Formattage** : Centralisé dans `lib/format.ts` (Dates `JJ/MM/AAAA`, FCFA, Téléphones)

---

## 📂 Architecture des Fichiers

```
src/
├─ app/
│  ├─ (marketing)/            # Landing page, CGU, Confidentialité
│  ├─ (auth)/                 # Connexion, Inscription, Mot de passe oublié
│  ├─ (app)/                  # Espace connecté protégé par middleware
│  │  ├─ tableau-de-bord/     # Dashboard 4 cartes, graphique CA mensuel, factures
│  │  ├─ factures/            # Liste, nouvelle facture, détail [id]
│  │  ├─ clients/             # Carnet de clients, fiche [id]
│  │  ├─ parametres/          # Identité légale, RCCM, Mobile Money
│  │  └─ bienvenue/           # Onboarding entreprise bloquant
│  ├─ f/[token]/              # Page publique de consultation de facture sans auth
│  └─ layout.tsx
├─ components/
│  ├─ ui/                     # StatusPill, StatCard
│  ├─ layout/                 # Sidebar, Topbar
│  ├─ invoices/               # InvoiceTable, InvoiceForm
│  ├─ clients/                # ClientList
│  └─ dashboard/              # RevenueChart, RecentInvoicesTable, OverdueAlertCard
├─ lib/
│  ├─ format.ts               # Formattage FCFA & dates fr
│  ├─ money.ts                # Arithmétique entière
│  ├─ invoice-math.ts         # Calculs de totaux et TVA par groupe de taux
│  ├─ mock-data.ts            # Données de démonstration régionales
│  └─ validations/            # Zod schemas (Invoice, Client, Org)
supabase/
└─ migrations/
   └─ 20260725000000_init_schema.sql  # Schema Postgres complet & RLS
```

---

## 🚀 Déploiement

1. **Supabase** : Importer `supabase/migrations/20260725000000_init_schema.sql` dans votre projet Supabase.
2. **Vercel** : Déployer le dépôt Next.js 14 en renseignant les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
