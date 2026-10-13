#!/bin/bash
CHROME=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
cd ~/workspace/mounir-web/shots-raw
shot(){ "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --ignore-certificate-errors --proxy-server="http://127.0.0.1:8899" --window-size=1280,800 --virtual-time-budget="${3:-15000}" --screenshot="$1.png" "$2" 2>/dev/null; echo "$1: $(stat -c%s $1.png 2>/dev/null)"; }
curl -s -o /dev/null --max-time 55 "https://tradeproacademy.pro" &
shot capimmo "https://bofrahi12.github.io/capimmo-tanger/"
shot localboost "https://bofrahi12.github.io/localboost-ai-site/"
shot islamic "https://bofrahi12.github.io/islamic-civilization-explorer/"
shot safebuy "https://bofrahi12.github.io/tanger-safe-buy/"
shot blog "https://apartmentgreenery.blogspot.com/"
shot affiliates "https://bofrahi12.github.io/cinevault-affiliates/"
shot dashboard "https://bofrahi12.github.io/discover-islam-dashboard/"
shot mksb "https://bofrahi12.github.io/mounir-web/mksb-demo.html"
shot bermijou "https://bofrahi12.github.io/mounir-web/bermijou-demo.html"
shot mode "https://bofrahi12.github.io/mounir-web/demo-mode.html"
shot resto "https://bofrahi12.github.io/mounir-web/demo-resto.html"
wait
shot tradepro "https://tradeproacademy.pro" 30000
echo DONE
