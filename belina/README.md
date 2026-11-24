# BELINA — Way to Glow.

A premium makeup brand website built with plain HTML, CSS and vanilla JavaScript. No build tools, no server, no dependencies. Just open `index.html`.

## Files
- `index.html` — page structure and content
- `style.css` — all styling (colors are variables at the top)
- `script.js` — products, cart, filtering, search, forms

## Features
Working shopping bag (add, remove, quantities, total, saved in your browser with localStorage), category filters, product search, mobile menu, newsletter validation, smooth scrolling, free-shipping progress bar, accessible keyboard and screen-reader support.

## Customize
- **Brand details:** edit `CONFIG` at the top of `script.js` (Instagram, TikTok, email, phone, address, free-shipping threshold).
- **Products, prices, images:** edit the `PRODUCTS` list in `script.js`. All names and prices are launch placeholders in EGP.
- **Images:** photos load from Unsplash URLs. Replace any URL with your own, for example save your photo in an `images/` folder and use `images/my-photo.jpg`. Hero, category, campaign and about images are in `index.html` (search for `<img`). If a photo ever fails to load, a soft blush placeholder appears instead.
- **Colors:** change the variables in `:root` at the top of `style.css`.
- **Policies:** the footer Customer Care, Shipping & Returns and Privacy links show placeholder text. Write your real policies before launching.

## Payments (important)
The bag is checkout-ready, but there is **no real checkout or payment processing**. To take real orders you must connect a payment provider (for example Paymob, Fawry, Stripe, or a hosted store like Shopify or Salla). The newsletter form is also a demo and does not store emails; connect an email service such as Mailchimp or Brevo.

## Publish on GitHub Pages
1. Create a new public repository on github.com.
2. Upload the files inside this folder (`index.html`, `style.css`, `script.js`, `README.md`) so `index.html` is at the top level of the repository.
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
