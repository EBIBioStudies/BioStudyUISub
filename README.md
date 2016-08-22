# BioStudyUISub #

User interface module for BioStudySubm web application. 

### Install tools ###
Open terminal/command line window and run following commands
```
 npm install jspm -g
 npm install gulp -g
 
```

### Configuration after pulling the repository ###
Open terminal/command line window and run following commands
```
 cd BioStudyUISub
 npm install
 jspm install

```

### Build and run###

### Dev environment ###

To create .war file just run: 
```
 gulp

```

To start a local webserver you will need a proxy server (BioStudySubmProxy) real or fake one running locally or remotely. By default
proxy expected to be on localhost:10280. You can customize this in the 'webserver' task in Gulpfile.js if needed. As soon
as proxy is running you can use the following command to start the UI on a localhost:7000.
```
 gulp webserver

```

### Tests ###

Everything that in ./test/spec folder will be run by gulp task 'test':
```
gulp test
```
