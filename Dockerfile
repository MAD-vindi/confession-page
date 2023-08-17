FROM node:16-alpine3.13

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password \
    DB_USER=admin \
    DB_PASSWORD=password \
    AUTH_SOURCE=admin

RUN mkdir -p /home/app

COPY . /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "/home/app/app.js"]

