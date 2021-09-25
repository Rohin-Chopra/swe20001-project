FROM node:14-alpine as builder
WORKDIR /workspace
COPY package.json yarn.lock ./
RUN yarn --prod
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]
