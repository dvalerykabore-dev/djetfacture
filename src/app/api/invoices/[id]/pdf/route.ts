import { NextRequest, NextResponse } from 'next/server';
import { MOCK_RECENT_INVOICES } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = MOCK_RECENT_INVOICES.find((i) => i.id === params.id) || MOCK_RECENT_INVOICES[0]!;

  // Placeholder for serverless PDF binary generation response
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <title>Facture ${invoice.number || 'Brouillon'}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #0F1A18; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0B3B36; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #0B3B36; }
        .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .table th { background: #EEF6F3; padding: 10px; text-align: left; font-size: 12px; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; }
        .total { text-align: right; margin-top: 30px; font-size: 18px; font-weight: bold; color: #0B3B36; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">Kaboré Prestations SARL</div>
          <p style="font-size: 12px; color: #5F726E;">RCCM: SN-DKR-2024-B-1234 • NINEA: 009823412</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #0B3B36;">${invoice.number || 'Facture'}</h2>
          <p style="font-size: 12px; color: #5F726E;">Date: ${invoice.issueDate} • Échéance: ${invoice.dueDate}</p>
        </div>
      </div>

      <div style="margin-top: 20px; font-size: 12px;">
        <strong>Facturé à :</strong> ${invoice.clientName}
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Désignation</th>
            <th style="text-align: center;">Qté</th>
            <th style="text-align: right;">Prix HT</th>
            <th style="text-align: right;">Total HT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Audit financier & Prestation de développement</td>
            <td style="text-align: center;">1</td>
            <td style="text-align: right;">${invoice.subtotal} FCFA</td>
            <td style="text-align: right;">${invoice.subtotal} FCFA</td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        TOTAL NET À PAYER : ${invoice.total} FCFA
      </div>
    </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
