FROM node:16-alpine

ENV DEBUG=dss*

WORKDIR /home/node/app

COPY . .

RUN npm install

CMD ["/usr/local/bin/npm", "start"]
