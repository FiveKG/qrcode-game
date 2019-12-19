#!/bin/bash
#Description: run admin-site service
export DB_HOST=121.9.227.91
export DB_PORT=12432
export DB_USER=qrcode_game
export DB_PWD=pass_2019
export DB_NAME=qrcode_game_db
export REDIS_HOST=121.9.227.91
export REDIS_PORT=20179
export REDIS_DB=6
export JWT_SECRET=scangamenjkuz
export HASH_SECRET=scangamesha256
export PROXY_HOST=http://postgrest.qrcode.isecsp.com/
export REDIS_PWD=pass@2019
npm start 