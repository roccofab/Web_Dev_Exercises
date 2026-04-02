#!/bin/sh

# initialize db if it doesn't exists
if [ ! -f ./models/data/app_data.db ]; then
  echo "First run: initializing DB..."
  node db/init_db.js
else
  echo "DB already exists, skipping init"
fi

echo "Starting app..."
node index.js