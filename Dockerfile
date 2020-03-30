FROM node:10.16.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./dist /usr/src/app

CMD ["bash", "-c", "NODE_ENV=production node ."]
