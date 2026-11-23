# Turnkey Website — XipSoft

[🇹🇷 Türkçe](README.md) · [🇬🇧 English](README.en.md)

A one-page marketing site for corporate websites, e-commerce and custom admin panels.
No build step: plain **HTML + CSS + JavaScript**, plus a small **PHP** handler for the quote form.

🌐 [xipsoft.net](https://xipsoft.net) · 📩 [Telegram: xiplarex](https://t.me/xiplarex)

> **Status:** The site files are kept as-is. This version is ready to connect to **xipsoft.net**; no code changes are required, only hosting setup and a few settings.

## Structure

```
anahtar-teslim-websitesi/
├── index.html              # All page content
├── iletisim.php            # Sends the quote form by email
├── assets/
│   ├── css/style.css       # Theme, layout, animations, responsive rules
│   └── js/main.js          # Menu, counters, scroll animations, form
└── README.md
```

## Connecting to xipsoft.net

The site is static; there is no build step. Upload the files and it is live.

### 1. Upload the files

Use your hosting panel (cPanel / Plesk / FTP) and copy the following to the domain root:

- `index.html`
- `iletisim.php`
- `assets/` (including `css/` and `js/`)

The root is usually `public_html/`. For a subdomain, use the matching folder such as `public_html/xipsoft.net/`.

### 2. PHP and email settings

1. In `iletisim.php`, change `$alici` to an address on your domain, e.g. `hello@xipsoft.net`.
2. Make sure `$gonderen` also belongs to your domain (e.g. `no-reply@xipsoft.net`), otherwise messages may land in spam.
3. Confirm that the server runs **PHP 8+** and that `mail()` is enabled.
   If `mail()` is disabled, switch to an SMTP library such as PHPMailer.

### 3. SSL and redirects

- Enable **Let’s Encrypt / AutoSSL** in the hosting panel.
- Redirect HTTP requests to HTTPS.
- The `canonical` and Open Graph URLs in `index.html` already point to `https://xipsoft.net`; update them if the domain changes.

### 4. DNS

If the domain already points to the same host, no action is needed. When moving to another server:

- `A` record → server IP
- `CNAME` for `www` → `xipsoft.net`

Propagation usually takes a few minutes up to 24 hours.

### 5. Post-launch checklist

- [ ] `https://xipsoft.net` loads with a valid padlock
- [ ] Mobile menu, package links and Telegram links work
- [ ] The form delivers email (check the spam folder if needed)
- [ ] `www` and non-`www` resolve to the same site
- [ ] Optionally add a 404 page and `robots.txt`

## Local development

- **Quick preview:** open `index.html` in a browser. Everything works except the form, which falls back to Telegram because it needs PHP.
- **To test the form:** serve the folder with PHP 8+:

  ```bash
  php -S localhost:8000
  ```

  Then open `http://localhost:8000`.

## Content notes

- The email address, prices and statistics (`data-count` values in `index.html`) are sample content; replace them with your own.
- Optional: add Google Analytics / Search Console.

## Sections

- **Hero:** value proposition, quick stats, technology strip
- **Services:** corporate site, e-commerce, landing page, personal site, custom panel, maintenance
- **Packages:** Starter / Corporate / E-commerce (starting prices)
- **Process:** discovery → design → development → delivery
- **FAQ:** scope, timeline, hosting, admin panel, payment, support
- **Contact:** Telegram, website, email and quote form

## Notes

- Dark theme with glass-style cards and gradient accents.
- Respects `prefers-reduced-motion` and is fully keyboard navigable.
- Mobile menu, active section highlighting and form validation are handled in JavaScript; content remains readable without JS.
