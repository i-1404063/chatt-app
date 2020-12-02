FROM node:14

WORKDIR /app

RUN npm install -g nodemon

COPY package.json ./

RUN npm install

COPY . ./

ARG DEFAULT_PORT=3000

ENV PORT=${DEFAULT_PORT}

EXPOSE ${PORT}

CMD [ "nodemon", "server.js" ]