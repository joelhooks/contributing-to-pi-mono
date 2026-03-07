# contributing-to-pi-mono

A public pi extension and installable skill for contributing upstream to [`badlogic/pi-mono`](https://github.com/badlogic/pi-mono) without sending half-baked bug reports or churn PRs.

This repo exists because Mario's feedback on a recent issue was fair: if you can't say **which provider/model triggered the bug**, whether it reproduces on **clean upstream**, and **where the invariant actually broke**, you're still debugging locally.

## What you get

- `pi_mono_search` — pi tool that queries the public maintainer corpus on `joelclaw.com`
- `pi_mono_discovery` — install/discovery metadata for the corpus, skill, and extension
- `skills/contributing-to-pi-mono/SKILL.md` — public contribution workflow distilled from real maintainer feedback

The corpus lives on `joelclaw.com` and is backed by a searchable index of:

- repo docs and READMEs
- issues and issue comments
- pull requests and review comments
- commits and releases
- materialized maintainer heuristics

## Install

### 1. Clone the repo

```bash
git clone git@github.com:joelhooks/contributing-to-pi-mono.git ~/Code/joelhooks/contributing-to-pi-mono
cd ~/Code/joelhooks/contributing-to-pi-mono
npm install
```

### 2. Install the pi extension

```bash
mkdir -p ~/.pi/agent/extensions
ln -sfn ~/Code/joelhooks/contributing-to-pi-mono ~/.pi/agent/extensions/contributing-to-pi-mono
```

### 3. Install the public skill

```bash
mkdir -p ~/.pi/agent/skills
ln -sfn ~/Code/joelhooks/contributing-to-pi-mono/skills/contributing-to-pi-mono ~/.pi/agent/skills/contributing-to-pi-mono
```

Start a fresh pi session after that.

## Tools

### `pi_mono_search`

Search the public corpus:

- provider/model repro demands
- extension-vs-core guidance
- accepted PR direction
- maintainer profile summaries

Example prompts:

- `search pi-mono for "which provider/model triggered this"`
- `search pi-mono for extension vs core guidance`
- `find accepted direction around getAgentDir`

### `pi_mono_discovery`

Returns the current discovery payload from:

- `https://joelclaw.com/api/pi-mono`

Useful when the repo or install surface changes.

## Development

```bash
npm install
npm run typecheck
```

The extension calls the public API by default:

- `https://joelclaw.com/api/search?collection=pi_mono_artifacts`
- `https://joelclaw.com/api/pi-mono`

Override with:

```bash
export PI_MONO_CORPUS_BASE_URL=http://localhost:3000
```

## Why this exists

The point is not to automate issue spam. It's the opposite.

This repo is here to make upstream contribution slower in the right places:

- prove the repro
- capture provider/model
- isolate the broken boundary
- read the maintainer's actual words before proposing a fix

That saves everyone time.
