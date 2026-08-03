import { createClient } from '@/lib/supabase/server';
import { InvoiceInput } from '@/lib/validations/invoice';

export async function getInvoicesService() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_invoices')
    .select('*, clients(name, email, phone)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getInvoiceByIdService(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_invoices')
    .select('*, clients(*), invoice_items(*), payments(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createInvoiceDraftService(input: InvoiceInput, orgId: string) {
  const supabase = createClient();

  // 1. Insert header
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({
      organization_id: orgId,
      client_id: input.clientId,
      issue_date: input.issueDate,
      due_date: input.dueDate,
      status: 'draft',
      notes: input.notes,
    })
    .select()
    .single();

  if (invError) throw new Error(invError.message);

  // 2. Insert items
  const itemsToInsert = input.items.map((item) => {
    const brut = Math.round(item.quantity * Number(item.unitPrice));
    const discount = Math.round((brut * (item.discountPercent || 0)) / 100);
    const lineSubtotal = BigInt(brut - discount);

    return {
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      discount_percent: item.discountPercent || 0,
      tax_rate: item.taxRate || 18,
      line_subtotal: Number(lineSubtotal),
    };
  });

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsToInsert);

  if (itemsError) throw new Error(itemsError.message);

  return invoice;
}

export async function finalizeInvoiceService(invoiceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('finalize_invoice', {
    p_invoice_id: invoiceId,
  });

  if (error) throw new Error(error.message);
  return data;
}
