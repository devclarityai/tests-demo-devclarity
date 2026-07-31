# Platform notes

The long tail of environment failures, by platform. Read the section for the platform detected in Step 0 of `SKILL.md`. Do not read all of them.

Everything here is a fix suggestion for a human to approve, not something to run unattended.

## All platforms

### Corporate proxy

Symptoms: `npm install` hangs or fails with `ETIMEDOUT`, `ECONNRESET`, or `ERR_SOCKET_TIMEOUT`. `npx playwright install` fails partway through a download.

Check what npm is configured to use:

```bash
npm config get proxy
npm config get https-proxy
npm config get registry
```

If the team is behind a proxy, npm needs it set explicitly. The values come from IT, not from guesswork. Playwright's downloader reads `HTTPS_PROXY` from the environment separately from npm's config, so both may need setting:

```bash
export HTTPS_PROXY=http://proxy.example.com:8080
npx playwright install chromium
```

### Certificate interception

Symptoms: `unable to get local issuer certificate`, `SELF_SIGNED_CERT_IN_CHAIN`.

The company is inspecting TLS with its own root CA. The correct fix is pointing node at the corporate CA bundle:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem
```

Do not suggest `NODE_TLS_REJECT_UNAUTHORIZED=0` or `npm config set strict-ssl false`. Both disable certificate verification machine-wide. If the CA bundle path is unknown, mark the check `BLOCKED` and let IT supply it.

### Private registry

Symptoms: `404 Not Found` on `@playwright/cli` or `@playwright/mcp` specifically, while other installs work.

The registry is an internal mirror that has not synced the package, or scoped packages are routed differently. `npm config get registry` shows what is in use. This needs someone with registry access, so it is a `BLOCKED`, not a fix.

## macOS

### Global install permission denied

`EACCES` writing to `/usr/local/lib/node_modules` means node was installed system-wide rather than through a version manager. Point npm at a user-owned prefix:

```bash
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
```

Open a new shell and retry. `sudo npm install -g` also works and is what most people reach for, but it leaves root-owned files in the npm tree that cause worse errors later. Prefer the prefix change.

### Homebrew node and nvm together

Symptoms: `node --version` disagrees with what `nvm` reports, or a global install lands somewhere unexpected.

`which -a node` lists every node on `PATH`. If both `/opt/homebrew/bin/node` and `~/.nvm/versions/...` appear, `PATH` order decides which wins, and it often differs between a login shell and the integrated terminal inside the editor. Pick one and remove the other from `PATH` for the session.

### Gatekeeper on first browser launch

A dialog about an unidentified developer on the first Chromium launch is expected. Approving it once is enough. It only appears when the browser is launched headed.

## Windows (PowerShell)

### Scripts disabled

Symptoms: `playwright-cli.ps1 cannot be loaded because running scripts is disabled on this system`.

npm global binaries are PowerShell shims, so execution policy blocks them. The narrow fix, per user, no admin rights needed:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Do not suggest `Bypass`, and do not suggest a machine-wide scope.

### Installed but not on PATH

`npm install -g` reports success, then `playwright-cli --version` says the command is not recognized. The global bin directory is not on `PATH`.

```powershell
npm config get prefix          # e.g. C:\Users\you\AppData\Roaming\npm
$env:PATH -split ';'           # confirm whether that path is present
```

A new PowerShell window picks up a `PATH` change made by an installer. The current one will not. Open a new terminal before concluding the install failed.

### Path length and OneDrive

Symptoms: `ENAMETOOLONG`, or `npm install` failing on deeply nested dependency paths. Common when the repo was cloned into a OneDrive-synced Documents folder.

Clone into a short path such as `C:\dev\` instead. OneDrive sync also fights with `node_modules` continuously, so keeping training repos outside synced folders avoids a second class of problem.

### Line endings

Not a blocker for this skill, but if `git status` shows every file modified immediately after clone, it is CRLF conversion. `git config --global core.autocrlf true` is the usual setting on Windows. Note it and move on; it does not affect whether tests run.

## WSL

### Two node installations

The most common WSL failure. `which node` returning a `/mnt/c/...` path means the Linux shell is reaching across to the Windows node through `PATH` inheritance. Global npm installs then land on the Windows side and are invisible to the Linux shell, or vice versa.

Install node inside WSL with `nvm` or `fnm` and confirm:

```bash
which -a node    # every entry should be a Linux path
which -a npm
```

### Repo on the Windows filesystem

Symptoms: `npm install` takes many minutes, file watching does not work, tests are extremely slow.

A repo under `/mnt/c/` is being accessed across the filesystem boundary, and every file operation pays for it. Clone into the Linux home directory instead:

```bash
cd ~ && git clone <repo>
```

This is worth fixing even mid-session. The time it takes to re-clone is less than the time lost to the slowdown.

### Missing browser system libraries

Symptoms: Chromium installs, then fails to launch with a message naming a missing shared object, commonly `libnss3.so`, `libatk-1.0.so.0`, or `libgbm.so.1`.

```bash
npx playwright install-deps chromium
```

This uses `sudo` and installs system packages, so ask first. If the attendee does not have sudo in WSL, mark the check `BLOCKED`.

### No display for headed mode

Headless runs work; headed runs fail with a display error. WSLg provides a display on Windows 11, but not on older setups. Headless is enough for this session, so use `--headed` only where it is needed and do not spend session time on display plumbing.
