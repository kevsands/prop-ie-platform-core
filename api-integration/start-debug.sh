#!/bin/bash
cd /Users/kevin/Downloads/awsready/prop-ie-aws-app
npm run dev > dev-output.log 2>&1 &
PID=$!
sleep 5
if ps -p $PID > /dev/null; then
  echo "Server started with PID: $PID"
  head -50 dev-output.log
else
  echo "Server failed to start. Error log:"
  cat dev-output.log
fi