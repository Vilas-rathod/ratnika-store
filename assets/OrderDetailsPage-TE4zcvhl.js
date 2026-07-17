import{i as C,f as A,l as E,j as e}from"./vendor-state-D1igwH1h.js";import{a2 as O,a9 as P,w as L,X as f,a5 as S,a3 as T,h as D,y as g}from"./vendor-ui-B4mCORxv.js";import{A as j,H as k,X as R,Y as I,P as _,B as x,Z as b,c as v,_ as z}from"./index-BKP1tHmu.js";import{C as o,a as c}from"./card-BjwjXx__.js";import{S as F}from"./separator-CeHt6r9x.js";import{P as q,O as B}from"./OrderStatusBadge-CP6TMGzM.js";import{a as i,b as y}from"./format-BhbiR9Dc.js";import{o as N}from"./order.service-B-DjxjfI.js";import{f as Q,b as M,L as U}from"./vendor-react-CBAmdPt2.js";function H(t){const m=t.items.map((r,p)=>`
      <tr>
        <td>${p+1}</td>
        <td>${r.name}${r.variantLabel?`<br/><small>${r.variantLabel}</small>`:""}</td>
        <td class="num">${r.quantity}</td>
        <td class="num">${i(r.price)}</td>
        <td class="num">${i(r.price*r.quantity)}</td>
      </tr>`).join(""),n=t.shippingAddress,s=`<!doctype html><html><head><meta charset="utf-8"/>
  <title>Invoice ${t.orderNumber}</title>
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
        <div class="brand">${j}</div>
        <div class="muted">${k}<br/>${R} · ${I}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:18px;font-weight:bold">TAX INVOICE</div>
        <div class="muted">#${t.orderNumber}<br/>${y(t.createdAt)}</div>
      </div>
    </div>

    <h1>Billed To</h1>
    <div class="muted">
      ${n.fullName}<br/>
      ${n.line1}${n.line2?", "+n.line2:""}<br/>
      ${n.city}, ${n.state} - ${n.pincode}<br/>
      ${n.phone}
    </div>

    <table>
      <thead><tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
      <tbody>${m}</tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${i(t.subtotal)}</span></div>
      ${t.discount?`<div><span>Discount${t.couponCode?` (${t.couponCode})`:""}</span><span>-${i(t.discount)}</span></div>`:""}
      <div><span>Shipping</span><span>${t.shippingFee===0?"FREE":i(t.shippingFee)}</span></div>
      <div class="grand"><span>Total</span><span>${i(t.total)}</span></div>
      <div class="muted" style="margin-top:8px"><span>Payment</span><span>${t.paymentMethod}</span></div>
    </div>

    <div class="foot">Thank you for shopping with ${j}! · This is a computer-generated invoice.</div>
    <script>window.onload = function(){ window.print(); }<\/script>
  </body></html>`,d=window.open("","_blank","width=800,height=900");d&&(d.document.write(s),d.document.close())}function se(){const{id:t}=Q(),m=M(),n=C(),{data:s,isLoading:d}=A({queryKey:["order",t],queryFn:()=>N.getOrder(t),enabled:!!t}),r=E({mutationFn:()=>N.cancelOrder(s.id,"Cancelled by customer"),onSuccess:()=>{g.success("Order cancelled"),n.invalidateQueries({queryKey:["order",t]}),n.invalidateQueries({queryKey:["orders"]})},onError:a=>g.error(a.message)});if(d)return e.jsx(_,{label:"Loading order…"});if(!s)return e.jsxs("div",{className:"py-16 text-center",children:[e.jsx("p",{className:"text-lg font-semibold",children:"Order not found"}),e.jsx(x,{asChild:!0,className:"mt-4",children:e.jsx(U,{to:"/account/orders",children:"Back to Orders"})})]});const p=s.status==="CANCELLED",h=b.indexOf(s.status),w=!["SHIPPED","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"].includes(s.status);return e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>m("/account/orders"),className:"mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",children:[e.jsx(O,{className:"h-4 w-4"})," Back to orders"]}),e.jsxs("div",{className:"mb-6 flex flex-wrap items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"font-display text-2xl font-semibold",children:["Order #",s.orderNumber]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Placed on ",y(s.createdAt)]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(q,{status:s.paymentStatus}),e.jsx(B,{status:s.status}),e.jsxs(x,{variant:"outline",size:"sm",onClick:()=>H(s),children:[e.jsx(P,{className:"h-4 w-4"})," Invoice"]})]})]}),e.jsxs("div",{className:"grid gap-6 lg:grid-cols-[1fr_340px]",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx(o,{children:e.jsxs(c,{className:"p-6",children:[e.jsxs("h2",{className:"mb-4 flex items-center gap-2 text-lg font-semibold",children:[e.jsx(L,{className:"h-5 w-5 text-primary"})," Order Tracking"]}),p?e.jsxs("div",{className:"flex items-center gap-3 rounded-lg bg-[var(--info-soft)] p-4 text-sm",children:[e.jsx(f,{className:"h-5 w-5 text-destructive"}),e.jsx("span",{children:"This order was cancelled."})]}):e.jsx("ol",{className:"relative ml-3 border-l-2 border-border",children:b.map((a,l)=>{const u=l<=h,$=l===h;return e.jsxs("li",{className:"mb-6 ml-6 last:mb-0",children:[e.jsx("span",{className:v("absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full",u?"bg-primary text-primary-foreground":"bg-muted"),children:u?e.jsx(S,{className:"h-4 w-4"}):e.jsx(T,{className:"h-3 w-3"})}),e.jsx("p",{className:v("text-sm font-medium",$&&"text-primary"),children:z[a]})]},a)})}),s.trackingNumber&&e.jsxs("div",{className:"mt-2 rounded-lg border border-border p-3 text-sm",children:[e.jsxs("p",{className:"text-muted-foreground",children:["Courier: ",e.jsx("span",{className:"font-medium text-foreground",children:s.courierName})]}),e.jsxs("p",{className:"text-muted-foreground",children:["Tracking #: ",e.jsx("span",{className:"font-mono font-medium text-foreground",children:s.trackingNumber})]})]})]})}),e.jsx(o,{children:e.jsxs(c,{className:"p-6",children:[e.jsxs("h2",{className:"mb-4 text-lg font-semibold",children:["Items (",s.items.length,")"]}),e.jsx("div",{className:"space-y-4",children:s.items.map((a,l)=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx("img",{src:a.imageUrl,alt:a.name,className:"h-16 w-16 rounded-md border border-border object-cover"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"font-medium",children:a.name}),a.variantLabel&&e.jsx("p",{className:"text-xs text-muted-foreground",children:a.variantLabel}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Qty: ",a.quantity]})]}),e.jsx("span",{className:"font-medium",children:i(a.price*a.quantity)})]},l))})]})}),w&&e.jsxs(x,{variant:"outline",className:"text-destructive hover:text-destructive",onClick:()=>r.mutate(),loading:r.isPending,children:[e.jsx(f,{className:"h-4 w-4"})," Cancel Order"]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsx(o,{children:e.jsxs(c,{className:"p-6",children:[e.jsxs("h2",{className:"mb-3 flex items-center gap-2 font-semibold",children:[e.jsx(D,{className:"h-4 w-4 text-primary"})," Delivery Address"]}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.jsx("p",{className:"font-medium text-foreground",children:s.shippingAddress.fullName}),e.jsxs("p",{children:[s.shippingAddress.line1,s.shippingAddress.line2?`, ${s.shippingAddress.line2}`:""]}),e.jsxs("p",{children:[s.shippingAddress.city,", ",s.shippingAddress.state," -"," ",s.shippingAddress.pincode]}),e.jsx("p",{children:s.shippingAddress.phone})]})]})}),e.jsx(o,{children:e.jsxs(c,{className:"space-y-2 p-6 text-sm",children:[e.jsx("h2",{className:"mb-3 font-semibold",children:"Payment Summary"}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Subtotal"}),e.jsx("span",{children:i(s.subtotal)})]}),s.discount>0&&e.jsxs("div",{className:"flex justify-between text-[var(--success)]",children:[e.jsx("span",{children:"Discount"}),e.jsxs("span",{children:["−",i(s.discount)]})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Shipping"}),e.jsx("span",{children:s.shippingFee===0?"FREE":i(s.shippingFee)})]}),e.jsx(F,{className:"my-2"}),e.jsxs("div",{className:"flex justify-between font-semibold",children:[e.jsx("span",{children:"Total"}),e.jsx("span",{children:i(s.total)})]}),e.jsxs("p",{className:"pt-2 text-xs text-muted-foreground",children:["Paid via ",s.paymentMethod==="COD"?"Cash on Delivery":"Razorpay"]})]})})]})]})]})}export{se as default};
