"use strict";
/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); };
const uid = p => p + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
const P = SCHOOL.programmes, byId = id => P.find(p => p.id === id);

/* ---------- storage (prototype: browser localStorage; replace with your API in production) ---------- */
const KEY = "isk_db_v1";
const DB = {
  data: null,
  load() {
    try { this.data = JSON.parse(localStorage.getItem(KEY)); } catch { this.data = null; }
    if (!this.data) { this.data = { applications: [], students: [], payments: [] }; this.seed(); this.save(); }
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* storage unavailable */ } },
  seed() {
    const prog = byId("nursery");
    this.data.students.push({ id: "ISK-1001", name: "Aarav Sharma", programme: "nursery", parent: "Neha Sharma", phone: "9876543210",
      instalments: [
        { id: "i1", label: "Term 1 Tuition", amount: prog.tuition * 4, due: "2026-04-10", paid: true, payId: "pay_demo_seed" },
        { id: "i2", label: "Term 2 Tuition", amount: prog.tuition * 4, due: "2026-08-10", paid: false },
        { id: "i3", label: "Term 3 Tuition", amount: prog.tuition * 4, due: "2026-12-10", paid: false },
        { id: "i4", label: "Activity & Materials", amount: 3000, due: "2026-11-01", paid: false }
      ] });
    this.data.payments.push({ id: "pay_demo_seed", ref: "RCPT-0001", student: "ISK-1001", items: ["Term 1 Tuition"], amount: prog.tuition * 4, method: "upi", date: "2026-04-08T10:00:00Z", kind: "fee" });
  }
};
DB.load();

/* ---------- receipts ---------- */
function receiptHTML(p) {
  return `<div class="card success" id="receipt"><div class="big">🎉</div><h2>Payment received</h2>
    <p class="muted">Thank you! A copy is saved in this app.</p>
    <dl class="sum" style="text-align:left;margin:14px 0">
      <dt>Receipt</dt><dd>${esc(p.ref)}</dd><dt>Date</dt><dd>${fmtDate(p.date)}</dd>
      <dt>For</dt><dd>${esc(p.items.join(", "))}</dd><dt>Reference</dt><dd>${esc(p.student)}</dd>
      <dt>Method</dt><dd>${esc(p.method.toUpperCase())}</dd><dt>Transaction</dt><dd>${esc(p.id)}</dd></dl>
    <div class="tot"><span>Total paid</span><span>${inr(p.amount)}</span></div>
    <div class="row" style="margin-top:16px;justify-content:center"><button class="btn navy" onclick="window.print()">Print / Save PDF</button>
    <a class="btn ghost" href="#/">Home</a></div></div>`;
}
function recordPayment({ txn, items, amount, ref, kind }) {
  const rec = { id: txn.id, ref: "RCPT-" + String(DB.data.payments.length + 1).padStart(4, "0"), student: ref, items, amount, method: txn.method, date: new Date().toISOString(), kind };
  DB.data.payments.push(rec); return rec;
}
const methodPicker = () => `<div class="methods" role="radiogroup" aria-label="Payment method">
  ${[["upi", "📱 UPI (GPay, PhonePe, Paytm)"], ["card", "💳 Debit / Credit card"], ["netbanking", "🏦 Net banking"]].map(([v, l], i) =>
    `<label class="method"><input type="radio" name="method" value="${v}" ${i ? "" : "checked"}> ${l}</label>`).join("")}</div>`;

/* ---------- views ---------- */
const views = {};

views.home = () => `
<section class="hero"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>
  <div class="inner"><span class="chip yellow" style="color:#000">Admissions ${esc(SCHOOL.academicYear)}</span>
    <h1 style="margin-top:8px">Where little learners<br>grow big dreams</h1>
    <p>A joyful, play-based preparatory and foundational school for ages 1½ to 5½. Apply and pay fees securely, right from your phone.</p>
    <div class="row"><a class="btn red" href="#/admissions">Apply for admission</a><a class="btn white" href="#/fees">Pay fees</a></div></div></section>
<div class="wrap">
  <div class="quick">
    <a class="q red" href="#/admissions"><span class="ic">📝</span>Apply Online</a>
    <a class="q sky" href="#/fees"><span class="ic">💳</span>Pay Fees</a>
    <a class="q orange" href="#/programmes"><span class="ic">🎒</span>Programmes</a>
    <a class="q navy" href="#/admissions/status"><span class="ic">🔎</span>Track Application</a>
  </div>
  <div class="stat"><div class="red"><b>1:10</b>teacher ratio</div><div class="sky"><b>4</b>programmes</div><div class="orange"><b>100%</b>play-based</div></div>
  <section class="sec"><h2>What's new</h2><div class="grid c3">${SCHOOL.news.map(n => `
    <article class="card"><span class="chip ${n.color}">${esc(n.tag)}</span><h3 style="margin-top:8px">${esc(n.title)}</h3><p class="muted">${esc(n.text)}</p></article>`).join("")}</div></section>
  <section class="sec"><h2>Why parents love us</h2><div class="grid c2">
    ${[["🌈", "Joyful learning", "Colour, music, stories and movement every day."], ["🛡️", "Safe & caring", "CCTV, trained staff and a nurturing environment."],
       ["📱", "Everything in the app", "Apply, track admission, pay fees, download receipts."], ["🧠", "Ready for Grade 1", "Language, numeracy and social skills built step by step."]]
      .map(([e, t, d]) => `<div class="card"><h3>${e} ${t}</h3><p class="muted">${d}</p></div>`).join("")}</div></section>
</div>${footer()}`;

views.programmes = () => `<div class="wrap"><h1>Our programmes</h1><p class="muted">Age as on 31 July ${SCHOOL.academicYear.slice(0, 4)}.</p>
  <div class="grid c2" style="margin-top:14px">${P.map(p => `<article class="card prog ${p.color}"><div class="em">${p.emoji}</div><h2>${esc(p.name)}</h2><p class="muted">${esc(p.blurb)}</p>
    <dl><dt>Age</dt><dd>${esc(p.age)}</dd><dt>Timings</dt><dd>${esc(p.hours)}</dd><dt>Admission fee</dt><dd>${inr(p.admission)}</dd><dt>Tuition</dt><dd>${inr(p.tuition)} / month</dd></dl>
    <a class="btn ${p.color === "navy" ? "navy" : p.color}" href="#/admissions?p=${p.id}">Apply for ${esc(p.name)}</a></article>`).join("")}</div></div>${footer()}`;

/* --- Admissions --- */
let draft = {}, step = 1;
const stepBar = n => `<div class="steps" aria-label="Step ${n} of 3">${[1, 2, 3].map(i => `<i class="${i < n ? "done" : i === n ? "now" : ""}"></i>`).join("")}</div>`;

views.admissions = (q) => {
  if (q.p && !draft.programme) draft.programme = q.p;
  const f = (k, d = "") => esc(draft[k] ?? d);
  if (step === 1) return `<div class="wrap"><h1>Apply online</h1><p class="muted">3 quick steps · Application fee ${inr(SCHOOL.applicationFee)}</p>${stepBar(1)}
  <form class="card" id="f1" novalidate><h2>👶 About your child</h2>
    <label>Child's full name<input name="child" required autocomplete="off" value="${f("child")}"></label>
    <div class="f2"><label>Date of birth<input type="date" name="dob" required value="${f("dob")}" max="${new Date().toISOString().slice(0, 10)}"></label>
    <label>Gender<select name="gender" required>${["", "Girl", "Boy", "Prefer not to say"].map(g => `<option ${draft.gender === g ? "selected" : ""} value="${g}">${g || "Select…"}</option>`).join("")}</select></label></div>
    <label>Programme<select name="programme" required><option value="">Select…</option>${P.map(p => `<option value="${p.id}" ${draft.programme === p.id ? "selected" : ""}>${esc(p.name)} (${esc(p.age)})</option>`).join("")}</select></label>
    <label>Allergies / medical notes (optional)<textarea name="medical" rows="2">${f("medical")}</textarea></label>
    <button class="btn red block">Next →</button></form></div>`;
  if (step === 2) return `<div class="wrap"><h1>Apply online</h1>${stepBar(2)}
  <form class="card" id="f2" novalidate><h2>👨‍👩‍👧 Parent / guardian</h2>
    <label>Parent's full name<input name="parent" required value="${f("parent")}" autocomplete="name"></label>
    <div class="f2"><label>Mobile number<input name="phone" type="tel" inputmode="numeric" required maxlength="10" placeholder="10-digit mobile" value="${f("phone")}" autocomplete="tel-national"></label>
    <label>Email<input name="email" type="email" required value="${f("email")}" autocomplete="email"></label></div>
    <label>Home address<textarea name="address" rows="2" required>${f("address")}</textarea></label>
    <div class="row"><button type="button" class="btn ghost" id="back">← Back</button><button class="btn red" style="flex:1">Review →</button></div></form></div>`;
  const pr = byId(draft.programme);
  return `<div class="wrap"><h1>Review & pay</h1>${stepBar(3)}
  <div class="card"><dl class="sum"><dt>Child</dt><dd>${esc(draft.child)}</dd><dt>Date of birth</dt><dd>${fmtDate(draft.dob)}</dd><dt>Gender</dt><dd>${esc(draft.gender)}</dd>
    <dt>Programme</dt><dd>${esc(pr.name)}</dd><dt>Parent</dt><dd>${esc(draft.parent)}</dd><dt>Mobile</dt><dd>${esc(draft.phone)}</dd><dt>Email</dt><dd>${esc(draft.email)}</dd></dl>
    <div class="tot"><span>Application fee</span><span>${inr(SCHOOL.applicationFee)}</span></div></div>
  <form class="card" id="f3"><h2>Pay securely</h2>${methodPicker()}
    <label class="check"><input type="checkbox" required id="agree"> I confirm the details are correct and agree to the school's admission policy. The application fee is non-refundable.</label>
    <div class="row"><button type="button" class="btn ghost" id="back">← Back</button><button class="btn orange" style="flex:1">Pay ${inr(SCHOOL.applicationFee)} & submit</button></div>
    <p class="lock">🔒 Payments are processed securely. We never store card details.</p></form></div>`;
};

views.status = () => `<div class="wrap"><h1>Track application</h1>
  <form class="card" id="track"><label>Application ID<input name="id" required placeholder="e.g. ISA-ABC12" style="text-transform:uppercase"></label>
  <label>Parent mobile<input name="phone" type="tel" required maxlength="10"></label><button class="btn navy">Check status</button></form><div id="result"></div></div>`;

/* --- Fees --- */
let session = null;
views.fees = () => {
  if (!session) return `<div class="wrap"><h1>Pay school fees</h1><p class="muted">Sign in with the Student ID and the parent's mobile number registered with the school.</p>
  <form class="card" id="login"><label>Student ID<input name="id" required placeholder="ISK-1001" style="text-transform:uppercase"></label>
  <label>Parent mobile<input name="phone" type="tel" required maxlength="10" placeholder="9876543210"></label><button class="btn navy">View fees</button>
  <p class="lock">Demo account: <b>ISK-1001</b> / <b>9876543210</b></p></form></div>`;
  const s = DB.data.students.find(x => x.id === session); if (!s) { session = null; return views.fees(); }
  const today = new Date().toISOString().slice(0, 10);
  const due = s.instalments.filter(i => !i.paid), paidTotal = s.instalments.filter(i => i.paid).reduce((a, i) => a + i.amount, 0);
  const myPays = DB.data.payments.filter(p => p.student === s.id).reverse();
  return `<div class="wrap"><div class="row" style="justify-content:space-between;align-items:center"><div><h1>${esc(s.name)}</h1><p class="muted">${esc(byId(s.programme)?.name)} · ${esc(s.id)}</p></div>
    <button class="btn ghost" id="logout">Sign out</button></div>
  <div class="stat"><div class="orange"><b>${inr(due.reduce((a, i) => a + i.amount, 0))}</b>outstanding</div><div class="sky"><b>${inr(paidTotal)}</b>paid so far</div></div>
  <form class="card" id="payform"><h2>Fee schedule</h2>
    ${s.instalments.map(i => { const over = !i.paid && i.due < today; return `<label class="inst">${i.paid ? "" : `<input type="checkbox" name="inst" value="${i.id}" style="width:auto" checked>`}
      <span class="grow"><b>${esc(i.label)}</b><br><small class="muted">Due ${fmtDate(i.due)}</small></span><span>${inr(i.amount)}</span>
      <span class="pill ${i.paid ? "paid" : over ? "over" : "due"}">${i.paid ? "Paid" : over ? "Overdue" : "Due"}</span></label>`; }).join("")}
    ${due.length ? `<div class="tot"><span>Selected</span><span id="sel">${inr(0)}</span></div>${methodPicker()}<button class="btn orange block" id="paybtn">Pay now</button>
      <p class="lock">🔒 Secure payment · instant receipt</p>` : `<p class="center">🎉 All fees are paid. Thank you!</p>`}</form>
  <div class="card"><h2>Receipts</h2>${myPays.length ? myPays.map(p => `<div class="inst"><span class="grow"><b>${esc(p.ref)}</b><br><small class="muted">${fmtDate(p.date)} · ${esc(p.items.join(", "))}</small></span><span>${inr(p.amount)}</span><button class="btn ghost" data-rcpt="${esc(p.id)}" style="padding:6px 14px">View</button></div>`).join("") : `<p class="muted">No payments yet.</p>`}</div></div>`;
};

views.contact = () => `<div class="wrap"><h1>Say hello 👋</h1><div class="grid c2">
  <div class="card"><h3>Visit us</h3><p>${esc(SCHOOL.address)}</p><p class="muted">${esc(SCHOOL.hours)}</p></div>
  <div class="card"><h3>Talk to us</h3><p><a href="tel:${esc(SCHOOL.phone.replace(/\s/g, ""))}">${esc(SCHOOL.phone)}</a><br><a href="mailto:${esc(SCHOOL.email)}">${esc(SCHOOL.email)}</a></p>
    <a class="btn orange" href="https://wa.me/${esc(SCHOOL.whatsapp)}" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div>
  <form class="card" id="enq"><h2>Send an enquiry</h2><label>Your name<input name="n" required></label><label>Mobile<input name="p" type="tel" required></label>
  <label>Message<textarea name="m" rows="3" required></textarea></label><button class="btn navy">Send</button></form></div>${footer()}`;

/* --- Admin (demo) --- */
let adminOK = false;
views.admin = () => {
  if (!adminOK) return `<div class="wrap"><h1>Staff login</h1><form class="card" id="alogin"><label>PIN<input type="password" name="pin" inputmode="numeric" required></label><button class="btn navy">Sign in</button>
    <p class="lock">Demo PIN is set in config.js. Replace with real authentication before launch.</p></form></div>`;
  const a = DB.data.applications, pays = DB.data.payments;
  const rev = pays.reduce((s, p) => s + p.amount, 0);
  return `<div class="wrap"><div class="row" style="justify-content:space-between"><h1>Office dashboard</h1><button class="btn ghost" id="alogout">Sign out</button></div>
  <div class="stat"><div class="red"><b>${a.length}</b>applications</div><div class="sky"><b>${a.filter(x => x.status === "approved").length}</b>approved</div><div class="orange"><b>${inr(rev)}</b>collected</div></div>
  <div class="card scroll"><h2>Applications</h2><table><tr><th>ID</th><th>Child</th><th>Class</th><th>Parent</th><th>Status</th><th></th></tr>
  ${a.length ? a.slice().reverse().map(x => `<tr><td>${esc(x.id)}</td><td>${esc(x.child)}<br><small class="muted">${fmtDate(x.dob)}</small></td><td>${esc(byId(x.programme)?.name)}</td>
    <td>${esc(x.parent)}<br><small>${esc(x.phone)}</small></td><td><span class="pill ${esc(x.status)}">${esc(x.status)}</span></td>
    <td>${x.status === "submitted" || x.status === "waitlist" ? `<button class="btn navy" style="padding:4px 12px" data-ap="${esc(x.id)}">Approve</button> <button class="btn ghost" style="padding:4px 12px" data-wl="${esc(x.id)}">Waitlist</button>` : ""}</td></tr>`).join("") : `<tr><td colspan="6" class="muted">No applications yet.</td></tr>`}</table></div>
  <div class="card scroll"><h2>Payments</h2><table><tr><th>Receipt</th><th>Date</th><th>Ref</th><th>For</th><th>Amount</th></tr>
  ${pays.slice().reverse().map(p => `<tr><td>${esc(p.ref)}</td><td>${fmtDate(p.date)}</td><td>${esc(p.student)}</td><td>${esc(p.items.join(", "))}</td><td>${inr(p.amount)}</td></tr>`).join("")}</table></div></div>`;
};

function footer() {
  return `<footer class="foot"><b>${esc(SCHOOL.name)}</b> · ${esc(SCHOOL.tagline)}<br>${esc(SCHOOL.address)}<br>${esc(SCHOOL.phone)} · ${esc(SCHOOL.email)}<br><a href="#/admin" style="color:#9cc3f0">Staff login</a></footer>`;
}

/* ---------- event wiring per view ---------- */
const wire = {};
const val = (form, rules) => {
  let ok = true;
  form.querySelectorAll(".err").forEach(e => e.remove()); form.querySelectorAll(".bad").forEach(e => e.classList.remove("bad"));
  for (const [name, test, msg] of rules) {
    const el = form.elements[name]; if (!el) continue;
    if (!test(el.value.trim())) { ok = false; el.classList.add("bad"); el.insertAdjacentHTML("afterend", `<span class="err">${msg}</span>`); }
  }
  return ok;
};
const phoneOK = v => /^[6-9]\d{9}$/.test(v);

wire.admissions = () => {
  const back = $("#back"); if (back) back.onclick = () => { step--; render(); };
  const f1 = $("#f1"), f2 = $("#f2"), f3 = $("#f3");
  if (f1) f1.onsubmit = e => { e.preventDefault();
    const bad = !val(f1, [["child", v => v.length > 1, "Enter your child's name"], ["dob", v => !!v, "Select date of birth"], ["gender", v => !!v, "Select one"], ["programme", v => !!v, "Choose a programme"]]);
    if (bad) return; Object.assign(draft, Object.fromEntries(new FormData(f1))); step = 2; render(); };
  if (f2) f2.onsubmit = e => { e.preventDefault();
    const bad = !val(f2, [["parent", v => v.length > 1, "Enter parent's name"], ["phone", phoneOK, "Enter a valid 10-digit mobile"], ["email", v => /^\S+@\S+\.\S+$/.test(v), "Enter a valid email"], ["address", v => v.length > 4, "Enter address"]]);
    if (bad) return; Object.assign(draft, Object.fromEntries(new FormData(f2))); step = 3; render(); };
  if (f3) f3.onsubmit = async e => { e.preventDefault();
    if (!$("#agree").checked) return toast("Please accept the declaration");
    const btn = f3.querySelector(".orange"); btn.disabled = true;
    try {
      const id = uid("ISA");
      const txn = await Payments.pay({ amount: SCHOOL.applicationFee, method: f3.elements.method.value, description: "Application fee – " + draft.child, reference: id, customer: { name: draft.parent, email: draft.email, phone: draft.phone } });
      const pay = recordPayment({ txn, items: ["Application fee"], amount: SCHOOL.applicationFee, ref: id, kind: "application" });
      DB.data.applications.push({ ...draft, id, status: "submitted", date: new Date().toISOString(), payId: pay.id }); DB.save();
      const mine = draft; draft = {}; step = 1;
      $("#view").innerHTML = `<div class="wrap"><div class="card success"><div class="big">✅</div><h2>Application submitted!</h2>
        <p>Your application ID is</p><p style="font-size:1.8rem;font-weight:800;color:var(--red)">${esc(id)}</p>
        <p class="muted">Save this ID. Use it with ${esc(mine.phone)} to track your application. We'll call you to schedule a school visit.</p></div>${receiptHTML(pay)}</div>`;
    } catch (err) { toast(err.message); btn.disabled = false; }
  };
};

wire.status = () => {
  $("#track").onsubmit = e => { e.preventDefault(); const f = e.target;
    const a = DB.data.applications.find(x => x.id === f.id.value.trim().toUpperCase() && x.phone === f.phone.value.trim());
    const out = $("#result"); if (!a) { out.innerHTML = `<div class="card"><p class="err">No application found. Check the ID and mobile number.</p></div>`; return; }
    const st = ["submitted", "review", "approved"], idx = a.status === "approved" ? 2 : a.status === "waitlist" ? 1 : 0;
    out.innerHTML = `<div class="card"><h2>${esc(a.child)} · ${esc(byId(a.programme)?.name)}</h2><span class="pill ${esc(a.status)}">${esc(a.status)}</span>
      <div class="track">${["Submitted", "Under review", "Decision"].map((t, i) => `<div class="${i <= idx ? "on" : ""}">${t}</div>`).join("")}</div>
      <p class="muted">Applied on ${fmtDate(a.date)}</p>
      ${a.status === "approved" ? `<p>🎉 Welcome to Inspire Sanskriti! Your Student ID is <b>${esc(a.studentId)}</b>. <a href="#/fees">Pay admission fees →</a></p>` : ""}</div>`; };
};

wire.fees = () => {
  const login = $("#login");
  if (login) login.onsubmit = e => { e.preventDefault(); const f = e.target;
    const s = DB.data.students.find(x => x.id === f.id.value.trim().toUpperCase() && x.phone === f.phone.value.trim());
    if (!s) return toast("Student ID and mobile don't match"); session = s.id; render(); };
  if (!session) return;
  $("#logout").onclick = () => { session = null; render(); };
  const form = $("#payform"), s = DB.data.students.find(x => x.id === session);
  const selected = () => [...form.querySelectorAll("[name=inst]:checked")].map(c => s.instalments.find(i => i.id === c.value));
  const upd = () => { const el = $("#sel"); if (el) { el.textContent = inr(selected().reduce((a, i) => a + i.amount, 0)); $("#paybtn").disabled = !selected().length; } };
  form.addEventListener("change", upd); upd();
  form.onsubmit = async e => { e.preventDefault(); const items = selected(); if (!items.length) return;
    const amount = items.reduce((a, i) => a + i.amount, 0), btn = $("#paybtn"); btn.disabled = true;
    try {
      const txn = await Payments.pay({ amount, method: form.elements.method.value, description: items.map(i => i.label).join(", "), reference: s.id, customer: { name: s.parent, phone: s.phone, email: "" } });
      const pay = recordPayment({ txn, items: items.map(i => i.label), amount, ref: s.id, kind: "fee" });
      items.forEach(i => { i.paid = true; i.payId = pay.id; }); DB.save();
      $("#view").innerHTML = `<div class="wrap">${receiptHTML(pay)}</div>`;
    } catch (err) { toast(err.message); btn.disabled = false; } };
  document.querySelectorAll("[data-rcpt]").forEach(b => b.onclick = () => { const p = DB.data.payments.find(x => x.id === b.dataset.rcpt); $("#view").innerHTML = `<div class="wrap">${receiptHTML(p)}</div>`; });
};

wire.contact = () => { $("#enq").onsubmit = e => { e.preventDefault(); toast("Thanks! We'll call you soon."); e.target.reset(); }; };

wire.admin = () => {
  const l = $("#alogin"); if (l) l.onsubmit = e => { e.preventDefault(); if (l.pin.value === SCHOOL.adminPin) { adminOK = true; render(); } else toast("Incorrect PIN"); };
  if (!adminOK) return;
  $("#alogout").onclick = () => { adminOK = false; render(); };
  document.querySelectorAll("[data-ap]").forEach(b => b.onclick = () => {
    const a = DB.data.applications.find(x => x.id === b.dataset.ap), p = byId(a.programme);
    const sid = "ISK-" + (1001 + DB.data.students.length);
    DB.data.students.push({ id: sid, name: a.child, programme: a.programme, parent: a.parent, phone: a.phone, instalments: [
      { id: "i1", label: "Admission fee", amount: p.admission, due: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), paid: false },
      { id: "i2", label: "Term 1 Tuition", amount: p.tuition * 4, due: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10), paid: false }] });
    a.status = "approved"; a.studentId = sid; DB.save(); toast("Approved · " + sid); render(); });
  document.querySelectorAll("[data-wl]").forEach(b => b.onclick = () => { DB.data.applications.find(x => x.id === b.dataset.wl).status = "waitlist"; DB.save(); render(); });
};

/* ---------- router ---------- */
function parse() {
  const [path, qs] = (location.hash.slice(1) || "/").split("?");
  return { path, q: Object.fromEntries(new URLSearchParams(qs || "")) };
}
function render() {
  const { path, q } = parse();
  const map = { "/": "home", "/programmes": "programmes", "/admissions": "admissions", "/admissions/status": "status", "/fees": "fees", "/contact": "contact", "/admin": "admin" };
  const name = map[path] || "home";
  $("#view").innerHTML = views[name](q);
  if (wire[name === "status" ? "status" : name]) wire[name]();
  const tab = name === "status" ? "admissions" : name;
  document.querySelectorAll("[data-tab]").forEach(a => a.classList.toggle("on", a.dataset.tab === (tab === "home" ? "home" : tab)));
  document.querySelectorAll(".desk-nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + (path === "/admissions/status" ? "/admissions" : path)));
  document.title = (name === "home" ? "" : name[0].toUpperCase() + name.slice(1) + " – ") + "Inspire Sanskriti";
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", () => { step = 1; render(); });
if (location.hash.includes("p=")) step = 1;
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
