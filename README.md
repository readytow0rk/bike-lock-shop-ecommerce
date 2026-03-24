# ArmorLock — Bike Lock Shop

Single-product e-commerce site for the ArmorLock Titan-G high-security bike lock.

## Stack
- Pure HTML/CSS/JS — no framework
- **Stripe** — Payment Element (Apple Pay / Google Pay / card)
- **EmailJS** — order notification email on every successful payment
- **postcodes.io** — UK postcode lookup
- **PHP** backend — `create-payment-intent.php`

## Setup

1. Place your product images in the `images/` folder:
   - `hero.jpg` — hero section image
   - `product-1.jpg` to `product-4.jpg` — gallery
   - `about-1.jpg` to `about-3.jpg` — about section

2. Deploy to any PHP-capable host (Netlify with PHP support, shared hosting, etc.)

3. Set your Stripe secret key in `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   ```

## Features
- 4-step checkout modal (country → address → details → payment)
- UK postcode lookup with address autocomplete
- IP-based country auto-detection
- 2-hour sale countdown timer (persists across page reloads)
- Rotating banner with live timer
- Mobile fullscreen modal, zoom locked
- Phone validation per country (UK, US, CA, AU, IE)
