#!/usr/bin/env bash

set -euo pipefail

BINDING="state-of-the-cardano-developer-ecosystem-2025"
KEYS="/tmp/kv_keys.txt"

yarn -s wrangler kv key list --remote --binding "$BINDING" > $KEYS
yarn -s wrangler kv bulk get $KEYS --remote --binding "$BINDING"
