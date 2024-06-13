#!/usr/bin/env bash

for ex in square squares triangle pattern snowflake spiral koch; do
  echo "### $ex"
  echo ""
  echo "\`\`\`"
  cat ./examples/$ex.logo
  echo "\`\`\`"
  echo ""
  echo "![$ex](./examples/$ex.png)"
  echo ""
  node logo.js ./examples/$ex.logo
done


