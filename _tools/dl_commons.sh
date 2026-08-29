#!/bin/bash
# usage: dl_commons.sh <output-name> <Commons filename with spaces>
OUT="/c/Users/24939/.zcode/workspace/default/gyh-site/public/images/bikes"
out="$1"; shift
fn="$*"
p=$(node -e "console.log(encodeURIComponent(process.argv[1].replace(/ /g,'_')))" "$fn")
url="https://images.weserv.nl/?url=commons.wikimedia.org%2Fwiki%2FSpecial%3AFilePath%2F${p}%3Fwidth%3D1600"
for i in 1 2 3; do
  curl -sL --max-time 90 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "$url" -o "$OUT/$out"
  sz=$(stat -c%s "$OUT/$out" 2>/dev/null || echo 0)
  if [ "$sz" -gt 20480 ]; then break; fi
  sleep 10
done
echo "$out <- $fn : ${sz} bytes"
if [ "$sz" -lt 20480 ]; then echo "TOO SMALL: $out"; rm -f "$OUT/$out"; fi
