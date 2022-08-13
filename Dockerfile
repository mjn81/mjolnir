FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

COPY .env.production ./

COPY .env ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma migrate deploy

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]
