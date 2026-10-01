# 🌸 Wedding RSVP — Setup & Deploy Guide

Your wedding site is ready! Follow these steps to go live.  
**Total time: ~15 minutes.**

---

## Part 1 — Set Up Google Sheets (your RSVP database)

1. Go to [sheets.google.com](https://sheets.google.com) and create a **New** spreadsheet.
2. Name it **"Wedding RSVPs"** (or anything you like).
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/  ← COPY THIS PART →  /edit
   ```
   Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`

---

## Part 2 — Deploy the Google Apps Script (your free backend)

1. Go to [script.google.com](https://script.google.com) → click **New project**
2. Delete the empty `function myFunction()` and paste the entire contents of `google-apps-script/Code.gs`
3. **Replace the Sheet ID:**
   ```js
   var SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
   ```
4. Click the **Save** icon (or Ctrl+S)
5. Click **Deploy** → **New deployment**
6. Click the gear next to "Type" → choose **Web app**
7. Fill in:
   - **Description**: Wedding RSVP Backend
   - **Execute as**: Me
   - **Who has access**: **Anyone**
8. Click **Deploy** → Grant permissions when prompted → click **Allow**
9. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

> IMPORTANT: Every time you edit the script, create a New Deployment (not update existing) for changes to take effect.

---

## Part 3 — Connect the form to your backend

1. Open `index.html` in a text editor (or VS Code)
2. Find this line (near the bottom, inside the script tag):
   ```js
   var SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Replace it with your Web App URL:
   ```js
   var SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec";
   ```
4. Save the file.

---

## Part 4 — Deploy to GitHub Pages (free hosting)

### First time setup:
1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click + → New repository
   - Name: `wedding` (or `our-wedding`, etc.)
   - Visibility: **Public** (required for free GitHub Pages)
   - Click **Create repository**

### Push your site:
Open PowerShell in your wedding folder and run these commands:

```powershell
cd "C:\Users\Kulas\.gemini\antigravity\scratch\wedding-rsvp"
git init
git add .
git commit -m "Initial wedding site with RSVP backend"
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

### Enable GitHub Pages:
1. Go to your GitHub repo → **Settings** tab
2. Scroll to **Pages** (left sidebar)
3. Under Source: select `main` branch → `/ (root)` → click **Save**
4. Wait ~1 minute → your site will be live at:
   ```
   https://USERNAME.github.io/REPO-NAME
   ```

---

## What you get

| Feature | Status |
|---|---|
| Beautiful RSVP form on your wedding site | Done |
| Responses saved to Google Sheets (like Excel) | Done |
| Rows color-coded: green = attending, red = not attending | Done |
| Guest count tracked | Done |
| Dietary notes and messages captured | Done |
| Real-time, shareable from any browser | Done |
| 100% free | Done |

---

## Your Google Sheet will look like this

| Timestamp | Name | Email | Attending | # Guests | Message / Notes |
|---|---|---|---|---|---|
| 2026-10-15 14:30:00 | Maria Santos | maria@gmail.com | Yes | 2 | Vegetarian please! |
| 2026-10-15 16:45:00 | Juan Dela Cruz | juan@yahoo.com | No | 0 | So sorry, have work trip |

**Tip**: Use Google Sheets filters (Data → Create a filter) to count attending guests.
Filter column D (Attending) = "Yes" → see total in the status bar at the bottom.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Form submits but nothing in Sheet | Double-check SHEET_ID in Code.gs and redeploy |
| Failed to fetch error | Make sure Web App is set to "Anyone" access |
| GitHub Pages shows 404 | Wait 2-3 minutes; check index.html is in root folder |
| Need to update the script | Edit → Create New Deployment (not redeploy existing) |
