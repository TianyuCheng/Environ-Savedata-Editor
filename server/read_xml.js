// retrieve xml information
var xml_info = require('child_process').spawn(
    'python',
    // second argument is array of parameters, e.g.:
    ["server/python/read_xml.py"]);
var xml_output = "";
xml_info.stdout.on('data', function(data){ xml_output += data });

xml_info.on('close', function(code){ 
  if (code !== 0) {  return res.send(500, code); }
  var infos = JSON.parse(xml_output);
  // console.log(infos);
  exports.mappings = infos;
});


