FROM node:12-alpine

WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm install --production

COPY . /src

EXPOSE 8080

RUN npm config set unsafe-perm true
RUN npm install -g nodemon

CMD ["node", "index.js"]
