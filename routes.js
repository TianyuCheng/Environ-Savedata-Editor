var xml = require('./server/read_xml');

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

  var python = require('child_process').spawn(
      'python',
      // second argument is array of parameters, e.g.:
      ["server/python/read_savedata.py", 'server/data/tmp/savedata.dat']);
  var output = "";
  python.stdout.on('data', function(data){ output += data });

  python.on('close', function(code){ 
    if (code !== 0) {  return res.send(500, code); }
    var infos = JSON.parse(output);
    // console.log(infos);
    return res.render('savedata', {
      title : 'Environ',
      info : infos,
      mappings : xml.mappings
    })
  });

}

// POST savedata page

// POST savedata to backend
exports.save = function (req, res) {
  var obj = {};
  console.log('save info: ' + JSON.stringify(req.body));
  res.send(req.body);
}
