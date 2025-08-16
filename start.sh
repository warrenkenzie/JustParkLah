#!/bin/sh
node /app/build/script/UpdateCarParkAvailability.js
node /app/build/script/UpdateHDBCarparkInformation.js

crond -l 2 &

node /app/build/Bot.js