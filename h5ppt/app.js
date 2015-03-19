var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var routes = require('./routes/index');
var m_index = require('./routes/m_index');
var ppt = require('./routes/ppt');
var m_ppt = require('./routes/m_ppt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',hbs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var cache = 24 * 60 * 60 * 1000;
app.use(express.static(path.join(__dirname, 'public'),{maxAge: cache}));

app.use('/', routes);
app.use('/m_index', m_index);
app.use('/ppt', ppt);
app.use('/m_ppt', m_ppt);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
