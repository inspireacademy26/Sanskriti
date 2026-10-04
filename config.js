// Central school configuration. Edit values here – no code changes needed elsewhere.
window.SCHOOL = {
  name: "Inspire Sanskriti",
  tagline: "Preparatory & Foundational School · by Inspire Academy",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "hello@inspiresanskriti.example",
  address: "Inspire Sanskriti, Your Street, Your City – 000000",
  hours: "Mon–Sat · 8:30 am – 4:00 pm",
  academicYear: "2026–27",
  applicationFee: 500,            // ₹ charged when submitting an application
  currency: "INR",
  adminPin: "2026",               // DEMO ONLY – replace with real server-side auth
  // Payments: "demo" simulates a gateway. Set to "razorpay" and add your PUBLIC key id to go live.
  payment: { provider: "demo", razorpayKeyId: "", ordersEndpoint: "/api/payments/order", verifyEndpoint: "/api/payments/verify" },
  programmes: [
    { id: "playgroup", name: "Playgroup", age: "1.5 – 2.5 yrs", color: "red",    emoji: "🧸", blurb: "Gentle first steps into school: sensory play, songs, stories and routines with lots of cuddles.", hours: "9:00 – 12:00", admission: 5000, tuition: 6000 },
    { id: "nursery",   name: "Nursery",   age: "2.5 – 3.5 yrs", color: "sky",    emoji: "🎨", blurb: "Language, early numbers, art and movement through play-based, hands-on discovery.",            hours: "9:00 – 12:30", admission: 6000, tuition: 7000 },
    { id: "lkg",       name: "Lower KG",  age: "3.5 – 4.5 yrs", color: "orange", emoji: "🔤", blurb: "Phonics, pre-writing, number sense, science wonders and social skills.",                         hours: "9:00 – 1:00",  admission: 7000, tuition: 8000 },
    { id: "ukg",       name: "Upper KG",  age: "4.5 – 5.5 yrs", color: "navy",   emoji: "🚀", blurb: "Reading, writing and maths readiness – confident learners prepared for Grade 1.",                hours: "9:00 – 1:30",  admission: 7000, tuition: 8500 }
  ],
  feeHeads: [ // used to build a student's instalments
    { id: "tuition",   label: "Tuition Fee (monthly)" },
    { id: "transport", label: "Transport (monthly)" },
    { id: "activity",  label: "Activity & Materials (termly)" }
  ],
  news: [
    { tag: "Admissions", color: "red",    title: `Admissions open for 2026–27`, text: "Playgroup to Upper KG. Limited seats – apply online in 5 minutes." },
    { tag: "Event",      color: "sky",    title: "Colour Day & Annual Showcase", text: "Come dressed in your favourite colour! Parents are warmly invited." },
    { tag: "Notice",     color: "orange", title: "Fee reminder – Term 2",        text: "Pay securely in the app and get an instant receipt." }
  ]
};
