# Inspire Sanskriti – School App

Mobile-first installable web app (PWA) for Inspire Sanskriti Preparatory & Foundational School, styled with the logo palette
(navy `#0057B8`, sky `#0091E3`, red `#E10A00`, orange `#FF6B1A`, yellow `#FFC400`).

## Features
- **Home, Programmes, Contact** – school info, news, WhatsApp/phone links.
- **Online admissions** – 3-step form (child → parent → review), validation, application fee payment, application ID + receipt, status tracker.
- **Fee payments** – parent signs in with Student ID + mobile, selects instalments, pays via UPI / card / net banking, gets printable receipts.
- **Office dashboard** (`#/admin`) – review applications, approve (auto-creates Student ID and fee schedule) or waitlist, view collections.

## Run
```
python3 -m http.server 8000   # then open http://localhost:8000
```
Demo parent login: `ISK-1001` / `9876543210`. Demo staff PIN: see `config.js`.

## Configure
All school details, fees, programmes and the payment provider live in `config.js`.

## Going live (this build is a prototype)
Data is kept in browser `localStorage` and payments are simulated. Before launch:
1. Add a backend + database for applications, students, payments; replace `DB` in `app.js`.
2. Real staff auth (replace the demo PIN) and parent OTP login.
3. Set `payment.provider = "razorpay"`, add the public key id, and implement on your server
   `POST /api/payments/order` (creates a Razorpay order) and `POST /api/payments/verify` (checks the signature). Never put the secret key in the app.
4. Email/SMS/WhatsApp confirmations, and review privacy/consent requirements for children's data.
