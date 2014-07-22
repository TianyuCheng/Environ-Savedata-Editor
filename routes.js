var fs = require('fs');
var path = require('path');
var temp = require('temp');
var xml = require('./server/read_xml');
var read_savedata = require('./server/read_savedata').read_savedata;
var save_savedata = require('./server/save_savedata').serialize;

/**
 * GET homepage
 */
exports.index = function (req, res) {
  res.render('index', {
    title : 'Environ'
  })
}

var deleteFile = function (filename) {
  fs.unlink(filename);
}

// GET/POST savedata page
exports.savedata = function (req, res) {

  switch (req.method) 
  {
    case 'GET':
      read_savedata(req, res, path.join(__dirname, "server/data/empty.dat"), xml.mappings, null);
      break;
    case 'POST':
      read_savedata(req, res, req.files.datafile.path, xml.mappings, deleteFile);
      break;
    default:
      res.send("You found the secret!");
  }
}

// POST savedata to backend
exports.save = function (req, res) {
  if (req.body.environ_savedata != 'undefined') // use the old path
    filename = "public/" + req.body.environ_savedata;
  else // create a random path
    filename = temp.path({ dir: "public/savedata/", suffix: '.dat'});

  var obj = {};
  save_savedata(filename, req.body);
  req.body['environ_savedata'] = filename.substring(7);
  res.send(req.body);
}
