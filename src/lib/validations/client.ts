import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'La raison sociale doit comporter au moins 2 caractères'),
  contactName: z.string().min(2, 'Le nom du contact est requis'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone est requis'),
  address: z.string().optional(),
  city: z.string().min(1, 'La ville est requise'),
  country: z.string().min(1, 'Le pays est requis'),
  rccm: z.string().optional(),
  ifu: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
