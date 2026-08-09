#!/bin/bash
# Alias for: ./scripts/use-env.sh local
exec "$(dirname "$0")/use-env.sh" local "$@"
