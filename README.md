# BioStudyUISub #

BioStudies DB submission web interface.

### Install environment ###
```
 npm install
 npm install @angular/cli -g
 npm install gulp -g
 
```

### Configure ###
* `./proxy.conf.json`: specify where is the proxy app server is running
* `./config.json`: specify the context and proxy app context

```
{
...
"APP_PROXY_BASE": "/proxy",
"APP_CONTEXT": "/",
...
}
```

### Run (dev mode) ###
```
$ npm start
```

### Run (prod mode) ###
```
$ gulp config
$ ng build --prod
$ gulp webserver
```

### Tests ###
To be added...
