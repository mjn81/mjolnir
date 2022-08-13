FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn migrate:dep

EXPOSE 4000

CMD [ "yarn", "start" ]
