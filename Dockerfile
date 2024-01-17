FROM node:latest as builder

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD npm start
