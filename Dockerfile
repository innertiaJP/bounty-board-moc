FROM node:lts

RUN mkdir -p /root/src

WORKDIR /root/src

COPY ./src src
