export interface ClientInput {
  id?: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  country: string;
  rccm?: string;
  ifu?: string;
}

export function validateClientInput(data: Partial<ClientInput>): boolean {
  if (!data.name || data.name.trim().length < 2) return false;
  if (!data.contactName || data.contactName.trim().length < 2) return false;
  if (!data.email) return false;
  return true;
}

export const clientSchema = {
  parse: (data: Partial<ClientInput>): ClientInput => {
    return data as ClientInput;
  },
};
