#!/usr/bin/env bash

# 1. Administrative Shield
if [ "$EUID" -ne 0 ]; then
  echo "[INFO] Escalating to root privileges..."
  sudo -v
  # Keep-alive
  while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
fi

# Portable Path Resolution
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/Ui" || { echo "[ERROR] Ui directory not found!"; exit 1; }

# 2. Dependency Safetynet
if [ ! -d "node_modules" ]; then
  echo "[INFO] node_modules not found. Installing dependencies..."
  npm install
elif [ "package.json" -nt "node_modules" ]; then
  echo "[INFO] package.json is newer than node_modules. Updating dependencies..."
  npm install
  touch node_modules
else
  echo "[OK] Dependencies are up to date."
fi

# 3. Recompilation Loop
echo "[INFO] Triggering clean build..."
npm run build

EXT_PATH="$DIR/Ui/dist"

# 4. Interactive Browser Selection Menu
echo "========================================="
echo "  Cross-Platform Local Deployment Tool   "
echo "========================================="
PS3="Select your target browser (1-7): "
options=("Google Chrome" "Brave Browser" "Comet Browser" "Firefox (web-ext)" "Opera Air" "Opera" "Opera GX" "Quit")

select opt in "${options[@]}"; do
  case $opt in
    "Google Chrome")
      open -a "Google Chrome" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Brave Browser")
      open -a "Brave Browser" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Comet Browser")
      open -a "Comet" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Firefox (web-ext)")
      echo "[INFO] Launching Firefox via web-ext..."
      npx web-ext run --source-dir="$EXT_PATH"
      break
      ;;
    "Opera Air")
      open -a "Opera Air" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Opera")
      open -a "Opera" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Opera GX")
      open -a "Opera GX" --args --load-extension="$EXT_PATH"
      break
      ;;
    "Quit")
      exit 0
      ;;
    *) echo "Invalid selection $REPLY";;
  esac
done

echo "[INFO] Launch sequence complete."
