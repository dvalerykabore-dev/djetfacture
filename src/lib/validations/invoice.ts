export interface InvoiceLineItemInput {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: bigint;
  discountPercent?: number;
  taxRate?: number;
}

export interface InvoiceInput {
  id?: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItemInput[];
  notes?: string;
}

export const invoiceLineItemSchema = {
  parse: (data: Partial<InvoiceLineItemInput>): InvoiceLineItemInput => {
    return data as InvoiceLineItemInput;
  },
};

export const invoiceSchema = {
  parse: (data: Partial<InvoiceInput>): InvoiceInput => {
    return data as InvoiceInput;
  },
};
