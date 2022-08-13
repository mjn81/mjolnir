FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY . .

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]
