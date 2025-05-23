#!/bin/bash

echo "Starting Next.js development server..."
npm run dev 2>&1 | tee server.log