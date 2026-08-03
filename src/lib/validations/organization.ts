import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2, 'La raison sociale est requise'),
  rccm: z.string().min(3, 'Le numéro RCCM est obligatoire pour la conformité OHADA'),
  ifu: z.string().optional(),
  ninea: z.string().optional(),
  taxRegime: z.string().default('Régime Réel Simplifié'),
  currency: z.string().default('XOF'),
  defaultTaxRate: z.number().default(18),
  phone: z.string().min(8, 'Le téléphone de l’entreprise est requis'),
  email: z.string().email('Email d’entreprise invalide'),
  address: z.string().min(5, 'L’adresse du siège est requise'),
  city: z.string().min(1, 'La ville est requise'),
  country: z.string().min(1, 'Le pays est requis'),
  waveNumber: z.string().optional(),
  orangeMoneyNumber: z.string().optional(),
  mtnNumber: z.string().optional(),
  bankRIB: z.string().optional(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
