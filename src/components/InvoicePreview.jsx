
const formatAmount = (value) => {
  if (value === '-' || value === null || value === undefined || value === '') {
    return value === '-' ? '-' : '0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
};

const formatDate = (date) => {
  if (!date) return '-';

  // Convert YYYY-MM-DD to DD / MM / YYYY
  const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return `${match[3]} / ${match[2]} / ${match[1]}`;
  }

  return date;
};

export default function InvoicePreview({ invoice, totals }) {
  const company = invoice?.seller ?? {};
  const client = invoice?.customer ?? {};
  const bank = invoice?.bank ?? {};
  const transport = invoice?.transportDetails ?? {};

  const items = invoice?.items ?? [];

  const safeTotals = totals ?? {
    items: [],
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    cartage: 0,
    grandTotal: 0
  };

  const customerAddress = [
    client.addressLine1,
    client.addressLine2
  ].filter(Boolean).join(', ');

  const sellerAddress = [
    company.addressLine1,
    company.addressLine2
  ].filter(Boolean).join(', ');

  // Keep eight item rows to match the original HTML template.
  const emptyRows = Math.max(0, 8 - items.length);

  return (
    <div className="invoice-container">
      <table className="invoice-table">
        <tbody>

          {/* Invoice Header */}
          <tr>
            <td colSpan={18} className="invoice-title">
              TAX INVOICE
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="font-bold">GST</td>
            <td colSpan={4}>{company.gstNumber || '-'}</td>

            <td><strong>PH</strong></td>
            <td colSpan={3}>{company.phone || '-'}</td>

            <td colSpan={2} className="font-bold">INV NO</td>
            <td colSpan={6} className="text-center font-bold">
              {invoice?.invoiceNumber || '-'}
            </td>
          </tr>

          {/* Seller and Transport Details */}
          <tr>
            <td colSpan={10} className="font-bold company-name">
              {company.name || '-'}
              <br />

              <span className="company-tagline">
                {company.tagline || ''}
              </span>

              <br />

              <span className="company-address">
                {sellerAddress}
              </span>
            </td>

            <td colSpan={8}>
              <div className="invoice-meta-wrapper">

                <div className="invoice-date-row">
                  <strong>DATE:</strong>
                  <span>{formatDate(invoice?.date)}</span>
                </div>

                <hr className="invoice-divider" />

                <table className="text-left meta-sub-table">
                  <tbody>
                    <tr>
                      <td><strong>GR No.:</strong></td>
                      <td>{transport.grNo || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>Vehicle No.:</strong></td>
                      <td>{transport.vehicleNo || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>Transport:</strong></td>
                      <td>{transport.transport || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>Place:</strong></td>
                      <td>{transport.place || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>State Code:</strong></td>
                      <td>{transport.stateCode || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>Eway No.:</strong></td>
                      <td>{transport.ewayNo || '-'}</td>
                    </tr>

                    <tr>
                      <td><strong>Marka:</strong></td>
                      <td>{transport.marka || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>

          {/* Buyer Details */}
          <tr>
            <td colSpan={2} className="font-bold">NAME</td>
            <td colSpan={10} className="text-left">
              {client.name || '-'}
            </td>

            <td><strong>PH</strong></td>
            <td colSpan={5} className="text-left">
              {client.phone || '-'}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="font-bold">ADDRESS</td>
            <td colSpan={16} className="text-left">
              {customerAddress || '-'}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="font-bold">GST NO.</td>
            <td colSpan={16} className="text-left">
              {client.gstNumber || '-'}
            </td>
          </tr>

          {/* Item Table Headers */}
          <tr className="bg-header-alt">
            <td rowSpan={2} className="text-center font-bold">S.NO.</td>

            <td colSpan={4} rowSpan={2} className="text-center font-bold">
              PARTICULAR
            </td>

            <td rowSpan={2} className="text-center font-bold">
              HSN CODE
            </td>

            <td colSpan={2} rowSpan={2} className="text-center font-bold">
              QUANTITY
            </td>

            <td rowSpan={2} className="text-center font-bold">
              RATE (₹)
            </td>

            <td colSpan={2} rowSpan={2} className="text-center font-bold">
              TAXABLE AMOUNT (₹)
            </td>

            <td rowSpan={2} className="text-center font-bold">
              GST %
            </td>

            <td colSpan={3} rowSpan={2} className="text-center font-bold">
              GST AMOUNT(₹)
            </td>

            <td colSpan={3} className="text-center font-bold">
              TOTAL AMOUNT
            </td>
          </tr>

          <tr className="bg-header-alt">
            <td colSpan={3} className="text-center font-bold">
              ₹ / p
            </td>
          </tr>

          {/* Dynamic Item Rows */}
          {items.map((item, index) => {
            const calculatedItem = safeTotals.items?.[index] ?? {};

            return (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>

                <td colSpan={4}>
                  {item.description || '-'}
                </td>

                <td className="text-center">
                  {item.hsnCode || '-'}
                </td>

                <td className="text-right">
                  {item.quantity ?? ''}
                </td>

                <td>{item.unit || '-'}</td>

                <td className="text-right">
                  {formatAmount(item.unitPriceRupee)}
                </td>

                <td colSpan={2} className="text-right">
                  {formatAmount(calculatedItem.taxableAmount)}
                </td>

                <td className="text-center">
                  {item.gstRate ?? 0}
                </td>

                <td colSpan={3} className="text-right">
                  {formatAmount(calculatedItem.gstAmount)}
                </td>

                <td colSpan={3} className="text-right font-bold">
                  {formatAmount(calculatedItem.totalAmount)}
                </td>
              </tr>
            );
          })}

          {/* Empty Rows for Fixed Invoice Height */}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="text-center"></td>
              <td colSpan={4}></td>
              <td className="text-center"></td>
              <td className="text-right"></td>
              <td></td>
              <td className="text-right"></td>
              <td colSpan={2} className="text-right"></td>
              <td className="text-center"></td>
              <td colSpan={3} className="text-right"></td>
              <td colSpan={3} className="text-right font-bold"></td>
            </tr>
          ))}

          {/* Totals and Bank Details */}
          <tr>
            <td colSpan={10} className="text-left font-bold">
              BANK: {bank.name || '-'}
              {bank.branch ? ` (${bank.branch})` : ''}
            </td>

            <td colSpan={4}>
              <strong>TAXABLE AMOUNT (₹)</strong>
            </td>

            <td colSpan={4} className="text-right font-bold">
              {formatAmount(safeTotals.taxableAmount)}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="text-left font-bold">A/C No</td>
            <td colSpan={8} className="text-left">
              {bank.accountNo || '-'}
            </td>

            <td colSpan={4}><strong>CGST 9% (₹)</strong></td>
            <td colSpan={4} className="text-right">
              {formatAmount(safeTotals.cgst)}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="text-left font-bold">IFSC Code</td>
            <td colSpan={8} className="text-left">
              {bank.ifsc || '-'}
            </td>

            <td colSpan={4}><strong>SGST 9% (₹)</strong></td>
            <td colSpan={4} className="text-right">
              {formatAmount(safeTotals.sgst)}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="text-left font-bold">UPI ID</td>
            <td colSpan={8} className="text-left">
              {bank.upi || '-'}
            </td>

            <td colSpan={4}><strong>IGST 18% (₹)</strong></td>
            <td colSpan={4} className="text-right">
              {formatAmount(safeTotals.igst)}
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="text-left font-bold">₹ IN WORDS</td>

            <td colSpan={8} className="text-left font-bold">
              {safeTotals.inWords || '-'}
            </td>

            <td colSpan={4}>
              <strong>CARTAGE &amp; PACKING (₹)</strong>
            </td>

            <td colSpan={4} className="text-right">
              {formatAmount(safeTotals.cartage)}
            </td>
          </tr>

          {/* Conditions and Grand Total */}
          <tr>
            <td colSpan={10} rowSpan={2} className="text-left conditions-cell">
              <strong>CONDITIONS ON SALE:</strong>
              <br />

              {(invoice?.conditions ?? []).map((condition, index) => (
                <span key={index}>
                  {condition}
                  <br />
                </span>
              ))}
            </td>

            <td colSpan={4} className="font-bold bg-total-light">
              GRAND TOTAL
            </td>

            <td colSpan={4} className="text-right font-bold grand-total-amount">
              ₹{formatAmount(safeTotals.grandTotal)}
            </td>
          </tr>

          {/* Signature */}
          <tr>
            <td colSpan={8} className="signature-cell">
              <img
                src="/signature.png"
                alt="Authorized signature"
                className="signature-image"
              />

              <strong>{company.name || '-'}</strong>
              <br />

              <span className="signature-subtitle">
                AUTHORISED SIGNATORY
              </span>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}
