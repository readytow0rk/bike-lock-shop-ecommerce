# Mama Cookin — Ukrainian Food Ordering App

A fully custom, single-page food ordering storefront built from scratch in vanilla JavaScript. No frameworks, no dependencies — everything from the cart logic to the discount timer was written by hand.

Live website link - [LIVE](https://readytow0rk.github.io/bike-lock-shop-ecommerce/)
---

## What It Does

- Browses a menu of Ukrainian dishes with real product images
- Builds a cart with quantity controls and live price updates
- Applies a 20% time-limited discount when an active sale is running
- Takes the customer through a multi-step checkout collecting delivery details
- Processes payment via Stripe (live GBP, Payment Element with Apple Pay / Google Pay)
- Sends the owner a full order notification via EmailJS on successful payment

---

## Technically Challenging Parts

### Persistent Sale Timer with Discount Logic
The 2-hour sale countdown is stored in `localStorage` so it survives page refreshes. On every page load, the app checks `localStorage.getItem('al_sale_end')` against `Date.now()`. If the sale is still active, all prices update to 80% of base and the discount row appears in the order summary. Stripe receives the already-discounted pence amount, so there is no way for a customer to pay the undiscounted price by manipulating the front end.

### Live Order Summary
`getEffectivePrice()` computes the final price, `fmtPrice()` formats it as pounds (£1, £0.80), and `updateOrderSummary()` re-renders the step 4 summary every time the cart or sale state changes — without touching the DOM except for the relevant elements.

### Bundle Builder
Customers can build custom meal packages. Each bundle option updates the cart state and triggers price recalculation dynamically.

### Stripe Payment Element
Stripe is initialised only when the customer reaches step 4 (`initPayment()`), using the effective price. The payment intent is created server-side in PHP, which receives the pence amount already calculated by the front end — avoiding any `* 100` conversion bug. The PHP backend validates that `$amount >= 30` before calling the Stripe API.

### EmailJS Full Order Details
On `payment.confirmPayment()` success, the handler calls `sendOrderEmail()` which sends a full notification to the owner: customer name, email, phone, shipping address, delivery notes, amount paid, whether a discount was applied, the Stripe Payment Intent ID, and a timestamp.

### Multi-Step Checkout UX
The checkout is a 4-step modal built entirely in vanilla JS. Each step validates its inputs before proceeding. The address step uses the postcodes.io API for UK postcode lookups and getaddress.io for individual address selection with a manual fallback for international orders.

---

## Stack

- **Frontend** — Vanilla HTML / CSS / JavaScript (zero frameworks)
- **Payments** — Stripe.js, Payment Element (live GBP), Apple Pay & Google Pay
- **Email** — EmailJS browser SDK v4
- **Address** — postcodes.io (UK postcode lookup), getaddress.io (address picker)
- **Geolocation** — ipapi.co (IP-based country auto-detection)
- **Backend** — PHP 8 with cURL (Stripe API, server-side payment intent)
- **Hosting** — Namecheap shared hosting

---

## Project Structure

```
public_html/
├── index.html                  # Storefront + full checkout modal (single page)
├── create-payment-intent.php   # Server-side Stripe payment intent
├── favicon.ico
└── images/                     # Product photos
```

---

## Configuration

All keys live at the top of the `<script>` block in `index.html`:

```js
var STRIPE_KEY       = 'pk_live_...';
var EMAILJS_SERVICE  = '...';
var EMAILJS_TEMPLATE = '...';
var EMAILJS_KEY_VAL  = '...';
var NOTIFY_EMAIL     = '...';
var PRICE_PENCE      = 8900;      // base price in pence
var DISCOUNT_RATE    = 0.20;      // 20% sale discount
```

The Stripe secret key is set only on the server in `create-payment-intent.php` — it is never in the repository.

---

## Deployment

Upload to any PHP 7.4+ host with cURL:

1. Upload all files to `public_html/`
2. Set `STRIPE_SECRET_KEY` in `create-payment-intent.php`
3. Set your keys in the config block in `index.html`
4. Point your domain — done
