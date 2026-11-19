# TradeStallion – Staging Design

Custom code for the new dark homepage design of tradestallion.com, built for the **staging site**.

This repo **is** the WordPress plugin **TradeStallion Design**: the repo root is the plugin folder (`wp-content/plugins/tradestallion-design/`). It adds a page template called **"TradeStallion Home (Custom)"**. The template renders the approved design exactly: hand-written HTML/CSS/JS, no Elementor.

It is a plugin, not a child theme, on purpose. An Astra child theme would drop all Astra Customizer settings (header, footer, colours) on every other page. With the plugin, only the page that uses the template changes.

## Files

```
tradestallion-design.php          plugin bootstrap: registers template, loads assets only on that page
templates/tradestallion-home.php  page layout (all sections)
inc/home-data.php                 ALL text content (edit copy here)
inc/forms.php                     free-audit + newsletter forms (emailed to WP admin)
inc/helpers.php                   links, icons, image helper
assets/css/home.css               design styles (exact canvas values + responsive)
assets/js/home.js                 sticky header, mobile menu, scroll reveal, active nav
assets/img/                       hero + marketplace images (webp + jpg)
.github/workflows/deploy.yml      auto-deploy to staging on every push to main
```

## Workflow: edit → push → staging updates automatically

1. Edit files in the local folder (`Desktop\tradestallion-design`). That folder is a clone of this repo.
2. Commit and push to `main`, with GitHub Desktop or `git push`.
3. The **Deploy to staging** action runs:
   - It checks PHP syntax.
   - It uploads the changed files over FTP to the staging plugin folder.
   - Progress shows on the repo's **Actions** tab.
4. Clear the LiteSpeed cache on staging if a change doesn't show.

### One-time auto-deploy setup

**Step 1: get the FTP details.** In Hostinger hPanel, open the staging site, then Files → **FTP Accounts**. Note:
- the FTP host (e.g. `ftp.tradestallion.com`)
- the username
- the password (reset it there if unknown)

**Step 2: find the staging plugin folder.** In File Manager, find where the staging WordPress lives (for example `public_html/staging/`). The plugin path is that folder plus `wp-content/plugins/tradestallion-design/`.

**Step 3: add the secrets.** In this repo go to Settings → Secrets and variables → Actions → **New repository secret**, and add four:

| Secret | Example |
|---|---|
| `FTP_SERVER` | `ftp.tradestallion.com` |
| `FTP_USERNAME` | `u123456789` |
| `FTP_PASSWORD` | *(FTP password)* |
| `FTP_SERVER_DIR` | `/public_html/staging/wp-content/plugins/tradestallion-design/` |

**Step 4: run it.** Actions → Deploy to staging → **Run workflow**, or just push a change.

**Step 5: activate the plugin (first time only).**
1. Staging WP Admin → Plugins → activate **TradeStallion Design**.
2. Pages → Home → Edit (WordPress editor, not Elementor) → Template: **TradeStallion Home (Custom)** → Update.

Until the secrets exist, the deploy job skips itself without failing.

**Alternative: Hostinger's built-in Git.** hPanel → Advanced → GIT:
- repo `https://github.com/sachindscareer-eng/Tradesstallionstaging`, branch `main`
- install path `wp-content/plugins/tradestallion-design` (must be empty)
- turn on **Auto Deployment** and add its webhook URL in GitHub → Settings → Webhooks

Use either this or FTP, not both.

## GitHub → staging sync (active)

Staging is connected to this repo. Every push to `main` triggers a webhook to `https://staging.tradestallion.com/wp-json/tsd/v1/sync`, and the plugin pulls the new code from GitHub on its own:
- it downloads the branch, copies the changed files and clears the LiteSpeed cache;
- a WP-Cron check every 15 minutes catches anything the webhook missed;
- status and a **Sync now** button are in staging WP Admin → Tools → **TradeStallion Sync**.

No FTP secrets are needed for this. The FTP workflow above is optional.

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

## Rollback / going live
- **Rollback:** switch the Home page template back, or deactivate the plugin. The Elementor content is never touched.
- **Going live after approval:** Hostinger → Staging → **Publish**, or install this plugin on live and select the template.
