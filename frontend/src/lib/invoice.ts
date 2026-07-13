import type { Order } from '@/types';
import { APP_NAME, HQ_CITY, SUPPORT_EMAIL, SUPPORT_PHONE } from './constants';
import { formatDateTime, formatINR } from './format';

/**
 * Generates a printable HTML invoice and opens the browser print
 * dialog (which can "Save as PDF"). No external PDF library needed.
 */
export function downloadInvoice(order: Order): void {
  const rows = order.items
    .map(
      (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${it.name}${it.variantLabel ? `<br/><small>${it.variantLabel}</small>` : ''}</td>
        <td class="num">${it.quantity}</td>
        <td class="num">${formatINR(it.price)}</td>
        <td class="num">${formatINR(it.price * it.quantity)}</td>
      </tr>`,
    )
    .join('');

  const addr = order.shippingAddress;
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
  <title>Invoice ${order.orderNumber}</title>
  <style>
    * { font-family: Arial, Helvetica, sans-serif; }
    body { margin: 40px; color: #1a1a1a; }
    .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #a16207; padding-bottom:16px; }
    .brand { font-size:26px; font-weight:bold; color:#a16207; }
    h1 { font-size:20px; margin:24px 0 4px; }
    .muted { color:#666; font-size:13px; }
    table { width:100%; border-collapse:collapse; margin-top:20px; font-size:14px; }
    th, td { border-bottom:1px solid #ddd; padding:10px; text-align:left; }
    th { background:#faf3e6; }
    .num { text-align:right; }
    .totals { margin-top:16px; width:280px; margin-left:auto; font-size:14px; }
    .totals div { display:flex; justify-content:space-between; padding:4px 0; }
    .grand { font-weight:bold; font-size:16px; border-top:2px solid #a16207; margin-top:6px; padding-top:8px; }
    .foot { margin-top:40px; text-align:center; color:#888; font-size:12px; }
  </style></head><body>
    <div class="head">
      <div>
        <div class="brand">${APP_NAME}</div>
        <div class="muted">${HQ_CITY}<br/>${SUPPORT_EMAIL} · ${SUPPORT_PHONE}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:18px;font-weight:bold">TAX INVOICE</div>
        <div class="muted">#${order.orderNumber}<br/>${formatDateTime(order.createdAt)}</div>
      </div>
    </div>

    <h1>Billed To</h1>
    <div class="muted">
      ${addr.fullName}<br/>
      ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}<br/>
      ${addr.city}, ${addr.state} - ${addr.pincode}<br/>
      ${addr.phone}
    </div>

    <table>
      <thead><tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${formatINR(order.subtotal)}</span></div>
      ${order.discount ? `<div><span>Discount${order.couponCode ? ` (${order.couponCode})` : ''}</span><span>-${formatINR(order.discount)}</span></div>` : ''}
      <div><span>Shipping</span><span>${order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}</span></div>
      <div class="grand"><span>Total</span><span>${formatINR(order.total)}</span></div>
      <div class="muted" style="margin-top:8px"><span>Payment</span><span>${order.paymentMethod}</span></div>
    </div>

    <div class="foot">Thank you for shopping with ${APP_NAME}! · This is a computer-generated invoice.</div>
    <script>window.onload = function(){ window.print(); }</script>
  </body></html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
