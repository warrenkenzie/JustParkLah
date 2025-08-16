FROM node:lts-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN echo "* * * * * node /app/build/script/UpdateCarParkAvailability.js >> /var/log/cron.log 2>&1" > /etc/crontabs/root \
 && echo "0 0 * * * node /app/build/script/UpdateHDBCarparkInformation.js >> /var/log/cron.log 2>&1" >> /etc/crontabs/root \
 && touch /var/log/cron.log

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]