// Payment adapter. The app only calls Payments.pay(); swap providers in config.js.
// "demo"     – simulated gateway (no money moves) for prototyping.
// "razorpay" – Razorpay Checkout. Orders MUST be created and signatures verified on YOUR server
//              (secret key never goes in the browser). See README for the two endpoints.
window.Payments = (() => {
  const cfg = () => SCHOOL.payment;

  function demo({ amount, method }) {
    return new Promise((resolve, reject) => {
      const m = document.createElement("div");
      m.className = "modal";
      m.innerHTML = `<div class="box center"><h2>Demo payment</h2>
        <p class="muted">Simulated ${method.toUpperCase()} gateway – no real money is charged.</p>
        <p style="font-size:2rem;font-weight:800;margin:10px 0">₹${amount.toLocaleString("en-IN")}</p>
        <div class="row" style="justify-content:center">
          <button class="btn orange" data-r="ok">Pay now</button>
          <button class="btn ghost" data-r="fail">Fail</button>
          <button class="btn ghost" data-r="cancel">Cancel</button></div></div>`;
      document.body.appendChild(m);
      m.onclick = e => {
        const r = e.target.dataset.r; if (!r) return;
        m.remove();
        if (r === "ok") resolve({ id: "pay_demo_" + Date.now().toString(36), method, provider: "demo" });
        else reject(new Error(r === "fail" ? "Payment failed. Please try again." : "Payment cancelled."));
      };
    });
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load payment gateway"));
      document.head.appendChild(s);
    });
  }

  async function razorpay({ amount, description, customer, method, reference }) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    const orderRes = await fetch(cfg().ordersEndpoint, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100, currency: SCHOOL.currency, receipt: reference }) });
    if (!orderRes.ok) throw new Error("Could not start payment");
    const order = await orderRes.json();
    return new Promise((resolve, reject) => {
      const rz = new Razorpay({
        key: cfg().razorpayKeyId, order_id: order.id, amount: order.amount, currency: order.currency,
        name: SCHOOL.name, description, theme: { color: "#0057B8" },
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        handler: async r => {
          const v = await fetch(cfg().verifyEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
          v.ok ? resolve({ id: r.razorpay_payment_id, method, provider: "razorpay" }) : reject(new Error("Payment could not be verified"));
        },
        modal: { ondismiss: () => reject(new Error("Payment cancelled.")) }
      });
      rz.on("payment.failed", e => reject(new Error(e.error.description)));
      rz.open();
    });
  }

  return { pay: opts => (cfg().provider === "razorpay" ? razorpay(opts) : demo(opts)) };
})();
