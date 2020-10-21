FROM node:lts-alpine3.9
#FROM node # This will result in a lots of security warnings

ADD . /src

WORKDIR /src

RUN npm install .
CMD nodejs main.js
