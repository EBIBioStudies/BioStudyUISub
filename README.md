# BioStudyUISub #

User interface module for BioStudySubmProxy web application. To compile it you will need nodejs
because we use tools like less, gulp, browserify etc.

### Install tools ###
Open terminal/command line window and run following commands
```
 npm install gulp -g
 npm install bower -g

```

### Configuration after pulling the repository ###
Open terminal/command line window and run following commands
```
 cd BioStudyUISub
 bower install
 npm install

```

### Build and run###

### Dev environment ###

Open terminal/command line window and run following commands
```
 gulp

```

Start express server so you can test it locally. The client will call endpoints defined in server/routes/proxy.js
```
 node bin/www

```


### Test environment ###
Integrate with BioStudySubmProxy. The client code is build and copied to BioStudySubmProxy/WebContent

Open terminal/command line window and run following commands
```
 export NODE_ENV=test
 export BIOSD_DIR=../BioStudySubmProxy/WebContent
 gulp
 

```

Start express server so you can test it locally. The client will call endpoints defined in server/routes/proxy.js
```
 node bin/www

```
