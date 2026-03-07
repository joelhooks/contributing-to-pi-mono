---
name: contributing-to-pi-mono
displayName: Contributing to pi-mono
description: "Public skill for contributing fixes, bug reports, and upstream discussions to badlogic/pi-mono without wasting maintainer time. Use when filing pi issues, preparing pi PRs, or deciding whether a bug belongs in pi core, a provider adapter, or an extension."
version: 0.1.0
author: Joel Hooks
tags: [pi, pi-mono, upstream, contributing, github, quality]
---

# Contributing to pi-mono

This skill exists to stop you sending half-baked upstream reports to Mario.

The rule is simple: if you cannot explain **which provider/model triggered the bug**, whether it reproduces on **clean upstream**, and **which layer violated the invariant**, you are still debugging locally.

## Use this before you file upstream

1. Reproduce on clean `origin/main`
2. Reproduce with extensions disabled
3. Record provider + model
4. Record whether you used a published install or a local patched build
5. Isolate the broken boundary: provider, extension, adapter, or core
6. Read the maintainer corpus before writing the issue

## Search the corpus

If the `pi_mono_search` extension tool is installed, use it.

Otherwise hit the public API directly:

```bash
curl -sS "https://joelclaw.com/api/search?q=which+provider%2Fmodel+triggered+this&collection=pi_mono_artifacts"
```

Useful searches:

```bash
curl -sS "https://joelclaw.com/api/search?q=Breaks+TUI&collection=pi_mono_artifacts"
curl -sS "https://joelclaw.com/api/search?q=extension&collection=pi_mono_artifacts"
curl -sS "https://joelclaw.com/api/search?q=getAgentDir&collection=pi_mono_artifacts"
```

## What Mario is implicitly asking for

When a maintainer says:

- `which provider/model triggered this?`
- `please reopen the issue with concrete steps to reproduce`
- `on a type level, this is impossible`

...the answer is not to add a guard and hope.

The answer is:

- prove the state exists
- show how to reproduce it
- identify whether the bad state originated below core

## Issue template

```md
Problem
- One sentence describing the failure.

Repro
1. Step one
2. Step two
3. Step three

Environment
- provider/model:
- build: clean origin/main | published install | local patched build
- extensions: on/off

Expected
- ...

Actual
- ...

Hypothesis
- The invariant appears to break in <provider|adapter|extension|core> because ...
```

## Do not do this

- don't lead with the patch before the repro
- don't call it a core bug just because core crashed
- don't hide local patches, repo-wired binaries, or enabled extensions
- don't dump a whole session diary into the issue body
- don't make the maintainer reverse-engineer your machine state

## Accepted pattern

The good pattern is short and concrete.

A fast maintainer `lgtm` usually means:

- the direction is obvious
- the scope is narrow
- the package boundary is right
- the issue or PR did not waste anyone's time

## Public discovery

The current discovery surface lives at:

- `https://joelclaw.com/api/pi-mono`

Use it when install steps or corpus behaviour changes.
