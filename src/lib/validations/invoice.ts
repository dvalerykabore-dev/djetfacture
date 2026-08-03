import { z } from 'zod';

export const invoiceLineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().positive('La quantité doit être supérieure à 0'),
  unitPrice: z.bigint().nonnegative('Le prix unitaire ne peut pas être négatif'),
  discountPercent: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).default(18),
});

export const invoiceSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, 'Veuillez sélectionner un client'),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  items: z.array(invoiceLineItemSchema).min(1, 'Au moins une ligne de facture est requise'),
  notes: z.string().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceLineItemInput = z.infer<typeof invoiceLineItemSchema>;
