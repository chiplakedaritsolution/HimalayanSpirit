#!/usr/bin/env bash
# One-command safe sync to GitHub: shows changes, asks first, never force-pushes.
set -e
git rev-parse --is-inside-work-tree >/dev/null
[ "$(git branch --show-current)" = "main" ] || { echo "Switch to the main branch first."; exit 1; }
git ls-files --error-unmatch .env >/dev/null 2>&1 && { echo "STOP: .env is tracked by git. Run: git rm --cached .env"; exit 1; }
git fetch origin main
git merge --ff-only origin/main || { echo "GitHub has changes you do not have locally. Not pushing. Run: git pull"; exit 1; }
git add -A
if git diff --cached --quiet; then echo "Nothing new to commit."; exit 0; fi
echo "=== Files being committed ==="; git diff --cached --stat
git diff --cached --name-status | grep '^D' && echo "WARNING: the files marked D will be DELETED from the repository."
read -r -p "Commit and push these changes to GitHub? (y/N) " a
[ "$a" = "y" ] || { git reset -q; echo "Cancelled. Nothing was committed or pushed."; exit 0; }
read -r -p "Commit message: " m
git commit -m "${m:-Website update}"
git push origin main
echo "Done: pushed to GitHub."
