# BioStudies - Submission Tool

- Angular v10
- Bootstrap v4
- ExpressJS v4
- Node v10.16.2

## Getting Started

### 1. Configure

This project uses [config](https://www.npmjs.com/package/config) module which expects a `.env` file in the root directory.

Create a `.env` file in the root of the project and copy / pase the next environment variable definitions in it:

```js
PORT = port;
BACKEND_PATH_CONTEXT = pathname;
BACKEND_HOST_NAME = hostname;
BACKEND_PORT = port;
```

- `PORT` is the service proxy (Node) port
- `BACKEND_PATH_CONTEXT` is the pathname of the backend service URL
- `BACKEND_HOST_NAME` is the hostname or backend URI
- `BACKEND_PORT` is the port where the backend is running

### 2. Install dependencies

Be sure your local environment has `Node v10.16.2` and `NPM v6.9.0` at least.

Run the next script to install dependencies:

```
 npm install
```

### 3. Run in development mode

Run the next script to execute the application in **development mode**:

```
npm run dev
```

- The `npm run dev` will run a **Node + Express** service which proxies the requests to **BioStudies** backend and a **Angular Dev Server** to get local development benefits (hot reload + live TS compilation)
- By default **Node + Express** service runs on `8080` port
- By default **Angular Dev Server** service runs on `4200` port
- If `PORT` is changed, it should be updated in the `proxy.config.json` file which is the **Angular Dev Proxy** configuration file

## Run production mode

Make sure you have the `.env` file created as it's described in **Getting Started - Configure**

Run the next steps to build and execute the application in **production** mode:

```
npm run build
cp .env ./dist
cd ./dist
npm run node:prod
```

### Tests

Run the next script to execute unit tests:

```
npm run test
```
