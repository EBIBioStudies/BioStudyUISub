global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
//var passport =        require('passport');
var session = require('express-session');

//routing
var routes = require('./server/routes/index');
console.log("Node environment ", process.env.NODE_ENV);

var app = express();
function cors(req, res, next) {
    console.log('Allow',req,res);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));

app.use('/',function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods','*');
    next();
});

app.use(express.static(path.join(__dirname, '.build'),{
    'setHeaders': function(res, path) {
        console.log('CORS', path);
    }
}));
app.use(session({ secret: 'XYZaa!@£$',saveUninitialized: true,
    resave: true }));


routes(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
