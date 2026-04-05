# Safety Hooks

The harness installs three `PreToolUse` hooks into `.claude/settings.json`.
These hooks run automatically before Claude Code executes a Bash command. They
inspect the command text and either block it (exit code 2) or warn about it
(exit code 0).

## How Hooks Work

Claude Code supports hooks that run before and after tool use. The harness uses
`PreToolUse` hooks with the `Bash` matcher, meaning they fire before any shell
command Claude attempts to run.

**Hook protocol:**

- Exit code `0` — Allow the command (with optional warning on stderr).
- Exit code `2` — Block the command. Claude sees the block message and cannot
  proceed.

**Identification:** Every harness hook has `# @300-harness` in its
`hook_command` string. This marker is how `300-harness update` distinguishes
harness hooks from user-added hooks during sync.

## Hook 1: Force-Push Blocker

**What it blocks:** `git push --force` (or `--force-with-lease`) to
`main` or `master` branches.

**Behavior:** Prints `BLOCK: force-push to main/master is prohibited` to
stderr and exits with code 2, preventing the command.

**Regex pattern:**

```
git\s+push.*--force.*\b(main|master)\b
```

**What it does not block:**

- Force-pushing to feature branches (`git push --force origin my-feature`).
- Normal pushes to main (`git push origin main`).
- Force-pushing to branches named something other than main or master.

**Why this exists:** Force-pushing to main/master can destroy shared history.
This is almost never what you want, and when it is, it should be done manually
with explicit intent, not by an AI assistant.

---

## Hook 2: Secrets File Staging Blocker

**What it blocks:** `git add` of files with these extensions: `.env`, `.pem`,
`.tfvars`, `.clerk`.

**Behavior:** Prints `BLOCK: staging secrets file is prohibited` to stderr and
exits with code 2.

**Regex pattern:**

```
git\s+add.*\.(env|pem|tfvars|clerk)\b
```

**What it does not block:**

- Reading or creating these files.
- Adding them to `.gitignore`.
- Committing other files in the same command (the hook only fires if the
  pattern matches the command string).

**What it does not catch:**

- `git add .` or `git add -A` where a secrets file happens to be in the
  working tree. The hook checks the command text, not the actual files
  being staged. This is a known limitation — the hook is a safety net, not a
  guarantee.
- Files with non-standard secret extensions (e.g., `.key`, `.secret`,
  `.credentials`). The extension list is deliberately conservative; add more
  via custom hooks if needed.

**Why this exists:** Accidentally committing secrets is a common and costly
mistake. Blocking the most obvious cases catches most accidental staging.

---

## Hook 3: Destructive Git Operations Warning

**What it warns about:** `git reset --hard` and `git clean -f`.

**Behavior:** Prints `WARN: destructive git operation detected` to stderr and
exits with code 0 (allows the command to proceed).

**Regex pattern:**

```
git\s+(reset\s+--hard|clean\s+-f)
```

**Why a warning, not a block:** These commands are destructive but sometimes
necessary (e.g., resetting to a known good state). Blocking them would be too
restrictive. The warning ensures Claude acknowledges the risk.

**What it does not warn about:**

- `git checkout -- .` (also destructive, but less commonly dangerous).
- `rm -rf` (not a git operation; covered by Claude Code's own safety).
- `git branch -D` (deleting a branch — recoverable via reflog).

---

## Adding Custom Hooks

Users can add their own hooks directly to `.claude/settings.json`. The harness
preserves any hook that does not contain `# @300-harness` in its `hook_command`.

**Example: Block npm publish:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hook_command": "bash -c 'echo \"$TOOL_INPUT\" | grep -qE \"npm\\s+publish\" && echo \"BLOCK: use pnpm release instead\" >&2 && exit 2 || true'"
      }
    ]
  }
}
```

This custom hook will survive `300-harness update` because it does not contain
the `# @300-harness` marker.

---

## Hook Limitations

These hooks are best-effort safety nets, not security controls:

1. **Text matching only.** Hooks inspect the command string, not the actual
   operation. Aliased or obfuscated commands may bypass them.
2. **Single-command scope.** A hook fires per Bash tool call. A multi-step
   script that constructs a dangerous command from variables will not be caught.
3. **No state awareness.** Hooks do not know what branch you are on, what files
   exist, or what previous commands did. They are pure text filters.
4. **User can override.** A user can always edit `.claude/settings.json` to
   remove hooks. The harness will re-add them on next `update`, but between
   updates they are absent.

The hooks exist to catch common mistakes during normal AI-assisted development.
They are not a substitute for branch protection rules, CI checks, or
`.gitignore` configuration.
