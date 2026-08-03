import { createClient } from '@/lib/supabase/server';
import { ClientInput } from '@/lib/validations/client';

export async function getClientsService() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .is('archived_at', null)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createClientService(input: ClientInput, orgId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .insert({
      organization_id: orgId,
      name: input.name,
      contact_name: input.contactName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      country: input.country,
      rccm: input.rccm,
      ifu: input.ifu,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
