FROM node:21.4-alpine3.19 AS builder
WORKDIR /src
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
ENTRYPOINT ["node", "dist/index.js"]
