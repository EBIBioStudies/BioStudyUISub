FROM node:14.17.5
EXPOSE 8120
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./dist /usr/src/app

RUN npm install
RUN npm install global-agent
CMD ["bash", "-c", "NODE_ENV=production node -r 'global-agent/bootstrap' server/app.js"]
