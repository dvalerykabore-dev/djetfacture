# DJETFACTURE — Plan d'implémentation

> SaaS de facturation pour entrepreneurs africains
> Stack : Next.js 14 (App Router) · TypeScript · Supabase (Postgres/Auth/Storage) · Tailwind CSS · Vercel
> Statut du document : **plan validé avant écriture de code** — mis à jour à chaque fin de phase.

---

## 0. Principes directeurs

Ce produit manipule de l'argent réel et des documents à valeur fiscale. Cinq règles non négociables guident toutes les décisions techniques ci-dessous :

1. **Aucun flottant pour les montants.** Tous les montants sont des entiers (`bigint`) en unité mineure de la devise. Le FCFA (XOF/XAF) a un exposant 0 : 1 500 FCFA se stocke `1500`. Zéro `float`, zéro `parseFloat` sur un montant.
2. **Les totaux sont calculés côté serveur.** Le client affiche un calcul temps réel pour l'UX, mais le serveur recalcule et écrase systématiquement à partir des lignes. Un client malveillant ne peut pas envoyer `total: 1`.
3. **Numérotation séquentielle sans trou.** Exigence fiscale OHADA. Le numéro est attribué atomiquement en base au moment de la finalisation, jamais côté application, jamais sur un brouillon.
4. **Une facture finalisée est immuable.** On ne modifie pas une facture envoyée : on l'annule par un avoir (note de crédit). Modifiable uniquement à l'état brouillon.
5. **RLS d'abord.** Chaque table porte des policies Row Level Security. Le contrôle applicatif est une seconde couche, pas la seule. Un bug de requête ne doit jamais exposer les données d'une autre entreprise.

---

## 1. Contexte métier africain — ce que ça change

Ce n'est pas un clone de FreshBooks avec le symbole € remplacé. Décisions produit spécifiques :

| Sujet | Décision |
|---|---|
| **Devise** | XOF (UEMOA) par défaut, XAF (CEMAC) supporté. Exposant 0 — pas de centimes. Format `1 250 000 F CFA` (espace insécable). Architecture multi-devises dès le schéma, une seule active par organisation en v1. |
| **TVA** | 18 % par défaut (Sénégal, Côte d'Ivoire, Burkina, Mali, Bénin, Togo, Niger). **Configurable** — le Cameroun est à 19,25 %. Taux par ligne pour gérer les exonérations. Cas « TVA non applicable » (franchise / régime du réel simplifié) géré par un flag organisation. |
| **Identifiants fiscaux** | Champs organisation : RCCM (OHADA, commun), + IFU / NINEA / NCC selon le pays, régime fiscal. Affichés sur le PDF — leur absence rend une facture non conforme. |
| **Encaissement** | Le mobile money domine (Orange Money, Wave, MTN MoMo, Moov Money). L'organisation configure ses numéros ; ils s'impriment sur la facture avec les coordonnées bancaires. **v1 = instructions de paiement, pas de passerelle.** Intégration Wave/PayDunya/CinetPay = post-v1. |
| **Distribution** | WhatsApp est le canal réel, pas l'email. Bouton « Envoyer par WhatsApp » avec message pré-rempli + lien public de la facture. L'email (Resend) est le canal secondaire. |
| **Le client n'a pas de compte** | Page publique `/f/[token]` avec token non devinable : le client consulte et télécharge le PDF sans authentification. |
| **Paiements partiels** | Courants et essentiels. Table `payments` dédiée, statuts `partiel` / `payée` dérivés du solde. Ce n'est pas une option v2. |
| **Réseau / appareils** | Mobile-first, 3G. Budget JS strict, Server Components par défaut, pas de librairie de graphes lourde, PDF généré côté serveur. |
| **Langue** | Français uniquement en v1. Formatage centralisé (`lib/format.ts`) pour qu'un ajout d'anglais reste mécanique. |

---

## 2. Stack technique — choix et justifications

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 14.2.x** (App Router), React 18 | Demandé. Server Components = moins de JS envoyé. |
| Langage | TypeScript `strict: true` + `noUncheckedIndexedAccess` | Non négociable sur un produit financier. |
| CSS | **Tailwind v3.4** | v4 encore jeune côté écosystème shadcn ; v3.4 est le choix sûr sur Next 14. |
| Composants | **shadcn/ui** (Radix), restylé aux tokens du design | On possède le code, accessibilité clavier/ARIA gratuite. Pas une dépendance runtime. |
| Formulaires | **React Hook Form + Zod** (`@hookform/resolvers`) | Le même schéma Zod valide le client ET le Server Action. Une seule source de vérité. |
| Mutations | **Server Actions** + `revalidatePath` | Pas de couche API à maintenir. Chaque action = `auth → zod → service → RLS`. |
| Lectures | RSC + client Supabase serveur | Pas de state management global nécessaire. |
| État client | `useState` / `useOptimistic` / `nuqs` pour les filtres d'URL | Pas de Redux/Zustand : le serveur est la source de vérité. |
| Base / Auth / Fichiers | **Supabase** (Postgres 15, Auth, Storage, RLS) | Demandé. Migrations SQL versionnées via Supabase CLI. |
| PDF | **@react-pdf/renderer** | 100 % JS, tourne sur Vercel Node runtime. Puppeteer/Chromium = trop lourd et fragile en serverless. |
| Email | **Resend + React Email** | DX simple, domaine vérifié, bons logs. |
| Tests | **Vitest** (unitaire) · **pgTAP/SQL** (RLS) · **Playwright** (E2E) | Le calcul TVA et l'isolation RLS sont les deux zones à tester en priorité. |
| Qualité | ESLint + Prettier + Husky + lint-staged + `tsc --noEmit` en CI | |
| Déploiement | Vercel (preview par branche) + Supabase cloud | Demandé. |

**Écartés volontairement :** Prisma/Drizzle (redondant avec PostgREST + types générés Supabase, et complique les RLS), tRPC (Server Actions suffisent), NextAuth (Supabase Auth est déjà là), une lib de date lourde (`date-fns` uniquement).

---

## 3. Modèle de données

### 3.1 Multi-tenancy

Modèle **organisation** dès le jour 1, même si 95 % des utilisateurs seront seuls. Ajouter le multi-utilisateur après coup impose une migration de toutes les tables et de toutes les policies : c'est gratuit maintenant, très coûteux plus tard.

```
auth.users ──1:1── profiles
     │
     └──N:M── organization_members ──N:1── organizations
                                                │
                        ┌───────────────────────┼──────────────────────┐
                     clients                 invoices           document_counters
                                                │
                                    ┌───────────┴───────────┐
                              invoice_items              payments
```

### 3.2 Tables

| Table | Rôle | Points clés |
|---|---|---|
| `profiles` | Miroir de `auth.users` | Créée par trigger `on_auth_user_created`. |
| `organizations` | L'entreprise + tous ses paramètres | Identité légale, devise, TVA par défaut, format de numérotation, mentions, coordonnées bancaires et mobile money (`jsonb`), `logo_path`. |
| `organization_members` | Appartenance + rôle | `owner` / `admin` / `member`. Table pivot des RLS. |
| `clients` | Carnet de clients | Archivage logique (`archived_at`) — jamais de suppression dure : les factures historiques doivent rester lisibles. |
| `document_counters` | Compteur `(org, type, année)` | Garantit la numérotation sans trou. |
| `invoices` | En-tête de document | `number` NULL tant que brouillon. Montants en `bigint`. `public_token` unique. `credit_note_of` pour les avoirs. |
| `invoice_items` | Lignes | `quantity numeric(12,3)`, `unit_price bigint`, `tax_rate` **par ligne**, totaux de ligne figés. |
| `payments` | Encaissements | Alimente `invoices.amount_paid` par trigger. Méthode + référence (n° transaction mobile money). |
| `activity_logs` | Piste d'audit | Qui a fait quoi, quand. Attendu sur un produit financier. |

### 3.3 Statuts — la décision importante

`invoices.status` ne stocke que le **cycle de vie explicite** : `draft` · `sent` · `paid` · `cancelled`.

`partial` et `overdue` ne sont **pas stockés** : ce sont des fonctions du solde et de la date du jour. Les stocker impose un cron nocturne et produit des états faux entre deux exécutions. On les dérive dans une vue SQL `v_invoices` :

```
display_status = draft | cancelled | paid | partial | overdue | sent
balance_due    = total - amount_paid
```

L'UI consomme `v_invoices`, jamais `invoices` en lecture. Aucun cron, jamais d'incohérence.

### 3.4 Règles de calcul (spécification exacte à tester)

Pour chaque ligne :
```
brut          = round(quantity × unit_price)
remise        = round(brut × discount_percent / 100)
line_subtotal = brut − remise
```
Puis, TVA calculée **par groupe de taux** (pas par ligne, pour éviter l'accumulation d'arrondis) :
```
base(t)   = Σ line_subtotal des lignes au taux t
tax(t)    = round_half_up(base(t) × t / 100)
tax_total = Σ tax(t)
subtotal  = Σ line_subtotal
total     = subtotal + tax_total
```
Arrondi **half-up au franc entier**. Tout en entiers. `line_tax` et `line_total` sont stockés pour l'affichage, mais les totaux du document font foi.

### 3.5 Sécurité en base

- **Helper RLS** `public.user_org_ids()` en `SECURITY DEFINER` : indispensable, sinon les policies sur `organization_members` récursent à l'infini (piège classique Supabase).
- Policy type : `using (organization_id in (select public.user_org_ids()))`.
- Vue `v_invoices` créée avec `security_invoker = true` pour que la RLS s'applique au travers.
- Trigger d'immuabilité : `UPDATE` refusé sur une facture non-brouillon, sauf colonnes autorisées (`status`, `amount_paid`, `pdf_path`, `sent_at`, `paid_at`, timestamps).
- RPC `finalize_invoice(id)` : transaction unique qui vérifie l'état, recalcule les totaux, tire le numéro, génère le `public_token`, passe en `sent`.
- Storage : bucket `logos` (public en lecture), bucket `invoice-pdfs` (privé, URLs signées 1 h).
- La clé `service_role` n'existe que dans des fichiers marqués `import 'server-only'`.

Le squelette SQL complet est en **Annexe A**.

---

## 4. Arborescence du projet

```
djetfacture/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/            # landing publique
│  │  │  ├─ page.tsx  tarifs/  confidentialite/  cgu/
│  │  ├─ (auth)/
│  │  │  ├─ connexion/  inscription/  mot-de-passe-oublie/
│  │  │  ├─ reinitialiser/  verifier-email/
│  │  ├─ (app)/                  # protégé par middleware
│  │  │  ├─ layout.tsx           # sidebar + topbar + garde org
│  │  │  ├─ tableau-de-bord/
│  │  │  ├─ factures/            page · nouvelle · [id] · [id]/modifier
│  │  │  ├─ clients/             page · nouveau · [id] · [id]/modifier
│  │  │  ├─ parametres/          entreprise · facturation · paiements · compte · equipe
│  │  │  └─ bienvenue/           onboarding (création d'organisation)
│  │  ├─ f/[token]/              # facture publique, sans auth
│  │  ├─ api/invoices/[id]/pdf/  # route handler, runtime nodejs
│  │  └─ auth/callback/
│  ├─ components/
│  │  ├─ ui/                     # primitives shadcn restylées
│  │  ├─ layout/                 # Sidebar, Topbar, MobileNav, PageHeader
│  │  ├─ invoices/               # InvoiceForm, LineItemsEditor, StatusPill, InvoiceTable…
│  │  ├─ clients/  dashboard/  settings/  marketing/
│  ├─ lib/
│  │  ├─ supabase/               client.ts · server.ts · middleware.ts · admin.ts
│  │  ├─ money.ts                # arithmétique entière + arrondis
│  │  ├─ invoice-math.ts         # règles §3.4 — 100 % testé
│  │  ├─ format.ts               # FCFA, dates fr, numéros de téléphone
│  │  ├─ validations/            # schémas Zod partagés client/serveur
│  │  └─ constants/              # pays, devises, taux TVA, méthodes de paiement
│  ├─ server/
│  │  ├─ actions/                # Server Actions (une par domaine)
│  │  └─ services/               # accès données, réutilisable
│  ├─ pdf/                       # templates @react-pdf
│  ├─ emails/                    # templates React Email
│  ├─ types/                     # database.types.ts (généré) + types domaine
│  └─ middleware.ts
├─ supabase/
│  ├─ migrations/                # SQL versionné
│  ├─ seed.sql                   # données de démo réalistes
│  └─ tests/                     # tests RLS
├─ e2e/                          # Playwright
├─ PLAN.md
└─ .env.example
```

**Convention :** routes en français (`/factures`, `/clients`) — l'utilisateur est francophone, l'URL fait partie de l'UX. Code, types et colonnes en anglais.

---

## 5. Système de design

Tokens provisoires extraits de la capture de référence, **à confirmer avec tes captures définitives** :

| Token | Valeur | Usage |
|---|---|---|
| `--brand-900` | `#0B3B36` | Fond sombre, boutons primaires, footer |
| `--brand-700` | `#0D4A42` | Hover, accents |
| `--brand-100` | `#D7EBE4` | Fonds de section, cartes mises en avant |
| `--brand-50` | `#EEF6F3` | Zones douces |
| `--surface` | `#FFFFFF` / `--canvas` `#FAFAF8` | Cartes / fond de page |
| `--ink` `#0F1A18` · `--muted` `#5F726E` | Texte | |
| Statuts | vert `paid` · ambre `sent` · rouge `overdue` · gris `draft` · bleu `partial` | Toujours **pastille colorée + texte** — jamais la couleur seule (accessibilité + impression N&B) |
| Rayons | cartes 16 px · inputs 10 px · boutons pleine pilule | |
| Ombres | très diffuses, basse opacité (`0 1px 2px`, `0 8px 24px -12px`) | |
| Typo | grotesque géométrique, titres gras `tracking-tight`, tabulaires pour les montants (`font-variant-numeric: tabular-nums`) | Les chiffres doivent s'aligner dans les colonnes |

**Inventaire de composants à produire (Phase 1)** — Button, Input, CurrencyInput, Select, Textarea, DatePicker, Checkbox, Switch, Card, StatCard, StatusPill, DataTable (tri + pagination + états vide/chargement), Dialog, Sheet, DropdownMenu, Tabs, Toast, Skeleton, EmptyState, FileUpload (logo), Avatar, Pagination, Breadcrumb, ConfirmDialog, Sidebar, Topbar, MobileNav.

Contraintes transverses : mobile-first strict (le tableau des factures devient une liste de cartes < 768 px), focus visible partout, contraste AA minimum, tous les montants en chiffres tabulaires.

---

## 6. Phases

### Phase 0 — Fondations _(prérequis : rien de visible pour l'utilisateur)_

0. **Installer l'outillage manquant** : `winget install OpenJS.NodeJS.LTS` et `winget install Git.Git` (Node et Git sont absents de la machine), puis Supabase CLI.
1. `create-next-app` (TS, Tailwind, App Router, `src/`, alias `@/*`), pin Next `14.2.x`.
2. ESLint/Prettier/Husky/lint-staged, `tsconfig` strict.
3. Tokens de design dans `tailwind.config.ts` + `globals.css`, polices via `next/font`.
4. `lib/money.ts`, `lib/format.ts`, `lib/invoice-math.ts` **avec leurs tests Vitest** — la logique métier avant l'UI.
5. `.env.example`, README, `git init` + premier commit.

**Critère de sortie :** `npm run build`, `npm run lint`, `npm test` verts. Les tests de calcul TVA/arrondi passent, y compris les cas limites (quantité décimale, remise, taux mixtes, ligne exonérée, total à 0).

---

### Phase 1 — Interface complète en données fictives _(← ici j'utilise tes captures)_

Toutes les pages de l'espace connecté, pixel-cohérentes avec les captures, alimentées par `lib/mock-data.ts`.

| Écran | Contenu |
|---|---|
| Tableau de bord | 4 cartes stats (total factures, montant facturé, encaissé, en attente), graphe CA mensuel léger, dernières factures, top clients, factures en retard |
| Liste factures | DataTable : numéro, client, date, échéance, montant, statut · recherche, filtres statut/période/client (dans l'URL), tri, pagination, actions par ligne |
| Nouvelle facture | Sélection client + création rapide inline, dates, éditeur de lignes dynamique (ajout/suppression/réordonnancement), remise, TVA par ligne, **panneau de totaux temps réel**, notes/conditions, boutons Brouillon / Finaliser |
| Détail facture | Aperçu type document, chronologie des statuts, historique des paiements, actions (PDF, WhatsApp, Email, Marquer payée, Dupliquer, Annuler) |
| Clients | Liste + fiche client (coordonnées, CA total, encours, historique de factures) |
| Paramètres | Entreprise (identité, logo, RCCM/IFU/NINEA) · Facturation (TVA, préfixe et format de numéro, mentions, délai) · Paiements (mobile money, banque) · Compte |
| Transverse | États vides soignés, skeletons, toasts, responsive complet, navigation mobile |

**Critère de sortie :** navigation complète au clic dans toute l'app, sur mobile comme sur desktop, sans une seule ligne de backend.

---

### Phase 2 — Interactivité locale

- Store local (React state + `localStorage`) simulant la persistance : créer/modifier/supprimer factures et clients, changer de statut, enregistrer un paiement.
- Formulaires branchés sur **RHF + Zod** — schémas définitifs, réutilisés tels quels en Phase 3.
- Calcul des totaux via `lib/invoice-math.ts` (le même module que le serveur utilisera).
- Recherche, filtres, tri, pagination réellement fonctionnels ; filtres persistés dans l'URL.
- Génération PDF opérationnelle (template `@react-pdf`) sur données locales.
- Gestion d'erreurs : `error.tsx`, `not-found.tsx`, `loading.tsx` par segment.

**Critère de sortie :** un utilisateur peut faire un cycle complet — créer un client, émettre une facture, la finaliser, enregistrer un paiement, télécharger le PDF — sans réseau. Les schémas Zod sont figés.

---

### Phase 3 — Supabase : base de données et tests

1. Projet Supabase (cloud + local via CLI), variables d'environnement.
2. Migrations SQL : tables, enums, contraintes, index, vue `v_invoices`, triggers (totaux, `amount_paid`, immuabilité, `updated_at`), RPC `finalize_invoice` et `next_document_number`, buckets Storage.
3. **Policies RLS sur chaque table** + helper `user_org_ids()`.
4. Types générés : `supabase gen types typescript` → `types/database.types.ts`.
5. Couche `server/services/*` puis `server/actions/*` (auth → Zod → service → `revalidatePath`).
6. Remplacement du store local par les vraies données, écran par écran.
7. Upload du logo vers Storage, PDF archivé sur Storage à la finalisation.
8. `seed.sql` avec un jeu de données de démonstration crédible.

**Tests de cette phase (les plus importants du projet) :**
- **Isolation RLS** : l'utilisateur A ne peut ni lire, ni modifier, ni supprimer les données de l'organisation B — testé table par table, en lecture comme en écriture.
- **Numérotation** : 50 finalisations concurrentes → 50 numéros consécutifs, aucun doublon, aucun trou.
- **Immuabilité** : `UPDATE` sur facture envoyée rejeté par la base.
- **Intégrité des totaux** : un `total` falsifié envoyé par le client est écrasé par le recalcul serveur.
- **Cohérence des paiements** : `amount_paid` suit toujours la somme des `payments` ; sur-paiement refusé.

**Critère de sortie :** toutes les données viennent de Supabase, la suite de tests RLS passe, aucune requête sans filtre d'organisation.

---

### Phase 4 — Authentification

1. `@supabase/ssr` : clients navigateur / serveur / middleware.
2. `middleware.ts` : rafraîchissement de session, protection du groupe `(app)`, redirection `?next=` vers la page demandée, exclusion de `/f/[token]` et des assets.
3. Écrans : inscription, connexion, mot de passe oublié, réinitialisation, vérification d'email, déconnexion.
4. Trigger `handle_new_user` → `profiles`.
5. **Onboarding `/bienvenue`** : création de l'organisation (nom, pays, devise, TVA, logo) — bloquant tant qu'aucune organisation n'existe. C'est la première impression du produit, elle doit être soignée.
6. Garde serveur dans `(app)/layout.tsx` : le middleware protège, le layout vérifie l'appartenance à une organisation. Défense en profondeur.
7. Rôles : `owner`/`admin` peuvent modifier les paramètres, `member` non (préparation de la Phase équipe).

**Critère de sortie :** impossible d'atteindre une page de `(app)` sans session valide ; la page publique `/f/[token]` reste accessible ; les E2E d'auth passent.

---

### Phase 5 — Landing page

Page marketing selon les captures : hero + accroche, capture produit, preuve sociale/chiffres, sections fonctionnalités, « Comment ça marche » en 3 étapes, tarification en FCFA, témoignages, FAQ en accordéon, CTA final, footer.

Plus : métadonnées SEO + OpenGraph, `sitemap.ts`, `robots.ts`, JSON-LD, pages légales (CGU, confidentialité, mentions), formulaire de contact, Lighthouse ≥ 95 sur mobile.

---

### Phase 6 — Durcissement, E2E et déploiement

**Sécurité :** en-têtes (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`) ; rate limiting sur auth, envoi d'email et `/f/[token]` ; validation Zod sur toute entrée ; audit anti-fuite de la `service_role` dans le bundle client ; vérification que `unstable_cache` n'est jamais utilisé sur des données par utilisateur ; upload logo restreint (type MIME, taille, dimensions) ; token public en `nanoid(32)` ; audit `npm audit` + revue des dépendances.

**Tests E2E Playwright :** inscription → onboarding → création client → facture → finalisation → PDF → paiement → statut payée ; parcours retard ; annulation/avoir ; isolation multi-comptes ; responsive mobile ; accessibilité clavier.

**Performance :** budget JS par route, `next/image` partout, polices en `display: swap`, index Postgres vérifiés par `EXPLAIN ANALYZE` sur les requêtes de liste, pagination côté serveur.

**Déploiement :** Supabase production (migrations appliquées, backups activés, mots de passe/JWT vérifiés), Vercel (env vars par environnement, domaine, previews), Resend (domaine vérifié, SPF/DKIM), monitoring (Sentry + Vercel Analytics), puis **re-test complet en production**.

**Critère de sortie :** application en ligne, parcours complet rejoué en production, checklist sécurité signée.

---

## 7. Jalons

| Phase | Contenu | Poids |
|---|---|---|
| 0 | Fondations + logique métier testée | ~5 % |
| 1 | UI complète en données fictives | ~30 % |
| 2 | Interactivité + PDF | ~15 % |
| 3 | Supabase + RLS + tests | ~25 % |
| 4 | Auth + onboarding | ~10 % |
| 5 | Landing + SEO | ~8 % |
| 6 | Durcissement + déploiement | ~7 % |

---

## 8. Risques identifiés

| Risque | Parade |
|---|---|
| Erreurs d'arrondi sur la TVA | Arithmétique entière + module unique + tests exhaustifs dès la Phase 0 |
| Trous dans la numérotation (non conformité fiscale) | Compteur atomique en base, jamais côté app ; test de concurrence |
| Fuite de données entre organisations | RLS sur tout + tests d'isolation dédiés + garde applicative |
| Récursion infinie des policies RLS | Helper `SECURITY DEFINER` — piège connu, traité dès la première migration |
| PDF lourd/instable en serverless | `@react-pdf` (pur JS) plutôt que Chromium ; polices sous-ensemblées |
| Fuite de cache Next entre utilisateurs | Interdiction d'utiliser `unstable_cache` sur des données utilisateur ; audit Phase 6 |
| Modification d'une facture déjà envoyée | Trigger d'immuabilité + parcours avoir |
| Dérive du périmètre v1 | Liste « hors périmètre » ci-dessous, tenue fermement |

---

## 9. Périmètre v1 — et ce qui en est exclu

**Inclus :** dashboard, factures (CRUD, statuts, PDF, partage public, WhatsApp, email), clients, paiements partiels, paramètres entreprise/facturation/paiements, auth + onboarding, landing.

**Hors périmètre v1, à prévoir ensuite :** devis et bons de commande (le schéma est déjà prêt via `doc_type`), factures récurrentes, relances automatiques, passerelles de paiement mobile money, multi-utilisateurs et invitations, dépenses/comptabilité, exports comptables SYSCOHADA, anglais, application mobile, plans d'abonnement et facturation du SaaS lui-même.

---

## 10. Décisions par défaut retenues (à corriger si tu n'es pas d'accord)

1. Multi-organisation dès le schéma, mono-utilisateur dans l'UI v1.
2. Facture finalisée strictement immuable, annulation par avoir.
3. Paiements partiels inclus en v1.
4. PDF + partage public + WhatsApp inclus en v1 ; email inclus, passerelle de paiement exclue.
5. Auth par email/mot de passe (+ lien magique). L'OTP SMS, plus naturel en Afrique, coûte un fournisseur tiers → post-v1.
6. Devise par défaut XOF, TVA 18 %, pays par défaut à confirmer.
7. Routes en français, code en anglais.

---

## Annexe A — Squelette SQL (à affiner en Phase 3)

```sql
-- Types
create type invoice_status as enum ('draft','sent','paid','cancelled');
create type doc_type       as enum ('invoice','quote','credit_note');
create type member_role    as enum ('owner','admin','member');

-- Helper RLS (SECURITY DEFINER : évite la récursion des policies)
create or replace function public.user_org_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select organization_id from organization_members where user_id = auth.uid()
$$;

-- Policy type, appliquée à toutes les tables métier
create policy org_isolation on clients for all
  using  (organization_id in (select public.user_org_ids()))
  with check (organization_id in (select public.user_org_ids()));

-- Numérotation sans trou : le lock de ligne sérialise les concurrents
create or replace function public.next_document_number(p_org uuid, p_type doc_type, p_year int)
returns int language plpgsql security definer as $$
declare v int;
begin
  insert into document_counters (organization_id, doc_type, year, last_value)
  values (p_org, p_type, p_year, 1)
  on conflict (organization_id, doc_type, year)
    do update set last_value = document_counters.last_value + 1
  returning last_value into v;
  return v;
end $$;

-- Statuts dérivés — aucune donnée dupliquée, aucun cron
create view v_invoices with (security_invoker = true) as
select i.*,
       (i.total - i.amount_paid) as balance_due,
       case
         when i.status = 'draft'                              then 'draft'
         when i.status = 'cancelled'                          then 'cancelled'
         when i.total > 0 and i.amount_paid >= i.total        then 'paid'
         when i.amount_paid > 0                               then 'partial'
         when i.due_date < current_date                       then 'overdue'
         else 'sent'
       end as display_status
from invoices i;
```

Contraintes notables : `unique (organization_id, number) where number is not null`, `check (total = subtotal - discount_total + tax_total)`, `check (due_date >= issue_date)`, `check (amount_paid <= total)`.
