# Legacy deployment and recovery

## Verified baseline

This records Alex's completed legacy verification; the documentation change does
not repeat a build or perform a deployment.

| Item | Verified state |
| --- | --- |
| Source on `main` | `1a99d980c75bb7d4aced9f8437a127a662fa92d2` |
| Published `gh-pages` commit | `690cef4cadaf7610353278f6519664a7d6d8857d` |
| GitHub Pages source | `gh-pages` branch, root (`/`) |
| Reproduction environment | Windows x64; portable Node 16.20.2 / npm 8.19.4 |
| Build verification | `npm ci` and `npm run build` succeeded; Git status stayed clean |
| Expected warnings | Outdated Browserslist data and unused imports |
| Domain file | `build/CNAME` contained `www.alexcwarren.com` |
| Preview and backups | Python static preview worked; portable Git bundle and published-branch ZIP were created and verified; extracted ZIP preview worked in a fresh browser window |

The root-domain DNS was updated to GitHub Pages addresses. Alex confirmed
`https://alexcwarren.com` now works without issues; `https://www.alexcwarren.com`
also works. The earlier apex HTTPS issue is resolved in this verification record.

## Current manual deployment architecture

The React/Create React App source lives on `main`. In [package.json](../package.json),
`npm run deploy` automatically runs `predeploy` (`npm run build`), then
`gh-pages -d build` publishes the generated files to `gh-pages`. GitHub Pages
serves that branch's root. A source commit alone does not run this npm deployment
sequence. There is no checked-in GitHub Actions workflow for building the source.

[public/CNAME](../public/CNAME) is copied into the build. Preserve it through any
recovery. **Do not run `npm run deploy` casually: it publishes to the live site.**
It also rebuilds first, so it is not an exact-artifact rollback command.

## Reproduce and preview safely

Use a fresh checkout and a temporary shell configured for the portable Windows
x64 Node 16.20.2 distribution. Confirm npm 8.19.4 is selected. Node 16 is EOL;
use it only to reproduce this legacy build, then return to the normal maintained
Node environment. Git, Python 3, and dependency-download access are prerequisites.

These PowerShell examples use arbitrary sibling directories, not personal paths.
Run each step separately and stop on errors or unexpected version/status output.

```powershell
git clone https://github.com/alexcwarren/alexcwarren.github.io.git legacy-source
Set-Location legacy-source
git switch --detach 1a99d980c75bb7d4aced9f8437a127a662fa92d2
node --version
npm --version
npm ci
npm run build
git status --short
Get-Content build/CNAME
python -m http.server 8000 --bind 127.0.0.1 --directory build
```

Expect Node `v16.20.2`, npm `8.19.4`, empty Git status, and
`www.alexcwarren.com`. Open `http://localhost:8000`; check the page, assets,
and links. Stop the server with Ctrl+C. Do not update dependencies, the lockfile,
or Browserslist data merely to suppress the recorded warnings.

Old service-worker cache interfered when two previews shared `localhost:3000`;
the rollback ZIP worked in a fresh browser window. Use distinct ports (8000 for
the rebuild, 8001 for the published backup) and separate browser profiles.
A new ordinary window can still share cache. If a page is blank or assets return
404, compare the script names in `index.html` with `static/js`, then try a clean
profile or clear/unregister the local origin's service worker. Preserve the backup.

## Create and verify portable backups

Keep both Git history and the exact published files, outside the repository.
The commands below recreate the baseline backups in new, unused sibling paths;
do not overwrite the already verified originals.

From the parent of `legacy-source`:

```powershell
git clone --mirror https://github.com/alexcwarren/alexcwarren.github.io.git legacy-mirror.git
git -C legacy-mirror.git bundle create ../legacy-repository.bundle --all
git -C legacy-mirror.git bundle verify ../legacy-repository.bundle
git -C legacy-mirror.git archive --format=zip --output=../legacy-published-690cef4.zip 690cef4cadaf7610353278f6519664a7d6d8857d
git clone --branch main ./legacy-repository.bundle legacy-restore-check
git -C legacy-restore-check cat-file -t 1a99d980c75bb7d4aced9f8437a127a662fa92d2
git -C legacy-restore-check cat-file -t 690cef4cadaf7610353278f6519664a7d6d8857d
Expand-Archive -LiteralPath ./legacy-published-690cef4.zip -DestinationPath ./legacy-rollback-preview
Get-Content ./legacy-rollback-preview/CNAME
python -m http.server 8001 --bind 127.0.0.1 --directory ./legacy-rollback-preview
```

Both object checks should report `commit`. Confirm the extracted root contains
`index.html`, referenced assets, and the expected CNAME; preview
`http://localhost:8001` with a clean profile. Stop with Ctrl+C. Store the bundle
and ZIP with their commit IDs and verification notes in a separate backup location.
Never commit backups to this repository. Git bundles preserve Git objects and
refs, not DNS, Pages settings, credentials, issues, or uncommitted local files.

## Recovery plan (publishing requires a separate decision)

Local recovery: clone the verified bundle into a new directory and check out the
source SHA above to rebuild, or extract the verified ZIP to preview the exact
published artifact without Node/npm. Keep original backups untouched.

If a live rollback is later authorized:

1. Record the then-current Pages source, domain settings, and `gh-pages` SHA;
   back up that current state before changing it.
2. In a separate checkout based on the current `gh-pages` tip, prepare a new
   commit whose complete tracked tree matches the verified published commit
   (available from the bundle), including CNAME and dotfiles. Remove files absent
   from the baseline. Review the diff and compare trees; do not force-reset history.
3. Preview that candidate on a separate port/profile. Stop for review before
   publishing. An authorized push to `gh-pages` changes the live Pages site;
   do not use `npm run deploy` to restore the ZIP because it rebuilds source.
4. After an authorized publication, verify both HTTPS domains, assets, and links
   in a clean profile and check Pages deployment status. Retain the pre-rollback
   backup in case recovery itself must be reversed.

Only local restoration/preview has been verified; a live rollback has not been
rehearsed as part of this baseline.

## Limitations and transition

The successful legacy build is not evidence of dependency security or support on
modern Node versions, nor proof that a rebuild is byte-for-byte identical to the
published ZIP. The ZIP is the exact-artifact recovery baseline. Python's static
server does not reproduce production HTTPS, DNS, redirects, or all routing behavior.

The next, separate phase is an Astro migration on a maintained Node version with
GitHub Actions build/deployment automation. Carry forward the domain, content,
links, and verified recovery artifacts; validate previews and agree on cutover
before changing Pages settings. This documentation does not start that migration
or change dependencies, Pages settings, DNS, or the live deployment.
