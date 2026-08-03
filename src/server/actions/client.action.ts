'use server';

import { revalidatePath } from 'next/cache';
import { clientSchema, ClientInput } from '@/lib/validations/client';
import { createClientService } from '../services/client.service';

export async function createClientAction(input: ClientInput, orgId: string) {
  const validated = clientSchema.parse(input);
  const result = await createClientService(validated, orgId);

  revalidatePath('/clients');
  revalidatePath('/factures/nouvelle');
  return { success: true, client: result };
}
