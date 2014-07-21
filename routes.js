var fs = require('fs');
var path = require('path');
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

// GET savedata page
exports.savedata = function (req, res) {

  switch (req.method) 
  {
    case 'GET':
      return read_savedata(req, res, path.join(__dirname, "server/data/empty.dat"), xml.mappings);
      break;
    case 'POST':
      return read_savedata(req, res, req.files.datafile.path, xml.mappings);
      break;
    default:
      res.send("You found the secret!");
  }
}

// POST savedata to backend
exports.save = function (req, res) {
  var obj = {};
  // console.log('save info: ' + JSON.stringify(req.body));
  save_savedata('./server/data/save/save.dat', req.body);
  res.send(req.body);
}
