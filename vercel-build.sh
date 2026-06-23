#!/bin/bash
set -e
mkdir -p packages/app/node_modules/@grexlabs
ln -sfn ../../../../core packages/app/node_modules/@grexlabs/core
ln -sfn ../../../../sdk/js packages/app/node_modules/@grexlabs/sdk
ln -sfn ../../../../ui packages/app/node_modules/@grexlabs/ui
cd packages/app && npx vite build
