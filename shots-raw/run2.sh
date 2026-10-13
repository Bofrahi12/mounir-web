#!/bin/bash
CHROME=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
cd ~/workspace/mounir-web/shots-raw
shot(){ "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --ignore-certificate-errors --proxy-server="http://127.0.0.1:8899" --user-agent="$UA" --window-size=1280,800 --virtual-time-budget="${3:-15000}" --screenshot="$1.png" "$2" 2>/dev/null; echo "$1: $(stat -c%s $1.png 2>/dev/null)"; }
shot gamerod "https://bofrahi12.github.io/gamerod/"
shot burgundy "https://bofrahi12.github.io/burgundy-wedding-demo/"
shot wedding "https://bofrahi12.github.io/wedding-site-demo/"
shot cvdemos "https://bofrahi12.github.io/cinevault-demos/"
shot cvessentials "https://bofrahi12.github.io/cinevault-essentials/"
shot tradepro "https://tradeproacademy.pro" 30000
echo DONE2
