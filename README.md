# NeonShield — Premium Bike Security Store

A single-product e-commerce storefront for **NeonShield** folding bike locks, built from scratch with a fully custom checkout flow, live Stripe payments, and automated order notifications.

---

## Features

### Storefront
- Dark military-grade aesthetic with grid texture, ambient glow, and angular UI elements
- Hero section with trust badges (4.9/5 rating, Grade 5 certified, Ships Worldwide)
- Product gallery with thumbnail switcher
- Security feature strip (Anti-Cut Steel, Pick-Resistant Cylinder, 5-Year Warranty)
- Stats section, contact info, and full footer
- Fully responsive — mobile, tablet, desktop
- iOS zoom prevention, smooth scroll, hamburger nav

### Sale Banner
- Rotating 4-message banner (discount notice, shipping, countdown, guarantee)
- **Persistent 2-hour sale timer** stored in `localStorage` — survives page reloads
- 20% discount automatically applied to order total when sale is active

### Checkout Modal (4 steps)
1. **Country** — custom searchable dropdown, IP-based auto-detection via ipapi.co
2. **Address** — UK postcode lookup via postcodes.io, individual address picker via getaddress.io, manual fallback for all countries
3. **Details** — name, email, phone with per-country validation (25 countries)
4. **Payment** — Stripe Payment Element with Apple Pay & Google Pay support

### Payments
- Stripe Payment Element (live GBP)
- Server-side payment intent created via PHP backend
- Discount applied server-side — correct pence amount sent to Stripe
- Apple Pay / Google Pay auto-enabled where available

### Order Notifications
- EmailJS notification sent to owner on successful payment
- Email includes: customer name, email, phone, full shipping address, delivery notes, amount paid, discount info, Stripe payment ID, timestamp

---

## Stack

- **Frontend** — Vanilla HTML/CSS/JS, no frameworks
- **Fonts** — Rajdhani, Barlow Condensed, Barlow (Google Fonts)
- **Payments** — Stripe.js v3, Payment Element
- **Email** — EmailJS browser SDK v4
- **Address lookup** — postcodes.io (free, UK), getaddress.io (free tier)
- **Geolocation** — ipapi.co (IP country detection)
- **Backend** — PHP 8 with cURL (Stripe API direct call)
- **Hosting** — Namecheap shared hosting

---

## Project Structure

```
public_html/
├── index.html                  # Full storefront + checkout modal
├── create-payment-intent.php   # Stripe backend (server-side)
├── favicon.ico                 # Site favicon
└── images/
    ├── icon.png                # Brand logo
    └── *.jpg                   # Product images
```

---

## Configuration

All config lives at the top of the `<script>` block in `index.html`:

```js
var STRIPE_KEY       = 'pk_live_...';   // Stripe publishable key
var EMAILJS_SERVICE  = '...';
var EMAILJS_TEMPLATE = '...';
var EMAILJS_KEY_VAL  = '...';
var NOTIFY_EMAIL     = '...';           // Owner notification email
var PRICE_PENCE      = 8900;            // £89 in pence
var DISCOUNT_RATE    = 0.20;            // 20% sale discount
var GETADDRESS_KEY   = '...';           // getaddress.io key (optional)
```

Stripe secret key is set directly in `create-payment-intent.php`:

```php
define('STRIPE_SECRET_KEY', 'sk_live_...');
```

---

## Deployment

Upload to any PHP 7.4+ host (cURL required):

1. Upload all files to `public_html/`
2. Set `STRIPE_SECRET_KEY` in `create-payment-intent.php`
3. Set your keys in `index.html` config block
4. Point your domain — done

---

## Live

**[neonshield.org](https://neonshield.org)**
