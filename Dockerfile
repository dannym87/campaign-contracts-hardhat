FROM node:12-alpine

WORKDIR /usr/app

RUN npm install

COPY . .