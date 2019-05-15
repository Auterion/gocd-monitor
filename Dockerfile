FROM node:11

WORKDIR /monitor

ADD . /monitor/

RUN yarn install

USER node

ENTRYPOINT yarn serve

