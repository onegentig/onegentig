#!/usr/bin/env bash

set -euo pipefail

categories=($(jq -r '.stack | keys[]' ./data/me.json))

for section in "${categories[@]}"; do
     jq -r --arg section $section '.stack[$section][] | select(.orderBadge) | .orderBadge, .name' ./data/me.json
done | {
     while read -r orderBadge; do
          read -r name
          echo "$orderBadge $name.svg"
     done | sort -n | cut -d' ' -f2-
}
