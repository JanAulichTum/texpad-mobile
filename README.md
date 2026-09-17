# texpad mobile

A phone-sized companion to [texpad](https://github.com/JanAulichTum/texpad-latex):
edit `.tex`/`.bib` files from any GitHub repo, push commits straight from your
phone, and compile in the cloud via GitHub Actions -- no LaTeX install, no
app-store review, works on iPhone and Android identically.

**Live app:** https://JanAulichTum.github.io/texpad-mobile/

## Setup (once)

1. **Add the compile workflow** to the repo you want to edit (already done
   for `master-thesis` -- see `.github/workflows/compile.yml` there). It
   needs `permissions: contents: write` and to publish `build/main.pdf` as
   the repo's `latest` release asset; copy that file into any other repo
   you want to use this with.

2. **Create a token**, scoped to just that repo:
   [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
   - Repository access: **Only select repositories** -> pick your thesis repo.
   - Permissions: **Contents: Read and write**, **Actions: Read and write**.
   - Copy the token (`github_pat_...`) -- GitHub shows it once.

3. **Open the app**, tap the gear icon, paste the token, owner, repo, and
   branch. This is stored only in this browser, on this device -- it's
   never sent anywhere except directly to `api.github.com`.

4. **Add to your home screen** for an app-like experience:
   - iOS Safari: Share -> Add to Home Screen.
   - Android Chrome: ⋮ menu -> Add to Home screen / Install app.

## Using it

| | |
|---|---|
| **Files** tab | lists every `.tex`/`.bib`/`.sty`/`.cls` file in the repo; tap one to open it |
| **Editor** tab | plain-text editor; a yellow dot on the Files list marks unpushed edits |
| **Push** | commits your edit straight to the repo (conflict-checked via the file's `sha`) |
| **Compile** | pushes first if needed, triggers the GitHub Actions workflow, polls it, then shows the resulting PDF |
| **PDF** tab | the last successfully compiled PDF |

Needs a data connection for Push/Compile (they talk to GitHub); the app
shell itself (this UI) loads instantly even offline once installed, via a
small service worker.

## Why cloud compile, not on-device

The realistic in-browser LaTeX engines (e.g. SwiftLaTeX/WASM) turned out to
be unreliable in practice -- even their own official demo fails today
because its package-delivery server is broken, and self-hosting that whole
pipeline is a project of its own. Compiling via GitHub Actions instead
reuses infrastructure that's already free and reliable, and gets full
`biblatex`+`biber` support (real citations) for free, at the cost of
needing a network connection to compile (not zero-signal-forever offline).

## Privacy / security notes

- Your token lives in `localStorage` in your phone's browser only. Clearing
  site data or switching browsers removes it; re-enter it via the gear icon.
- Scope the token to *only* the repo(s) you use here, with the two
  permissions above -- nothing broader.
- This app has no backend of its own; it talks directly to `api.github.com`
  from your device.
