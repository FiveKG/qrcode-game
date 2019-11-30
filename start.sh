#!/bin/bash
#Description: run admin-site service
export DB_HOST=DB_HOST
export DB_PORT=12432
export DB_USER=DB_USER
export DB_PWD=DB_PWD
export DB_NAME=DB_USER_db
export REDIS_HOST=DB_HOST
export REDIS_PORT=REDIS_PORT
export REDIS_DB=6
export JWT_SECRET=JWT_SECRET
export HASH_SECRET=HASH_SECRET
export PROXY_HOST=PROXY_HOST
export REDIS_PWD=REDIS_PWD
npm start 