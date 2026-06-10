#!/usr/bin/env bash
# ============================================================
# ** POC ** Lance les 4 applications de la phase 2 en parallèle.
# - shell-modern (Angular 21) sur Node 24
# - legacy-shell, mfe-stats, mfe-notifications (Angular 16) sur Node 18
# ============================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

if [ -z "$NVM_DIR" ]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "Erreur : nvm introuvable. Installer nvm puis Node 18 et Node 24."
  exit 1
fi

# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"

# Détermine les chemins des binaires Node pour chaque version.
nvm use 18 > /dev/null
NODE18_BIN="$(dirname "$(which node)")"

nvm use 24 > /dev/null
NODE24_BIN="$(dirname "$(which node)")"

cd "$ROOT"

npx concurrently \
  -n shell,legacy,stats,notif \
  -c cyan,blue,yellow,magenta \
  "PATH=$NODE24_BIN:\$PATH npm --prefix shell-modern run start" \
  "PATH=$NODE18_BIN:\$PATH npm --prefix legacy-shell run start" \
  "PATH=$NODE18_BIN:\$PATH npm --prefix mfe-stats run start" \
  "PATH=$NODE18_BIN:\$PATH npm --prefix mfe-notifications run start"
