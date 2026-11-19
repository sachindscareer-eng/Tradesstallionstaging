# TradeStallion – Staging Design

Custom code for the new dark homepage design of tradestallion.com, built for the **staging site only**.

The code is a small WordPress plugin, **TradeStallion Design** (`tradestallion-design/`). It adds a page template called **"TradeStallion Home (Custom)"**. The template renders the approved design exactly: hand-written HTML/CSS/JS, no Elementor, no page builder.

It is a plugin, not a child theme, on purpose. Activating an Astra child theme would drop all Astra Customizer settings (header, footer, colours) on every other page. With the plugin, only the page that uses the template changes; the rest of the site stays as it is.

## What's inside

```
tradestallion-design/
├── tradestallion-design.php     # plugin bootstrap: registers template, loads assets only on that page
├── templates/tradestallion-home.php   # the page layout (all sections)
├── inc/home-data.php            # ALL text content (edit copy here)
├── inc/forms.php                # Free-audit + newsletter form handlers (email to admin)
├── inc/helpers.php              # links, icons, image helper
└── assets/
    ├── css/home.css             # design styles (exact canvas values + responsive)
    ├── js/home.js               # sticky header, mobile menu, scroll reveal, active nav
    └── img/                     # hero + marketplace images (webp + jpg)
```

## Features
- Same design as the approved canvas: dark #0A0A0B, orange #FF6A13, Montserrat + Inter.
- A modern feel: sticky blurred header, scroll-reveal animations, card hover lifts, animated glow and floating badges. All motion respects `prefers-reduced-motion`.
- Fully responsive, with a mobile burger menu.
- SEO-safe:
  - Calls `wp_head()` / `wp_footer()`, so Rank Math titles, meta and schema keep working.
  - Single H1.
  - FAQPage JSON-LD.
  - Image width and height set, hero image preloaded (better LCP and CLS).
- Links use the current site's URLs, so on staging they stay on staging.
- Theme, Elementor and block CSS are dequeued on this page only, which makes it faster.
- Forms work with no extra plugin:
  - Audit requests and newsletter sign-ups are emailed to the WP admin email.
  - Nonce and honeypot spam protection.

## Install on staging

**Option A: ZIP upload (easiest)**
1. Download this repo → zip the `tradestallion-design` folder.
2. Staging WP Admin → Plugins → Add New → Upload Plugin → choose the zip → Install → **Activate**.

**Option B: Hostinger Git deploy**
1. hPanel → staging website → Advanced → **GIT**.
2. Repository: `https://github.com/sachindscareer-eng/Tradesstallionstaging`, branch `main`.
3. Install path: `wp-content/plugins/tradestallion-design-repo`. The plugin folder is inside it, so WordPress will see it as `tradestallion-design-repo/tradestallion-design/tradestallion-design.php`.

   Alternatively, upload just the `tradestallion-design` folder to `wp-content/plugins/` with File Manager.
4. WP Admin → Plugins → Activate **TradeStallion Design**.

**Apply the template**
1. Pages → **Home** → Edit (open the page in the WordPress editor, not Elementor).
2. Page / Template panel → select **TradeStallion Home (Custom)** → Update.
3. Clear LiteSpeed cache → open the staging homepage.

To roll back: set the template back to the previous one, or deactivate the plugin. The original Elementor content is never touched.

## Editing
- **Text:** `inc/home-data.php`.
- **Colours and spacing:** CSS variables at the top of `assets/css/home.css`.
- **Use a form plugin instead of the built-in audit form:**
  ```php
  add_filter( 'tsd_audit_form_shortcode', fn() => '[wpforms id="123"]' );
  ```
- **Change where form emails go:**
  ```php
  add_filter( 'tsd_form_recipient', fn() => 'connect@tradestallion.com' );
  ```

## Going live (after approval)
Test everything on staging first: forms, mobile, Rank Math score, PageSpeed. Then either:
- push staging to live with Hostinger → Staging → **Publish**, or
- install the same plugin on live and select the template on the Home page.
