# AGENTS.md — Système de Design & Règles UI Officielles DJETFACTURE

Ce document définit les règles de design, d'ergonomie et de typographie obligatoires pour toutes les évolutions futures du projet **DJETFACTURE**.

---

## 1. POLICE DE CARACTÈRES & TYPOGRAPHIE
- **Police officielle** : `Inter` (Standard mondial pour la comptabilité, les banques & fintech).
- **Lisibilité des Tableaux (Exigence Comptable)** :
  - Taille de texte minimale pour les lignes de tableau : **`14px` (`text-sm`)**.
  - Noms de clients dans le carnet : **`20px` (`text-xl font-black text-[#0F1A18]`)**.
  - Montants financiers (FCFA) : **Gras haute définition (`font-extrabold text-[#0F1A18]` ou `font-black`)** avec espacement de chiffres tabulaire `tabular-nums`.
- **Contraste de texte** :
  - Textes principaux & titres : `#0F1A18` (Ink Scribe / Noir profond high-contrast).
  - Textes secondaires & labels : `#475569` ou `#5F726E` (Gris foncé lisible).

---

## 2. PALETTE DE COULEURS OFFICIELLE (BRAND DJETFACTURE)
- **Vert Bourse / Vert Forêt Majeur** : `#0B3B36` (Brand 900) — Utilisé pour la sidebar, l'en-tête de document, les boutons d'action principaux et l'état actif des filtres.
- **Vert Émeraude d'Accompagnement** : `#10B981` (Emerald 500) & `#3A8A79` (Brand 500) — Badges actifs, progression, boutons secondaires.
- **Fond de Canva** : `#FAFAF8` (Off-white très doux) pour limiter la fatigue visuelle.
- **Conteneurs & Cartes** : `#FFFFFF` avec bordure fine `#E2E8F0` (`border-slate-200`) et ombre subtile `shadow-sm`.

---

## 3. HARMONISATION ET ÉTATS ACTIFS (SIDEBAR & FILTRES)
- **Sidebar Nav** :
  - Onglet actif : `bg-[#0D4A42] text-white font-bold border-l-4 border-emerald-400 shadow-inner`.
  - Badges de compteur : Fond émeraude contrasté pour l'onglet actif (`bg-emerald-400 text-[#05221F]`).
- **Pills de Filtrage de Factures** :
  - Pill actif : Fond sombre `#0B3B36`, texte blanc `font-extrabold border-[#0B3B36] shadow-md scale-105`.
  - Pills inactifs : Fond `#F1F5F9`, texte lisible `#334155`.

---

## 4. RESPONSIVITÉ & ERGONOMIE MOBILE
- **Mobile (< 768px)** :
  - Sidebar en tiroir coulissant (`-translate-x-full md:translate-x-0`) avec overlay sombre `#sidebar-backdrop`.
  - Bouton Hamburger 🍔 présent dans la barre supérieure.
  - Padding latéral adaptatif : `md:pl-64` sur le conteneur principal.
  - Tableaux dans des conteneurs à défilement tactile horizontal (`overflow-x-auto min-w-[700px]`).

---

## 5. ANIMATIONS & MICRO-INTERACTIONS
- **Entrée de page / Onglet** : `@keyframes fadeInUp` (`0.4s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Cartes** : Élévation 3D au survol (`hover:-translate-y-1 hover:shadow-xl hover:border-brand-300 transition-all`).
- **Boutons** : Animation de pression au clic (`active:scale-95 btn-press-anim`).
- **Graphiques** : Élévation progressive des barres (`@keyframes growUpBar`).
