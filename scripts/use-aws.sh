#!/bin/bash
# Alias for: ./scripts/use-env.sh aws
exec "$(dirname "$0")/use-env.sh" aws "$@"
