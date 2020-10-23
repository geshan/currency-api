FROM node:14-alpine

WORKDIR /src
COPY . /src

ENV NODE_ENV=production
RUN npm install --production

EXPOSE 8080

CMD ["node", "index.js"]
