#!/bin/bash
# usage: dl-commons.sh "<Commons filename with spaces>" "<output abs path>"
NAME="$1"
OUT="$2"
UND="${NAME// /_}"
H=$(node -e "const d=require('crypto').createHash('md5').update(process.argv[1]).digest('hex');console.log(d[0]+'%2F'+d.slice(0,2))" "$UND")
ENC=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$UND")
URL="https://images.weserv.nl/?url=upload.wikimedia.org%2Fwikipedia%2Fcommons%2F${H}%2F${ENC}"
curl -sL --max-time 90 -A "Mozilla/5.0" "$URL" -o "$OUT"
SZ=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
if [ "$SZ" -lt 20480 ]; then
  # fallback: Special:FilePath
  URL2="https://images.weserv.nl/?url=commons.wikimedia.org%2Fwiki%2FSpecial%3AFilePath%2F${ENC}"
  curl -sL --max-time 90 -A "Mozilla/5.0" "$URL2" -o "$OUT"
  SZ=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
fi
echo "$OUT : $SZ bytes"
