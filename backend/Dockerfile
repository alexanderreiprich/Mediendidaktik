FROM node:22.16
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /usr/src/app/userfiles

CMD ["node", "index.js"]