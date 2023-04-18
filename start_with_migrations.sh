#!/bin/sh

set -ex
npx prisma db push --accept-data-loss
npm run start
