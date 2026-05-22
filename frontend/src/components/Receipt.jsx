import { formatPrice } from '../utils/currency';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function Receipt({ receipt, onPrint }) {
  if (!receipt) return null;

  return (
    <article className="receipt" id="print-receipt">
      <header className="receipt-header">
        <p className="receipt-brand">{receipt.businessName}</p>
        <h2>Receipt</h2>
        <p className="receipt-meta">
          <span>No. {receipt.receiptNumber}</span>
          <span>{formatDate(receipt.issuedAt)}</span>
        </p>
        <p className="receipt-customer">Customer: {receipt.customerName}</p>
      </header>

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item) => (
            <tr key={item.id}>
              <td>{item.itemName}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.itemPrice)}</td>
              <td>{formatPrice(item.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <strong>Bill total</strong>
            </td>
            <td>
              <strong>{formatPrice(receipt.totalAmount)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <p className="receipt-thanks">Thank you for your order</p>

      {onPrint && (
        <>
          <p className="receipt-sms-note">
            After you print, a thank-you text will be sent to the mobile number on your account.
          </p>
          <button type="button" className="btn btn-sm btn-primary receipt-print-btn" onClick={onPrint}>
            Print receipt
          </button>
        </>
      )}
    </article>
  );
}
