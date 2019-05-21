FROM node:8

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install

RUN npm install @vue/cli

COPY . .

EXPOSE 8080