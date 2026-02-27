#!/usr/bin/env bash
set -euo pipefail

REQUIRED_LOCAL_ENV_VARS=(
  "ANTHROPIC_API_KEY"
)

REQUIRED_VERCEL_ENV_VARS=(
  "ANTHROPIC_API_KEY"
)

COMMIT_MESSAGE="${1:-chore: release $(date +"%Y-%m-%d %H:%M:%S")}"
CANONICAL_DOMAIN="${CANONICAL_DOMAIN:-kevinolson.ai}"
WWW_DOMAIN="${WWW_DOMAIN:-www.kevinolson.ai}"

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

assert_local_env_vars() {
  local env_file=".env.local"

  if [[ ! -f "$env_file" ]]; then
    echo "Missing $env_file. Copy .env.example and fill values first." >&2
    exit 1
  fi

  for var_name in "${REQUIRED_LOCAL_ENV_VARS[@]}"; do
    if ! grep -Eq "^${var_name}=.+" "$env_file"; then
      echo "Missing or empty ${var_name} in ${env_file}" >&2
      exit 1
    fi
  done
}

assert_vercel_env_vars() {
  local tmp_file
  tmp_file="$(mktemp)"
  trap 'rm -f "$tmp_file"' RETURN

  vercel env ls >"$tmp_file"

  for var_name in "${REQUIRED_VERCEL_ENV_VARS[@]}"; do
    if ! grep -q "$var_name" "$tmp_file"; then
      echo "Missing ${var_name} in Vercel project env vars" >&2
      exit 1
    fi
  done
}

commit_and_push() {
  if [[ -z "$(git status --porcelain)" ]]; then
    echo "No local changes to commit; skipping commit/push."
    return
  fi

  git add -A
  git commit -m "$COMMIT_MESSAGE"
  git push origin HEAD
}

deploy_prod() {
  local deploy_url
  deploy_url="$(vercel deploy --prod --yes)"
  deploy_url="$(printf "%s" "$deploy_url" | grep -Eo "https://[^[:space:]]+" | awk 'NR==1{print $1}')"

  if [[ -z "$deploy_url" ]]; then
    echo "Could not determine deployment URL from Vercel output." >&2
    exit 1
  fi

  echo "$deploy_url"
}

smoke_test() {
  local base_url="$1"
  local home_status
  local chat_status

  home_status="$(curl -sS -o /dev/null -w "%{http_code}" "$base_url")"
  if [[ "$home_status" != "200" ]]; then
    echo "Smoke test failed: $base_url returned HTTP $home_status" >&2
    exit 1
  fi

  chat_status="$(curl -sS -o /dev/null -w "%{http_code}" "$base_url/api/chat")"
  if [[ "$chat_status" != "405" ]]; then
    echo "Smoke test failed: $base_url/api/chat expected HTTP 405, got $chat_status" >&2
    exit 1
  fi
}

check_www_health() {
  local www_url="https://${WWW_DOMAIN}"
  local www_status

  if ! www_status="$(curl -sS -o /dev/null -w "%{http_code}" "$www_url")"; then
    echo "Warning: could not validate ${www_url} (DNS/TLS may still be propagating)." >&2
    return
  fi

  if [[ "$www_status" == "200" || "$www_status" == "301" || "$www_status" == "302" || "$www_status" == "307" || "$www_status" == "308" ]]; then
    echo "WWW health check ok: ${www_url} returned HTTP ${www_status}"
    return
  fi

  echo "Warning: ${www_url} returned HTTP ${www_status}. Canonical release checks still passed." >&2
}

print_step "Preflight checks (CLI + auth + env)"
require_command "git"
require_command "gh"
require_command "vercel"
require_command "curl"

gh auth status >/dev/null
vercel whoami >/dev/null
assert_local_env_vars
assert_vercel_env_vars

print_step "Commit and push"
commit_and_push

print_step "Deploy to Vercel production"
DEPLOY_URL="$(deploy_prod)"
echo "Deployed URL: $DEPLOY_URL"

print_step "Smoke tests"
CANONICAL_URL="https://${CANONICAL_DOMAIN}"
smoke_test "$CANONICAL_URL"
check_www_health
echo "Smoke tests passed."

print_step "Release complete"
echo "Production deployment is healthy: $CANONICAL_URL"
