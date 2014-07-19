/*
 * Module dependencies
 */
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var fs = require('fs');
var bodyParser  = require('body-parser');
var routes = require('./routes');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
    , compile: compile
  }
))
// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'))
app.locals.pretty = true;

// home page
app.get('/', routes.index);

// savedata display page
app.get('/savedata', routes.savedata);

// savedata save post
app.post('/save', routes.save);


var port = 3000;
app.listen(port);
console.log("Server starts on port " + port);
