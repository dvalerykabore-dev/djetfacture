export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export interface ClientMock {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  rccm?: string;
  ifu?: string;
  totalInvoiced: number;
  activeOutstanding: number;
  avatarColor: string;
}

export interface InvoiceMock {
  id: string;
  number: string | null;
  clientName: string;
  clientAvatarColor: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  itemsCount: number;
}

export interface DashboardStats {
  totalInvoicedMonth: number;
  totalInvoicedTrend: number;
  totalCollectedMonth: number;
  totalCollectedPercentage: number;
  totalPendingAmount: number;
  totalPendingCount: number;
  totalOverdueAmount: number;
  totalOverdueCount: number;
}

export interface MonthlyRevenueData {
  month: string;
  invoiced: number;
  collected: number;
}

// Données par défaut neutres (Nettoyées pour Supabase live)
export const MOCK_STATS: DashboardStats = {
  totalInvoicedMonth: 0,
  totalInvoicedTrend: 0,
  totalCollectedMonth: 0,
  totalCollectedPercentage: 0,
  totalPendingAmount: 0,
  totalPendingCount: 0,
  totalOverdueAmount: 0,
  totalOverdueCount: 0,
};

export const MOCK_MONTHLY_REVENUE: MonthlyRevenueData[] = [
  { month: 'Jan', invoiced: 0, collected: 0 },
  { month: 'Fév', invoiced: 0, collected: 0 },
  { month: 'Mar', invoiced: 0, collected: 0 },
  { month: 'Avr', invoiced: 0, collected: 0 },
  { month: 'Mai', invoiced: 0, collected: 0 },
  { month: 'Juin', invoiced: 0, collected: 0 },
  { month: 'Juil', invoiced: 0, collected: 0 },
];

export const MOCK_CLIENTS: ClientMock[] = [];

export const MOCK_RECENT_INVOICES: InvoiceMock[] = [];
