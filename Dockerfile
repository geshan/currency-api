FROM node:10-alpine

RUN apk update && apk add git

WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm install --production

COPY . /src

EXPOSE 8080

CMD ["node", "index.js"]
