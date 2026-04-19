# Jins Thomas — Resume Site

Single-page, static résumé for **Jins Thomas** — DevOps Specialist (Multi-Cloud,
Kubernetes, CI/CD architecture, platform migrations).

> Pure HTML / CSS / vanilla JS. No build step. No backend. Drops onto **GitHub
> Pages**, **Azure Storage Static Website**, **Azure Static Web Apps**,
> **Cloudflare Pages**, or any object store.

## Files

| File | Purpose |
|---|---|
| `index.html` | The résumé page (semantic HTML, print-friendly). |
| `style.css`  | Theme tokens, layout, dark/light mode, print styles. |
| `app.js`     | Theme toggle (persisted) + footer year. |
| `jins-thomas.jpg` | Hero photo. |

## Local preview

Any static server works. Quickest options:

```powershell
# Python (already in PATH)
python -m http.server 8000
# then open http://localhost:8000

# OR Node (if installed)
npx --yes serve .
```

---

## Deploy — Option A: GitHub Pages (easiest)

1. Create a new public repo, e.g. `jinsthomas/jinsthomas.github.io` (or any name like `resume`).
2. Push these files to `main`:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial resume site"
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```

3. In **GitHub → Settings → Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / root (`/`)
   - Save.

4. Wait ~1 minute. Your site will be live at:

   - `https://<your-username>.github.io/` &nbsp;(if repo is `<username>.github.io`)
   - `https://<your-username>.github.io/<repo>/` &nbsp;(otherwise)

> A workflow (`.github/workflows/pages.yml`) is also included — it deploys via
> **GitHub Actions** instead of branch source. Pick **either** the branch
> source above **or** the workflow, not both.

### Custom domain (optional)

- Add a `CNAME` file at the repo root containing your domain (e.g. `jinsthomas.dev`).
- Create a `CNAME` DNS record pointing to `<your-username>.github.io`.
- Enable **Enforce HTTPS** in Pages settings.

---

## Deploy — Option B: Azure Storage Static Website

1. Create a Storage Account (kind = `StorageV2`).

2. Enable **Static website**:

   ```powershell
   $RG  = "rg-personal"
   $SA  = "jinsthomasweb"     # must be globally unique, lowercase
   $LOC = "westeurope"

   az group create -n $RG -l $LOC

   az storage account create `
     --name $SA --resource-group $RG --location $LOC `
     --sku Standard_LRS --kind StorageV2 --https-only true `
     --min-tls-version TLS1_2 --allow-blob-public-access true

   az storage blob service-properties update `
     --account-name $SA --static-website `
     --index-document index.html `
     --404-document index.html
   ```

3. Upload the site to the special `$web` container:

   ```powershell
   az storage blob upload-batch `
     --account-name $SA `
     --source . `
     --destination '$web' `
     --pattern "*" `
     --overwrite
   ```

4. Get the public URL:

   ```powershell
   az storage account show -n $SA -g $RG --query "primaryEndpoints.web" -o tsv
   ```

   You will get something like
   `https://jinsthomasweb.z6.web.core.windows.net/`.

### Optional: Front Door / custom domain + HTTPS

- Put **Azure Front Door** (or **Azure CDN**) in front of `$web` for caching,
  custom domain and free managed TLS.
- Or use **Azure Static Web Apps** instead — point it at the GitHub repo and
  it gives you free HTTPS + custom domain out of the box.

---

## Deploy — Option C: Azure Static Web Apps (GitHub-driven)

1. Portal → **Create a resource** → **Static Web App**.
2. Source = **GitHub**, pick your repo + `main` branch.
3. Build presets = **Custom**:
   - App location: `/`
   - Output location: *(leave empty)*
4. Deploy. Azure will create a `.github/workflows/azure-static-web-apps-*.yml`
   workflow and push your site on every commit.

---

## Editing the résumé

- All copy lives in `index.html`. Each role is an `<article class="exp">` block;
  copy/edit one to add or update an entry.
- Skill/cert chips are in the cards inside the **Hard Skills** and
  **Certifications** sections.
- Theme colours: edit the CSS variables at the top of `style.css`
  (`--accent`, `--accent-2`, `--bg`, …). Light-mode tokens are under
  `[data-theme="light"]`.
## Print / save as PDF

There is a **Print** button in the top-right of the page. The print stylesheet
forces a clean, single-column light theme suitable for **Save as PDF** in any
browser.
