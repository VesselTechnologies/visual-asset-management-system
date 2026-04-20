# TIAMAT VAMS — Fork Handoff (v2.4.1 → v2.5 merge target)

**Author:** Braden Cook (`bradenc@allmoxy.com`) — leaving project  
**Last updated:** 2026-04-20  
**Fork base:** upstream `awslabs/visual-asset-management-system` commit `6d32f90` — *Release/2.4.1 (#236)* (2026-01-28)  
**Current tip:** `89daaf5` on `dev` (also on `user-management`)  
**Upcoming merge:** upstream `release/2.5` (commit `5334fad v2.5 beta release` is already in the remote git graph but not merged)

---

## 0. Read this first

This fork contains three *categories* of change on top of upstream v2.4.1:

1. **Upstream v2.5 features pulled in early from Kurt Scheuringer** (the VAMS maintainer) — two "big update from Kurt" drops (`e66bfb0`, `1218722`). These are essentially preview snapshots of what became v2.5 upstream. When the official `release/2.5` tag is merged, **most of these files will conflict trivially and can be accepted from the upstream side** — the content is the same codebase, just at a different checkpoint.
2. **TIAMAT / Vessel-specific customizations** — branding, terminology ("Repositories" instead of "Assets"), hidden buttons/tabs/columns, custom landing page, custom deployment configs, hard-coded backend URL. These are Vessel-only and must be preserved.
3. **New tooling built by us** — `tools/PiartCLI/`, `scripts/create_group.sh`, Terminal Command export modal, Repository card view. These are new additions, not conflicts.

Categories 2 and 3 are the ones you (the next maintainer) actually have to understand and carry forward.

---

## 1. Commit timeline (fork branch)

35 commits on `dev`/`user-management` since fork, in chronological order:

| Date | Commit | Author | Summary |
|---|---|---|---|
| 2026-02-23 | `7e1c22d` | Braden | own deployment settings (hardcoded `DEV_API_ENDPOINT` and account id) |
| 2026-02-24 | `58373ee` | Braden | **Major** UI simplification + TIAMAT branding (landing page, synonyms, hidden tabs, asset upload steps) |
| 2026-02-25 | `e66bfb0` | Kurt via Braden | **Kurt drop #1** — Cognito user mgmt API/CLI, Needle USD + ThreeJS viewers, permission templates, VamsCLI role/constraint/user commands |
| 2026-02-25 | `e90ab47` | Braden | merge |
| 2026-02-26 | `1946a5d` | Braden | `scripts/create_group.sh` v1 (601 lines) + deployment config edits |
| 2026-03-05 | `68c7744` | Braden | hid tags column, db detail columns, Create Database button; `create_group.sh` tweaks |
| 2026-03-06 | `5a65ff0` | Braden | renamed "Cognito User Management" → "User Management"; hid PUBLIC db from DatabaseSelector |
| 2026-03-06 | `dbdbff2` | Braden | **`tools/PiartCLI/` v0.1.0** — wrapper around VamsCLI (repo/asset translation) |
| 2026-03-11 | `9c4ff92` | Braden | PiartCLI README |
| 2026-03-11 | `1218722` | Kurt via Braden | **Kurt drop #2** — 3D thumbnail preview pipeline, v2.4→v2.5 migration scripts, metadata/search updates, more CLI docs |
| 2026-03-11 | `a1d607c` | Braden | merge `v2.5-updates` into `dev` |
| 2026-03-14 | `b8a4e9e` | Braden | deployment config tweaks (disable useConversion3dBasic; `allowUnsafeEvalFeatures: true`) |
| 2026-03-14 | `4fd199f` | Mark | **Host CLI + install instructions on landing page** (`web/public/piart.whl`, `CodeBlock` component) |
| 2026-03-14 | `b1f61ad` | Mark | **Terminal Command export modal** on file details panel (generates `piart` download commands) |
| 2026-03-14 | `858fc0f` | Mark | **Repository card view** (`RepositoryCardView.tsx`) with preview thumbnails — Mark flagged this needs code review |
| 2026-03-14 | `cc34bdc` | Mark | temp fix for list and card view |
| 2026-03-14 | `01b3990` | Mark | revert unnecessary ModernSearch changes |
| 2026-03-14 | `3e2812b` | Mark | bundle full `piart-0.1.0.whl` into `web/public/` |
| 2026-03-14 | `1d1a85a` | Braden | move `piart.whl` → versioned filenames; add `vamscli-2.5.0-py3-none-any.whl` |
| 2026-03-14 | `4185cf5` | Braden | repository card padding + `useIsaacLabTraining.enabled: false` |
| 2026-03-14 | `6c98083`, `c7cfa00` | Braden | merges |
| 2026-03-15 | `e123099` | Mark | switch install to `uv tool install` instead of `pip` |
| 2026-03-15 | `11a2ec4` | Mark | merge |
| 2026-03-15 | `fb4ded3` | Mark | `piart-0.1.1.whl` |
| 2026-03-15 | `f1d5c5d` | Mark | remove vamscli-fail-early line in install_bundled |
| 2026-03-31 | `6ac282b` | Braden | **User mgmt UI gutted** — deleted CreateCognitoUser/ResetPassword pages, collapsed `CognitoUsers.tsx` into single "Add New User" form with optional role assignment |
| 2026-03-31 | `f856785` | Braden | merge CLI_hosting → user-management |
| 2026-03-31 | `6e99ae3`, `46f8096`, `b38f8de` | Braden | field label wobble ("User ID" vs "Username"); final label is "Username (User ID)" |
| 2026-04-09 | `0f46e47` | Mark | **PiartCLI auto-runs `vamscli setup`** on first use with hardcoded backend URL |
| 2026-04-09 | `9441839` | Mark | remove debugging prints → `piart-0.1.3.whl` |
| 2026-04-09 | `5eb3626` | Mark | hide "Access token expires in" line from `vamscli auth login` output |
| 2026-04-20 | `89daaf5` | Braden | **create_group.sh: admin/user roles now DENY `PUT`/`DELETE` on `/user/cognito/*`** — locks the Cognito user mgmt API to add-only for group admins (UI already only lets them add) |

---

## 2. Branch situation

```
dev                    ← 89daaf5  (current, clean)
user-management        ← 89daaf5  (same tip as dev; the last 6 commits were authored on this branch)
main                   ← 6d32f90  (untouched upstream v2.4.1)
origin/CLI-wrapper     ← older snapshot
origin/CLI_hosting     ← older snapshot (f1d5c5d)
origin/user_experience ← older snapshot
origin/v2.5-updates    ← older snapshot (91fef9d, same content as 1218722)
```

`main` has never been updated from upstream. **Before merging v2.5, update `main` from upstream first**, then merge v2.5 into `dev`/`user-management`. All new feature work has been done on `dev` and `user-management`; they currently point at the same commit.

Stale branches (`CLI-wrapper`, `CLI_hosting`, `user_experience`, `v2.5-updates`) are already rolled into `dev` and can be deleted after the v2.5 merge settles.

---

## 3. TIAMAT customizations (must preserve through v2.5 merge)

These are the intentional Vessel-only divergences from upstream. They live in the same files that upstream touches heavily, so **expect conflicts on every one of them** during the v2.5 merge.

### 3.1 Branding and terminology

- **[web/src/synonyms.tsx](../web/src/synonyms.tsx)** — `Asset/Assets/asset/assets` remapped to `Repository/Repositories/repository/repositories`. This is the single most pervasive change in the UI because `Synonyms.Asset` is referenced everywhere.
- **[web/src/config.json](../web/src/config.json)** — `APP_TITLE: "TIAMAT VAMS"`
- **[web/public/index.html](../web/public/index.html)** — `<title>TIAMAT VAMS</title>` + reformatted indentation (diff will be noisy)
- **[web/src/FedAuth/Auth.tsx](../web/src/FedAuth/Auth.tsx)** — adds DARPA/TIAMAT logo above the standard logo on login (gated by `vamsConfig.CUSTOMER_LOGO`). Logo at [web/src/resources/img/Darpa-logo-2026.png](../web/src/resources/img/Darpa-logo-2026.png) and [web/public/Darpa-logo-2026.png](../web/public/Darpa-logo-2026.png).
- **[web/logo_dark.png](../web/logo_dark.png)** and **[web/logo_white.png](../web/logo_white.png)** are Vessel/TIAMAT logos (the upstream ones were ~45 KB; ours are ~1.6 MB). Don't let upstream overwrite these.

### 3.2 Landing page — completely rewritten

**[web/src/pages/LandingPage.js](../web/src/pages/LandingPage.js)** bears almost no resemblance to upstream:

- Amazon VAMS carousel of feature screenshots → **YouTube embed** (`kgaO45SyaO4`)
- Marketing copy replaced with TIAMAT mission (robots/worlds/sim-ready assets/policies)
- Entire sections added for **PI-ART CLI installation** and usage (see §5)
- Inline copy of a `CodeBlock` component is used (even though there is now a reusable `CodeBlock` at [web/src/components/common/CodeBlock.tsx](../web/src/components/common/CodeBlock.tsx); the landing page still has its own local copy — harmless duplication).

### 3.3 Hidden UI features

Deliberately hidden for the TIAMAT deployment — commented out rather than deleted so they can be restored per-tenant later:

| What | File | Notes |
|---|---|---|
| Workflows tab on asset view | [TabbedContainer.tsx](../web/src/components/asset/TabbedContainer.tsx) | Commented out; the Relationships tab in Kurt's drop was also removed |
| Metadata container under asset view | [ViewAsset.tsx](../web/src/components/asset/ViewAsset.tsx) | Whole `<MetadataContainer>` block deleted and details pane repositioned |
| Tags column/field on asset list, asset upload, and asset details pane | [AssetListDefinition.js](../web/src/components/list/list-definitions/AssetListDefinition.js), [AssetUpload.tsx](../web/src/pages/AssetUpload/AssetUpload.tsx), [AssetDetailsPane.tsx](../web/src/components/asset/AssetDetailsPane.tsx) | Three commits of "hide tags" |
| "Is Distributable?" field on upload (defaults to true) | [AssetUpload.tsx](../web/src/pages/AssetUpload/AssetUpload.tsx) | Commented block |
| Linked Assets + Asset Metadata sections on upload review | [AssetUpload.tsx](../web/src/pages/AssetUpload/AssetUpload.tsx) | Commented blocks |
| Upload wizard steps reduced from 3 → 2 (no metadata step) | [AssetUpload.tsx](../web/src/pages/AssetUpload/AssetUpload.tsx) | `validSteps` array length is now 2 |
| Create Database button + edit/delete on Databases page | [Databases.js](../web/src/pages/Databases.js) | `editEnabled={false}`, `hideDeleteButton={true}`, `disableCreate={true}` |
| DB detail columns (bucketName, baseAssetsPrefix, metadata/upload restrictions) | [DatabaseListDefinition.js](../web/src/components/list/list-definitions/DatabaseListDefinition.js) | Only `databaseId`, `description`, `assetCount` remain visible |
| PUBLIC database in the DatabaseSelector dropdown | [DatabaseSelector.js](../web/src/components/selectors/DatabaseSelector.js) | Filtered by `item.databaseId !== "PUBLIC"`. Assets in PUBLIC remain accessible via direct URL / CLI; just not selectable in the Create Repository flow. |
| "Cognito User Management" → "User Management" | [Navigation.js](../web/src/layout/Navigation.js), [LandingPage.js](../web/src/pages/LandingPage.js) | Cosmetic rename |

Submit button on upload says **"Create Repository"** (was "Upload Object"). Upload form header and labels use "Repository Name / Repository Files / Repository Overall Preview File" etc.

### 3.4 Deployment configuration

[infra/config/config.json](../infra/config/config.json) is checked in with Vessel-specific values. Key divergences from upstream default template:

- `env.account: "718905963256"`, `env.region: "us-east-1"`
- `adminEmailAddress: "marksoulier@vessel-technologies.com"`
- `useGlobalVpc.enabled: true`
- `openSearch.useServerless.enabled: false`, `useProvisioned.enabled: false` *(effectively: no OpenSearch — confirm whether search UI is expected to work)*
- `useLocationService.enabled: false`
- `useCloudFront.enabled: true`
- `pipelines.useConversion3dBasic.enabled: false` and all other pipelines `false`
- `useIsaacLabTraining.enabled: false` (was briefly enabled; disabled in `4185cf5`)
- `webUi.allowUnsafeEvalFeatures: true` — **required for the Needle USD / ThreeJS WASM viewers** (see §4)
- `authProvider.useCognito.enabled: true`, `useUserPasswordAuthFlow: false`

[infra/cdk.context.json](../infra/cdk.context.json) has the us-east-1 AZ list committed.

[web/src/config.ts](../web/src/config.ts) hard-codes `DEV_API_ENDPOINT: "https://97o933vkj1.execute-api.us-east-1.amazonaws.com/"`. This is the **TIAMAT API Gateway invoke URL** and it is referenced in three other places:
- Landing page install instructions (`tiamat.vessel-technologies.com/piart-*.whl` — CloudFront-hosted, but points at the same deployment)
- `tools/PiartCLI/piart/main.py` (`_prompt_for_setup` default backend)
- `tools/PiartCLI/piart/install_bundled.py` (implicitly, via the bundled wheel)

**If the backend is ever re-deployed and the API Gateway ID changes, you must update all of those.**

### 3.5 Gitignore

[.gitignore](../.gitignore) has `scripts/` added at the bottom (`#Our stuff`). That was a mistake in `7e1c22d` — it was later untracked for the `create_group.sh` commit. Today `scripts/create_group.sh` is tracked just fine because `git add -f` was used (or because `.gitignore` entries don't affect already-tracked files). **Leave this entry in, but be aware any new file dropped into `scripts/` will silently be ignored.**

---

## 4. Features we inherited from Kurt's v2.5 drops

These changes came in through `e66bfb0` and `1218722`. They are effectively upstream v2.5 content. **When merging the real v2.5 release, take `theirs` for all of these files unless noted.**

### 4.1 Cognito User Management (backend + CLI + UI)

**New API endpoints** (from Kurt; match upstream v2.5):
- `GET /user/cognito` — list users
- `POST /user/cognito` — create user
- `PUT /user/cognito/{userId}` — update user
- `DELETE /user/cognito/{userId}` — delete user
- `POST /user/cognito/{userId}/resetPassword`

Implementation:
- [backend/backend/handlers/auth/cognitoUserService.py](../backend/backend/handlers/auth/cognitoUserService.py) (793 lines)
- [backend/backend/models/user.py](../backend/backend/models/user.py)
- [infra/lib/lambdaBuilder/authFunctions.ts](../infra/lib/lambdaBuilder/authFunctions.ts)
- Routes wired in [infra/lib/nestedStacks/apiLambda/apiBuilder-nestedStack.ts](../infra/lib/nestedStacks/apiLambda/apiBuilder-nestedStack.ts)

**VamsCLI** got matching commands:
- `vamscli user cognito list|create|update|delete|reset-password`
- `vamscli role ...` (full role + constraint CRUD)
- `vamscli role constraint template import -j <file>` — the endpoint `create_group.sh` relies on

See [tools/VamsCLI/docs/commands/user-management.md](../tools/VamsCLI/docs/commands/user-management.md) and [role-management.md](../tools/VamsCLI/docs/commands/role-management.md).

### 4.2 Permission constraint template import

New API: `POST /auth/constraintsTemplateImport`
- [backend/backend/handlers/auth/authConstraintsTemplateService.py](../backend/backend/handlers/auth/authConstraintsTemplateService.py)
- [documentation/PermissionsGuide.md](../documentation/PermissionsGuide.md) — comprehensive guide, written by Kurt
- [documentation/permissionsTemplates/](../documentation/permissionsTemplates/) — ready-made templates:
  - `database-admin.json`, `database-user.json`, `database-readonly.json`
  - `global-readonly.json`
  - `deny-tagged-assets.json` (example of a deny-overlay)

These templates use `{{DATABASE_ID}}` / `{{ROLE_NAME}}` variable substitution server-side. That is the same mechanism our [scripts/create_group.sh](../scripts/create_group.sh) uses.

### 4.3 3D viewers — NeedleUSD and ThreeJS

Two major new `visualizerPlugin` viewers (~17 files, ~15 k LOC) were added:

- **[NeedleUSDViewerPlugin](../web/src/visualizerPlugin/viewers/NeedleUSDViewerPlugin/)** — USD/USDA/USDC/USDZ via the Needle-Tools WASM runtime. Has material editor, transform controls, scene graph, animation.
- **[ThreeJSViewerPlugin](../web/src/visualizerPlugin/viewers/ThreeJSViewerPlugin/)** — GLTF/GLB/OBJ/FBX/STL/PLY/DAE/3DS/3MF + optional OCCT for STEP/IGES/BREP (CAD). Material editor, scene graph, transform controls.

Both are registered in [web/src/visualizerPlugin/viewers/manifest.ts](../web/src/visualizerPlugin/viewers/manifest.ts) and [web/src/visualizerPlugin/config/viewerConfig.json](../web/src/visualizerPlugin/config/viewerConfig.json).

**Critical deployment requirement:** both viewers rely on `SharedArrayBuffer`, which requires these HTTP headers:

```
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

They are served in two ways:
- **CloudFront** — via response headers policies in CDK. This is our production path (`useCloudFront.enabled: true`).
- **ALB** — via a frontend service worker ([web/public/coi-serviceworker.js](../web/public/coi-serviceworker.js)) that injects the headers.

Local dev uses a proxy in [web/src/setupProxy.js](../web/src/setupProxy.js) (new file) for the same purpose. **Safari cannot use these viewers** because it doesn't support `credentialless`.

Install docs for the viewer dependencies are in [web/customInstalls/needletools-usd-viewer/README.md](../web/customInstalls/needletools-usd-viewer/README.md) and [web/customInstalls/threejs/README.md](../web/customInstalls/threejs/README.md). The Online3DViewer's accepted extensions were pared back to only `3dm, amf, bim, off, wrl` since ThreeJS now handles the common mesh formats.

### 4.4 3D thumbnail preview pipeline

A new optional pipeline added in `1218722`:

- [backendPipelines/preview/3dThumbnail/](../backendPipelines/preview/3dThumbnail/) — Docker container + Step Function lambdas that generate thumbnails for USD/CAD/mesh/pointcloud files via a headless renderer.
- [infra/lib/nestedStacks/pipelines/constructs/preview3dThumbnail-construct.ts](../infra/lib/nestedStacks/pipelines/constructs/preview3dThumbnail-construct.ts) wires it in under `pipelines.usePreview3dThumbnail` (currently `enabled: false` in our config). 

### 4.5 v2.4 → v2.5 migration scripts

[tools/migrationScripts/v2.4_to_v2.5/](../tools/migrationScripts/v2.4_to_v2.5/) contains the migration that upstream expects you to run when upgrading a pre-existing v2.4.x deployment. Our deployment was created fresh on v2.5 content, so we never needed to run it — but a future upgrade path may.

### 4.6 Other notable backend changes from the drops

- `assetVersions.py` grew significantly (+620 lines) — archive/edit version support
- `streamAsset.py` gained `?versionId=` query parameter support; Veerum viewer updated to use it
- `createWorkflow.py` / `executeWorkflow.py` got additional validation
- `metadataService.py` and `search.py` received updates for v2.5 metadata model
- New CDK construct `getVpcEndpointIps.py` (custom resource) to fix ALB deployment IP stability issues

---

## 5. New tools we built

### 5.1 `tools/PiartCLI/` — the "piart" CLI wrapper

Current version **0.1.3**. Purpose: give TIAMAT users a `piart` command that feels like it was built for them (uses `repo`/`repos`) while reusing 100% of `vamscli`'s machinery.

**Location:** [tools/PiartCLI/](../tools/PiartCLI/)

**Architecture:**

```
User types:  piart repos list -d foo
             ↓
piart/main.py  (this is the installed `piart` entry point)
   1. Ensure vamscli is installed. If not, install the bundled wheel
      via `uv tool install`. The wheel lives at
      tools/PiartCLI/piart/bundled/vamscli-2.5.0-py3-none-any.whl
      and is shipped INSIDE the piart package (see pyproject.toml
      package-data).
   2. If vamscli config doesn't exist yet, run
      `vamscli setup https://97o933vkj1.execute-api.us-east-1.amazonaws.com`
      silently (hardcoded TIAMAT backend URL).
   3. Translate argv: "repo/repos" → "asset/assets".
   4. subprocess.Popen -> vamscli  with stdin inherited (for
      interactive prompts) and stdout/stderr piped through a
      character-by-character translator that flips "asset"→"repo",
      "Asset"→"Repo", "vamscli"→"piart", etc.
   5. If vamscli emits "Token Expired" or "Authentication Error",
      silently run `vamscli auth login -u <VAMS_USER> -p <VAMS_PASSWORD>`
      (read from .env or ~/.piart.env; prompts if missing and saves for
      next time at permission 0600), then retry the original command.
```

**Key files:**
- [tools/PiartCLI/piart/main.py](../tools/PiartCLI/piart/main.py) — entry point with translation tables and interactive/batch subprocess runners
- [tools/PiartCLI/piart/install_bundled.py](../tools/PiartCLI/piart/install_bundled.py) — first-run installer; calls `uv tool install <bundled-wheel>`; prints an ASCII "PIART" banner on success
- [tools/PiartCLI/piart/bundled/vamscli-2.5.0-py3-none-any.whl](../tools/PiartCLI/piart/bundled/) — the VamsCLI wheel that gets auto-installed on first use
- [tools/PiartCLI/pyproject.toml](../tools/PiartCLI/pyproject.toml) — builds with `python -m build --wheel`; the only runtime dep is `python-dotenv`
- [tools/PiartCLI/README.md](../tools/PiartCLI/README.md) — user-facing docs

**Translation tables to know about** (in `main.py`):

| Direction | Pattern | Replacement |
|---|---|---|
| argv in | `\brepos\b` | `assets` |
| argv in | `\brepo\b` | `asset` |
| output | `\bASSETS\b` | `REPOS` |
| output | `\bASSET\b` | `REPO` |
| output | `\bAssets\b` | `Repos` |
| output | `\bAsset\b` | `Repo` |
| output | `\bassets\b` | `repos` |
| output | `\basset\b` | `repo` |
| output | `\bvamscli\b` | `piart` |
| output | `\bVamsCLI\b` | `PiartCLI` |

All other subcommands (`auth`, `database`, `file`, `tag`, `workflow`, `role`, `user`, etc.) pass through unchanged.

**Known gotchas:**
- The hardcoded backend URL lives in two places: `_prompt_for_setup()` in `main.py` and the landing page wheel filename references. Grep for `97o933vkj1` before any redeployment.
- `install_bundled.py` uses `uv tool install`, so `uv` must be on the user's PATH (this is called out in the landing page instructions). The older `pip install` path was swapped out in commit `e123099`.
- The ASCII banner in `install_bundled.py` can be silenced by commenting `display_success_banner()`.
- Auto-reauth requires `python-dotenv`; it's a direct dep of piart but *not* of vamscli.

**Installation (what TIAMAT users actually do):**

1. Install `uv` (Astral) if not already installed.
2. Run `uv tool install https://tiamat.vessel-technologies.com/piart-0.1.3-py3-none-any.whl`
3. Run any `piart` command. On first invocation the bundled vamscli wheel self-installs and the backend URL auto-configures.
4. `piart auth login -u <user>` — prompts for password.

All of this flow is documented on the landing page at [web/src/pages/LandingPage.js](../web/src/pages/LandingPage.js) (starting ~line 160).

**Publishing new versions:**

```bash
cd tools/PiartCLI
# bump version in pyproject.toml
# if you want to refresh the bundled vamscli, rebuild vamscli first and copy its .whl into piart/bundled/
python -m build --wheel
# dist/piart-X.Y.Z-py3-none-any.whl is the artifact
cp dist/piart-X.Y.Z-py3-none-any.whl ../../web/public/
# update the filename in web/src/pages/LandingPage.js (install instructions)
# redeploy the web app (CloudFront invalidation)
```

Historical wheels sit in [web/public/](../web/public/): `piart-0.1.0/0.1.1/0.1.2/0.1.3-py3-none-any.whl`. **Keep older versions around** — users may have cached install URLs. The current default referenced by the landing page is `piart-0.1.3-py3-none-any.whl`.

### 5.2 `scripts/create_group.sh` — bulk group provisioning

**Location:** [scripts/create_group.sh](../scripts/create_group.sh) (633 lines)

**What it does:** One script, one group name, and you get a fully-provisioned tenant-style "group" in VAMS:

```
./scripts/create_group.sh mygroup
  → creates 3 VAMS roles:   mygroup_admin, mygroup_user, mygroup_read_only
  → creates 1 VAMS database: mygroup
  → emits 3 constraint-template JSON files
  → `vamscli role constraint template import` each of them
  → removes the JSON files
```

**Prerequisites:**
1. `vamscli` installed and on PATH (`pip install .` in `tools/VamsCLI/` or via `uv`).
2. `vamscli auth login` already done for an admin user.
3. Currently references a **hardcoded default bucket id** `e1899527-25a3-4d4d-9274-2447f1296be2` (line 42). If the TIAMAT asset bucket UUID ever changes, edit it here. You can also re-create the bucket record via `vamscli database create -d mygroup --default-bucket-id <UUID>` manually.

**What the three roles can do** (encoded as constraints):

| Role | DB (own) | DB (PUBLIC) | Assets (own) | Assets (PUBLIC) | API | Web paths |
|---|---|---|---|---|---|---|
| `mygroup_admin` | GET/PUT/POST | GET | GET/PUT/POST/DELETE | GET | GET/PUT/POST/DELETE **except DENY PUT/DELETE on `/user/cognito/*`** | /assets, /databases, /search, /upload, /auth/userroles, /auth/subscriptions, /auth/cognitousers |
| `mygroup_user` | GET/PUT/POST | GET | GET/PUT/POST/DELETE | GET | GET/PUT/POST/DELETE **except DENY PUT/DELETE on `/user/cognito/*`** | /assets, /databases, /search, /upload |
| `mygroup_read_only` | GET | GET | GET | GET | GET everywhere + POST allowed only on `/auth/routes`, `/check-subscription`, `/search` | /assets, /databases, /search, /upload |

Admin additionally gets `role` and `userRole` CRUD limited to their three role names — so they can manage their own users' role assignments without touching other groups.

**The Cognito deny overlay** (added 2026-04-20 in `89daaf5`) is the key detail: groups can *invite* users via `POST /user/cognito` (which the admin UI exposes as "Add New User") but cannot *modify* or *delete* them. This mirrors what the UI was locked down to in commit `6ac282b`. This deny rule is on `admin` and `user` only — read-only never had write access to `/user/cognito/*` to begin with.

**Known limitations:**
- No `--help`, no `--dry-run`, no idempotency. Running it twice for the same group name will `set -e` out the second time (role already exists).
- No teardown script. Deleting a group today means manually deleting the 3 roles, 3 constraint sets, and the database via `vamscli` or the UI.
- Default bucket id is hardcoded — new buckets would need a manual edit.
- The web paths allowed for the admin role include `/auth/cognitousers` even though we renamed the nav item (the underlying route hash didn't change).

### 5.3 Repository card view

**Location:** [web/src/components/search/SearchResults/RepositoryCardView.tsx](../web/src/components/search/SearchResults/RepositoryCardView.tsx)

Mark wrote this on 2026-03-14 and explicitly flagged it for code review in the commit message. It's a Cloudscape `Cards` variant of the standard search result table: each repository renders as a card with its preview thumbnail (reusing `PreviewThumbnailCell` with a `transform: scale(4)` hack to upscale), name, and truncated description. 1/2/3 cards per row based on viewport.

It's wired into [web/src/components/search/ModernSearchContainer.tsx](../web/src/components/search/ModernSearchContainer.tsx) alongside the existing table view; users can toggle. The `scale(4)` transform is brittle — if upstream changes how `PreviewThumbnailCell` renders, this will break or look weird. A proper fix would be a variant prop on `PreviewThumbnailCell` for card sizing.

### 5.4 Terminal Command export modal

**Location:** [web/src/components/filemanager/modals/CliCommandModal.tsx](../web/src/components/filemanager/modals/CliCommandModal.tsx) + additions in [web/src/components/filemanager/components/FileDetailsPanel.tsx](../web/src/components/filemanager/components/FileDetailsPanel.tsx)

Adds a **"Terminal Command"** option to the three Export dropdowns on the file details panel (single file, folder, multi-select). When clicked, it generates the corresponding `piart repos download` command for the selected item:

- Root of repo → `piart repos download /local/path -d <db> -a <asset>`
- Folder → `piart repos download /local/path -d <db> -a <asset> --file-key "<folder>"`
- Single file → `piart repos download . -d <db> -a <asset> --file-key "<path>"`

Uses the new reusable [web/src/components/common/CodeBlock.tsx](../web/src/components/common/CodeBlock.tsx) (click-to-copy with a "Copied!" tooltip). This replaced the inline `CodeBlock` that had originally been scoped to the landing page.

---

## 6. `user-management` branch — what changed vs upstream

Commit `6ac282b` **deleted** two files Kurt had shipped:

- `web/src/pages/auth/CreateCognitoUser.tsx`
- `web/src/pages/auth/ResetCognitoUserPassword.tsx`

…and **rewrote** [web/src/pages/auth/CognitoUsers.tsx](../web/src/pages/auth/CognitoUsers.tsx) from a 453-line user list with delete/reset-password actions down to a single 287-line form that only calls `POST /user/cognito` and optionally `POST /user-roles` to assign roles in one step. This matches the "admin can only add users" policy enforced by the deny constraint in §5.2.

[web/src/layout/Navigation.js](../web/src/layout/Navigation.js) still routes the old `/auth/cognitousers` hash to this new single-form page, and the item is labelled "User Management" (not "Cognito User Management").

**Conflict expectation on v2.5 merge:** upstream's `CognitoUsers.tsx` will be the full admin console. You must keep our simplified form OR carry forward the two deleted files if a requirement changes.

---

## 7. Things that are rough / worth fixing

Ranked by "how likely to bite you":

1. **Three places hard-code the backend URL `97o933vkj1.execute-api.us-east-1.amazonaws.com`** ([web/src/config.ts](../web/src/config.ts), [tools/PiartCLI/piart/main.py](../tools/PiartCLI/piart/main.py), landing page wheel-hosting URL). If the API Gateway is ever re-created, all three need updating and a new piart wheel needs to be built+hosted.
2. **`create_group.sh` hardcodes a bucket UUID.** Same problem — if the asset bucket is re-created, edit line 42.
3. **Repository card view's `transform: scale(4)`** is a hack; will look wrong at arbitrary viewport sizes.
4. **Landing page has a duplicate inline `CodeBlock`** even though we have a shared one now. Low-risk, just messy.
5. **Upload wizard step count** is hardcoded at `validSteps = [false, false]` — if upstream v2.5 adds or removes a step, rebase pain.
6. **`scripts/` is in `.gitignore`** (§3.5) — surprising to new contributors.
7. **OpenSearch is disabled** in the deployment config — confirm this is intentional; the modern search UI will be degraded.
8. **No teardown for `create_group.sh`.** A delete-group script would round out the tooling.
9. **`piart` auto-saves credentials to `~/.piart.env` at permission 0600** — fine on macOS/Linux but surprises Windows users. Landing page doesn't mention this.
10. **Label wobble on the User Management form** (commits `6e99ae3` → `46f8096` → `b38f8de` flipped "User ID" / "Username" three times). Current label is **"Username (User ID)"** — whatever you inherit, know that the backend field is `userId`.

---

## 8. Recommended v2.5 merge playbook

1. **Fetch upstream and tag the current fork state**:
   ```bash
   git remote add upstream https://github.com/awslabs/visual-asset-management-system.git  # if not already
   git fetch upstream
   git tag vessel-pre-v2.5-merge 89daaf5
   ```
2. **Update `main` from upstream v2.5** so it becomes the authoritative v2.5 baseline:
   ```bash
   git checkout main
   git merge upstream/release/2.5   # or whatever the upstream tag is
   ```
3. **Merge `main` into `dev`**. Expect conflicts in roughly this set:
   - Every file Kurt touched (§4) — take upstream.
   - Every file under §3.3 (hidden UI features) — keep the "commented-out" versions from our side, reapply on top of upstream's new structure if the surrounding code moved.
   - [web/src/synonyms.tsx](../web/src/synonyms.tsx) — keep ours.
   - [web/src/pages/LandingPage.js](../web/src/pages/LandingPage.js) — keep ours wholesale.
   - [infra/config/config.json](../infra/config/config.json) — three-way merge carefully; upstream may add new feature switches we need to set to `false` for this deployment.
   - [web/public/index.html](../web/public/index.html) — keep `TIAMAT VAMS` title.
   - [CHANGELOG.md](../CHANGELOG.md) — upstream will have a proper 2.5 section; ours has Kurt's pre-merge notes injected.
4. **Verify the PiartCLI still builds** after merge:
   ```bash
   cd tools/PiartCLI && python -m build --wheel
   ```
   If VamsCLI changed shape (subcommand renamed, help text changed), the PiartCLI translation tables may need adjusting.
5. **Rebuild and re-bundle vamscli** into piart:
   ```bash
   cd tools/VamsCLI && python -m build --wheel
   cp dist/vamscli-*.whl ../PiartCLI/piart/bundled/
   ```
6. **Test `scripts/create_group.sh` end-to-end** against the merged deployment to confirm the constraint-template import API didn't change shape.
7. **Smoke-test the UI** — login, browse repositories (card + list view), open the Needle USD viewer, open the ThreeJS viewer on a GLTF, export terminal command, create a user via the simplified form, verify they can log in.
8. **Merge `dev` → `user-management`** (or just rebase, since today they point at the same commit).
9. **Delete the stale remote branches** (`CLI-wrapper`, `CLI_hosting`, `user_experience`, `v2.5-updates`) once you're confident nothing unique is hiding in them: `git log 89daaf5..origin/<branch> -- .` for each to confirm.

---

## 9. Contacts / knowledge people

- **Kurt Scheuringer** (AWS, `276052+scheurik@users.noreply.github.com`) — author of upstream v2.4/v2.5. The two big drops in this fork are from him. If you hit a question about Needle USD, ThreeJS, Cognito user mgmt, or permission constraints, he's the origin.
- **Mark Soulier** (Vessel, `mark.soulier@icloud.com`) — author of the PiartCLI backend-URL work, landing page hosting, Repository card view, terminal export modal. If something in the CLI wrapper or the landing page install flow is broken, start there.
- **Braden Cook** (leaving, `bradenc@allmoxy.com`) — TIAMAT UI customization, `create_group.sh`, user-management simplification, deployment config.

---

## 10. File-by-file quick reference

### New files we authored (not from upstream)

| Path | What |
|---|---|
| [scripts/create_group.sh](../scripts/create_group.sh) | Group provisioner (database + 3 roles + constraints) |
| [tools/PiartCLI/](../tools/PiartCLI/) | PIART CLI wrapper around VamsCLI |
| [web/src/components/common/CodeBlock.tsx](../web/src/components/common/CodeBlock.tsx) | Reusable click-to-copy code block |
| [web/src/components/filemanager/modals/CliCommandModal.tsx](../web/src/components/filemanager/modals/CliCommandModal.tsx) | "Terminal Command" export |
| [web/src/components/search/SearchResults/RepositoryCardView.tsx](../web/src/components/search/SearchResults/RepositoryCardView.tsx) | Card view of search results |
| [web/public/piart-0.1.*.whl](../web/public/), [web/public/vamscli-2.5.0-py3-none-any.whl](../web/public/vamscli-2.5.0-py3-none-any.whl) | Hosted CLI wheels |
| [web/src/resources/img/Darpa-logo-2026.png](../web/src/resources/img/Darpa-logo-2026.png), [web/public/Darpa-logo-2026.png](../web/public/Darpa-logo-2026.png) | DARPA/TIAMAT branding |

### Files we heavily modified (TIAMAT customization)

| Path | Note |
|---|---|
| [web/src/synonyms.tsx](../web/src/synonyms.tsx) | Asset → Repository |
| [web/src/config.ts](../web/src/config.ts), [web/src/config.json](../web/src/config.json) | APP_TITLE + DEV_API_ENDPOINT |
| [web/public/index.html](../web/public/index.html) | Page title |
| [web/src/pages/LandingPage.js](../web/src/pages/LandingPage.js) | Full rewrite |
| [web/src/FedAuth/Auth.tsx](../web/src/FedAuth/Auth.tsx) | DARPA logo |
| [web/src/layout/Navigation.js](../web/src/layout/Navigation.js) | Label tweaks |
| [web/src/components/asset/TabbedContainer.tsx](../web/src/components/asset/TabbedContainer.tsx), [ViewAsset.tsx](../web/src/components/asset/ViewAsset.tsx), [AssetDetailsPane.tsx](../web/src/components/asset/AssetDetailsPane.tsx) | Hidden tabs/fields |
| [web/src/pages/AssetUpload/AssetUpload.tsx](../web/src/pages/AssetUpload/AssetUpload.tsx) | 2-step wizard, hidden fields |
| [web/src/pages/Databases.js](../web/src/pages/Databases.js), [DatabaseListDefinition.js](../web/src/components/list/list-definitions/DatabaseListDefinition.js), [DatabaseSelector.js](../web/src/components/selectors/DatabaseSelector.js) | Read-only databases, PUBLIC hidden |
| [web/src/pages/auth/CognitoUsers.tsx](../web/src/pages/auth/CognitoUsers.tsx) | Simplified add-only form |
| [infra/config/config.json](../infra/config/config.json) | Vessel deployment settings |
| [infra/cdk.context.json](../infra/cdk.context.json) | Committed AZ list |
| [.gitignore](../.gitignore) | `scripts/` ignore (historical) |

---

*End of handoff. Good luck. — Braden*
