FROM node:21.4-alpine3.19 AS frontend
WORKDIR /src
RUN yarn global add serve
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
ENTRYPOINT ["serve", "-s", "build"]
