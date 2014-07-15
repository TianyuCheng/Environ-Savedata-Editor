/*
 * Module dependencies
 */
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var fs = require('fs');
var data = require('./readfile');

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

app.use(express.static(__dirname + '/public'))
app.locals.pretty = true;

// home page
app.get('/', function (req, res) {
  res.render('index', {
    title : 'Environ'
  })

});

// savedata
app.get('/savedata', function (req, res) {

  var python = require('child_process').spawn(
      'python',
      // second argument is array of parameters, e.g.:
      ["read_savedata.py"]);

  var output = "";
  python.stdout.on('data', function(data){ output += data });

  python.on('close', function(code){ 
    if (code !== 0) {  return res.send(500, code); }
    var infos = JSON.parse(output);
    console.log(infos);
    // return res.send(200, infos)
    return res.render('savedata', {
      title : 'Environ',
      info : infos
    })
  });

});

app.listen(3002);
console.log("Server starts on port 3002");
