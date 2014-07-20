
exports.read_savedata = function (req, res, filename, mappings) {
  console.log(filename);
  var python = require('child_process').spawn(
      'python',
      // second argument is array of parameters, e.g.:
      ["server/python/read_savedata.py", filename]);
      // ["python/read_savedata.py", 'server/data/savedata.dat']);
  var output = "";
  python.stdout.on('data', function(data){ output += data });

  python.on('close', function(code) { 
    if (code !== 0) {  
      return res.send("Error happened during reading files!"); 
    }
    var infos = JSON.parse(output);
    // console.log(infos);
    return res.render('savedata', {
      title : 'Environ',
      info : infos,
      mappings : mappings
    });
  })

}
