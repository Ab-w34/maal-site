# Maal — one-page site

Plain HTML, CSS and JavaScript. No build step, no npm, no dependencies.

```
maal/
  index.html              the page
  assets/css/styles.css   all styling
  assets/js/main.js       language toggle, evidence viewer, mobile nav, form
  assets/img/             logo (dark + light) and favicon
  Start-Maal.ps1          local web server for Windows
```

---

## Running it

### Option A — just open it

Double-click `index.html`. Everything works, including the Arabic/English
toggle and the evidence viewer. The address bar shows a `file:///...` path.

### Option B — run a local server

From PowerShell, inside the `maal` folder:

```powershell
.\Start-Maal.ps1
```

Opens **http://localhost:8000**. Stop it with Ctrl+C.

If PowerShell blocks the script, allow local scripts for this session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Option C — the address reads `maal`

Two parts: point the name `maal` at your own machine, then serve on it.

**1. Add the hosts entry.** Open Notepad **as administrator**, open
`C:\Windows\System32\drivers\etc\hosts`, add this line at the end, and save:

```
127.0.0.1    maal
```

**2. Serve on that name.** In an **administrator** PowerShell, inside the
`maal` folder:

```powershell
.\Start-Maal.ps1 -Hostname maal
```

Now **http://maal:8000** loads the site. Admin is needed because Windows
restricts binding to anything other than `localhost`.

To drop the port number and use plain `http://maal`, run it on port 80:

```powershell
.\Start-Maal.ps1 -Hostname maal -Port 80
```

Port 80 is sometimes taken by IIS or another service. If it fails, stay on 8000.

---

## Publishing it later

The folder is already a complete static site, so it can go up as-is:

- **GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy
  from branch. Free, and you already have Git and `gh` set up.
- **Netlify / Cloudflare Pages** — drag the folder onto their dashboard.

For a real domain like `maal.sa`, register it and point it at whichever host
you pick. The hosts-file trick above only works on your own machine.

---

## Before you publish

1. `hello@maal.sa` → your real address (footer of `index.html`)
2. LinkedIn `href="#"` → your company LinkedIn URL
3. The four team roles in `#team` are guesses — correct them
4. The contact form is front-end only. See the note at the bottom of
   `assets/js/main.js` to wire it to Formspree, Basin, or your own endpoint.
5. The applicant name, figures and filenames in the hero viewer and the
   evidence section are illustrative. Replace them with a redacted real
   example when you have one.

---

## Editing

- **Colours** — the `:root` block at the top of `styles.css`. Change
  `--wine-800` and the rest follows.
- **Text** — every bilingual element carries `data-ar` and `data-en`
  attributes. Edit both, or the toggle will show stale text.
- **Evidence viewer** — the sample fields, source lines and notes live in the
  `FIELDS` array at the top of `main.js`.
