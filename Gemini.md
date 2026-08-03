# 🚀 DJETFACTURE — Guide d'Architecture, Spécifications & Instructions IA

> **Document Officiel de Référence du Projet DJETFACTURE**  
> Ce fichier recense la vision, les fonctionnalités implémentées, l'architecture des fichiers, les choix techniques et les consignes obligatoires pour tout agent IA travaillant sur ce dépôt.

---

## 📋 1. Présentation Générale du Projet

**DJETFACTURE** est une solution SaaS moderne de facturation, de comptabilité et de gestion de la relation client spécialement conçue pour les entreprises et indépendants de l'espace **OHADA / UEMOA** (Sénégal, Burkina Faso, Côte d'Ivoire, etc.).

### Caractéristiques Clés :
- **Devise Nationale & Régionale** : Gestion intégrale en **FCFA (XOF)** avec formatage tabulaire à lisibilité comptable (`tabular-nums font-extrabold`).
- **Fiscalité Conforme** : Gestion dynamique et verrouillable des taux de TVA (**18% Standard UEMOA/OHADA**, **10% Réduit**, **5%**, **0% Exonéré**).
- **Canaux de Paiement Locaux** : Mobile Money (**Wave**, **Orange Money**, **MTN MoMo**) & virement bancaire RIB imprimables sur factures.
- **Rôle Administrateur & Sécurité** : Contrôle dynamique des droits d'accès, verrous de sécurité et traçabilité complète via un Journal d'Activité (**Audit Log**).

---

## 🛠️ 2. Technologies Utilisées

| Domaine | Technologie | Description |
| :--- | :--- | :--- |
| **Framework Web** | Next.js (App Router) | React 18, TypeScript, architecture par composants |
| **Styling & Design System** | Tailwind CSS / Vanilla CSS | Système de design basé sur `.agents/AGENTS.md` |
| **Icônes** | Lucide React | Icônes vectorielles épurées pour la Fintech |
| **Typographie** | Google Fonts - `Inter` | Police officielle fintech & comptabilité internationale |
| **Démo Autonome** | `preview.html` | Application HTML5/JS Vanilla monopage complète et autonome |

---

## 🔥 3. Fonctionnalités Implémentées

### A. Tableau de Bord Financier (`/dashboard` & `#tab-dashboard`)
- **KPIs en Temps Réel** : Chiffre d'Affaires Encaissé, En Attente de Règlement, Factures en Retard, Nombre de Clients Actifs.
- **Graphiques d'Évolution** : Barres de progression avec animations fluides au chargement (`@keyframes growUpBar`).
- **Dérouleur des Factures Récents** : Synchronisation dynamique des 5 dernières factures créées.

### B. Gestion des Factures (`/factures` & `#tab-factures`)
- **Filtrage par Pilules Interactives** : *Toutes*, *Envoyées*, *Payées*, *En retard*, *Partielles*, *Brouillons*. Les compteurs de chaque pilule se mettent à jour en temps réel.
- **Calculs Automatiques** : Calcul instantané `HT = Quantité × Prix Unitaire`, `TVA = HT × Taux%`, `Total TTC = HT + TVA`.
- **Formulaire d'Émission** : Dates par défaut automatiques (Émission = Aujourd'hui, Échéance = +14 jours), sélecteur de client avec option d'ajout rapide.
- **Actions Riches Uniformes** :
  - `📥 PDF` : Téléchargement et impression avec filigrane et logo d'entreprise.
  - `📋 Dupliquer` : Création instantanée d'un nouveau document basé sur une facture existante.
  - `🚫 Annuler` : Archivage en lecture seule sans comptabilisation dans le CA actif.
  - `🗑️ Supprimer` : Suppression irréversible avec modale de confirmation (soumise aux règles admin).

### C. Carnet des Clients (`/clients` & `#tab-clients`)
- **Cartes Commerciales 3D** : Affichage des coordonnées (WhatsApp, Email, RCCM), du CA cumulé facturé et du solde restant dû.
- **Boutons d'Actions Alignés** : `✏️ Modifier`, `📦 Archiver` et `🗑️ Supprimer` disposés de façon 100% uniforme et responsive sur une seule ligne.
- **Compteur Dynamique** : Mise à jour automatique des badges lors de l'ajout ou de la suppression d'un client.

### D. Sécurité, Droits d'Accès & Traçabilité (`/parametres` & `#tab-parametres`)
- **Sélecteur de Rôle (`👑 Admin` vs `👤 Utilisateur Standard`)** : Placé dans l'en-tête topbar pour tester et basculer instantanément de profil.
- **Section 5 - Contrôle des Permissions Admin** :
  - 🔒 *Verrouiller la modification des factures*
  - 🔒 *Verrouiller la suppression des factures*
  - 🔒 *Verrouiller la suppression des clients*
  - 🔒 *Verrouiller l'annulation des factures*
  - 🔒 *Verrouiller la modification de la TVA* (Taux de TVA officiel imposé aux utilisateurs)
- **Section 6 - Journal d'Activité (Audit Log)** : Enregistrement automatique de chaque opération (Création, Modification, Duplication, Annulation, Suppression, Réglages de sécurité) avec horodatage et nom de l'utilisateur.
- **Réservation Exclusive Administrateur** : Pour un *Utilisateur Standard*, les Sections 5 et 6 sont **strictement masquées** et remplacées par la bannière `🔒 Accès Réservé à l'Administrateur`.

### E. Identité Visuelle & Filigrane
- **Logo d'Entreprise** : Chargement de logo personnalisé avec affichage instantané sur l'en-tête de la facture PDF.
- **Filigrane (Watermark)** : Texte diagonal discret personnalisable avec contrôle de l'opacité (4%, 6%, 10%, 15%).

---

## 🎨 4. Palette de Couleurs & Charte Graphique (`.agents/AGENTS.md`)

- **Vert Bourse / Forêt Majeur** : `#0B3B36` (Barre latérale, en-têtes, boutons principaux).
- **Vert Émeraude** : `#10B981` & `#3A8A79` (Badges actifs, progression, boutons secondaires).
- **Fond de Canvas** : `#FAFAF8` (Off-white doux évitant la fatigue visuelle).
- **Contraste Texte Ink** : `#0F1A18` (Titres et montants à haute définition).
- **Police Officielle** : `Inter` (Standard pour les applications fintech et bancaires).

---

## 📁 5. Arborescence du Projet

```text
DJETFACTURE/
├── .agents/
│   └── AGENTS.md                  # Système de design & règles UI officielles
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/page.tsx # Vue Tableau de bord Next.js
│   │   │   ├── factures/
│   │   │   │   ├── page.tsx       # Listing & Filtres de factures
│   │   │   │   ├── nouvelle/      # Formulaire de création
│   │   │   │   └── [id]/          # Vue de détail & impression PDF
│   │   │   ├── clients/           # Répertoire & Cartes clients
│   │   │   └── parametres/        # Options entreprise & Panneau Sécurité Admin
│   │   ├── layout.tsx             # Layout global avec Sidebar et Topbar
│   │   └── page.tsx               # Redirection / Accueil
│   ├── components/
│   │   ├── layout/                # Sidebar, Topbar, Navigation
│   │   ├── invoices/              # InvoiceTable, InvoiceForm, StatusPill
│   │   ├── clients/               # ClientList, ClientCard, ClientModal
│   │   └── security/              # AuditLogTable, PermissionsPanel
│   └── lib/
│       ├── invoice-math.ts        # Calculs exacts HT, TVA et TTC (BigInt)
│       ├── format.ts              # Formatage des montants FCFA et dates FR
│       └── mock-data.ts           # Données de démonstration
├── preview.html                   # Démo statique monobloc 100% fonctionnelle
├── Gemini.md                      # Fichier de connaissances IA (ce fichier)
└── walkthrough.md                 # Journal d'évolution et étapes complétées
```

---

## 🤖 6. Instructions Strictes pour les Futurs Modèles IA

Tout agent ou modèle IA appelé à modifier ce projet **DOIT STRICTEMENT RESPECTER** les consignes suivantes :

1. **Règle de Politesse Globale** :
   - Toute réponse générée pour l'utilisateur **DOIT OBLIGATOIREMENT COMMENCER PAR** :  
     `BONJOUR DJETEBWAOGGA !`

2. **Synchronisation Bipolaire Obligatoire** :
   - Toute modification apportée dans l'un des composants React (`/src/...`) **DOIT ÊTRE ÉGALEMENT RÉCUTÉE DANS `preview.html`** et vice-versa. `preview.html` est l'artefact de démonstration directe du client.

3. **Préservation du Système de Design (`.agents/AGENTS.md`)** :
   - La police doit rester **`Inter`**.
   - Le libellé des paiements mobiles doit s'écrire simplement **"Wave"** (jamais "Wave Sénégal" ou "Wave Côte d'Ivoire").
   - Les montants financiers doivent être formatés en FCFA avec la classe `tabular-nums font-extrabold`.

4. **Contrôle d'Accès & Verrouillage** :
   - Vérifier systématiquement si le rôle actif est `admin` ou `user` lors de l'affichage de boutons d'action sensibles (`Supprimer`, `Modifier`, `Annuler`).
   - Si un verrou est actif pour l'utilisateur simple, afficher le badge cadenas `🔒 Action restreinte`.

5. **Responsivité & Ergonomie Mobile** :
   - Conserver l'alignement uniforme des boutons sur une seule ligne avec la classe `flex flex-wrap items-center justify-between gap-2`.
   - Ne jamais altérer la lisibilité des cartes sur smartphone.
