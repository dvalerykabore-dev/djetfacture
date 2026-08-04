export interface OrganizationInput {
  name: string;
  rccm?: string;
  ifu?: string;
  ninea?: string;
  taxRegime?: string;
  currency?: string;
  defaultTaxRate?: number;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  waveNumber?: string;
  orangeMoneyNumber?: string;
  mtnNumber?: string;
  bankRIB?: string;
}

export const organizationSchema = {
  parse: (data: Partial<OrganizationInput>): OrganizationInput => {
    return data as OrganizationInput;
  },
};
