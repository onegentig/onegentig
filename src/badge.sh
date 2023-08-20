#!/usr/bin/env bash

set -euo pipefail

categories=($(jq -r '.stack | keys[]' ./data/me.json))

for section in "${categories[@]}"; do
     jq -r --arg section $section '.stack[$section][] | select(.badge) | .badge, .name' ./data/me.json
done | {
     while read -r badge; do
          read -r name
          echo "$badge $name.png"
     done | sort -n | cut -d' ' -f2-
}
