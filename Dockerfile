FROM node:7-alpine

WORKDIR /web
COPY package.json /web
RUN npm i --production
COPY . /web
CMD ["./bin/pokemock", "http://storage.googleapis.com/entranic-core/gateway.swagger.json", "-p", "80"]