FROM node:lts-alpine
RUN apk update && apk upgrade
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ./app /usr/src/app
RUN npm ci --only=production
CMD "npm" "start"
