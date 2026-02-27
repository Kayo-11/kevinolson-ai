#!/usr/bin/env bash
set -euo pipefail

print_step() {
  printf "\n==> %s\n" "$1"
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
}

current_branch() {
  git rev-parse --abbrev-ref HEAD
}

assert_not_main() {
  local branch_name="$1"
  if [[ "$branch_name" == "main" ]]; then
    echo "Preview deploys should run from a feature branch, not main." >&2
    echo "Create one: git checkout -b feat/your-change" >&2
    exit 1
  fi
}

assert_clean_or_committed() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "You have uncommitted changes. Commit first so preview maps to branch state." >&2
    exit 1
  fi
}

push_branch() {
  local branch_name="$1"
  git push -u origin "$branch_name"
}

deploy_preview() {
  local preview_url
  preview_url="$(vercel deploy --yes)"
  preview_url="$(printf "%s" "$preview_url" | grep -Eo "https://[^[:space:]]+" | awk 'NR==1{print $1}')"

  if [[ -z "$preview_url" ]]; then
    echo "Could not determine preview URL from Vercel output." >&2
    exit 1
  fi

  echo "$preview_url"
}

smoke_test_preview() {
  local preview_url="$1"
  local home_status
  local chat_status

  home_status="$(curl -sS -o /dev/null -w "%{http_code}" "$preview_url")"
  if [[ "$home_status" != "200" && "$home_status" != "401" ]]; then
    echo "Preview smoke test failed: $preview_url returned HTTP $home_status" >&2
    exit 1
  fi

  chat_status="$(curl -sS -o /dev/null -w "%{http_code}" "$preview_url/api/chat")"
  if [[ "$chat_status" != "405" && "$chat_status" != "401" ]]; then
    echo "Preview smoke test failed: $preview_url/api/chat returned HTTP $chat_status" >&2
    exit 1
  fi
}

print_step "Preflight checks"
require_command "git"
require_command "gh"
require_command "vercel"
require_command "curl"

gh auth status >/dev/null
vercel whoami >/dev/null

BRANCH_NAME="$(current_branch)"
assert_not_main "$BRANCH_NAME"
assert_clean_or_committed

print_step "Push branch"
push_branch "$BRANCH_NAME"

print_step "Deploy preview"
PREVIEW_URL="$(deploy_preview)"
echo "Preview URL: $PREVIEW_URL"

print_step "Smoke tests"
smoke_test_preview "$PREVIEW_URL"
echo "Preview smoke tests passed."

print_step "Done"
echo "Open a PR from $BRANCH_NAME and review this preview URL:"
echo "$PREVIEW_URL"
