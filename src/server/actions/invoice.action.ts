'use server';

import { revalidatePath } from 'next/cache';
import { invoiceSchema, InvoiceInput } from '@/lib/validations/invoice';
import { createInvoiceDraftService, finalizeInvoiceService } from '../services/invoice.service';

export async function createInvoiceAction(input: InvoiceInput, orgId: string) {
  const validated = invoiceSchema.parse(input);
  const result = await createInvoiceDraftService(validated, orgId);

  revalidatePath('/factures');
  revalidatePath('/tableau-de-bord');
  return { success: true, invoice: result };
}

export async function finalizeInvoiceAction(invoiceId: string) {
  const result = await finalizeInvoiceService(invoiceId);

  revalidatePath('/factures');
  revalidatePath(`/factures/${invoiceId}`);
  revalidatePath('/tableau-de-bord');
  return { success: true, invoice: result };
}
