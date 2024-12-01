#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://wordle_db_dheh_user:ZFTeNMcBkMXIGTGLriKfH1JcvK2QTCDA@dpg-ct40v252ng1s73a1e8ng-a.oregon-postgres.render.com/wordle_db_dheh"

# Execute each .sql file in the directory
for file in init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done