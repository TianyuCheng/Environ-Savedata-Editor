var fs = require('fs');
var Parser = require('binary-parser').Parser;

var merge = function(dict1, dict2) {
  for (var attr in dict2)
    dict1[attr] = dict2[attr];
  return dict1
}

var read = function(callback) {

  var filename = "/Users/tc26752/Projects/SaveFile/savedata.dat";

  fs.stat(filename, function(error, stats) {
    
    var info = {};

    fs.open(filename, 'r', function(error, fd) {
      if (error) {
        console.log(error.message);
        return;
      }

      info.filesize = stats.size;

      // read header
      var buffer = new Buffer(stats.size);
      fs.read(fd, buffer, 0, 24, 0, function(err, num) {

        // read header
        var headerReader = new Parser()
          .endianess('little')
          .uint32('magic_number')
          .doublele('political_capital')
          .doublele('funds')
          .int32('region_counts')

        info = merge(info, headerReader.parse(buffer));

        // read regions
        var regionsReader = new Parser()
          .endianess('little')
          .skip(32 * 6)


        // pass to the front end
        console.log(info);
        callback(info);
      });

    }); // end of fs open

  }); // end of fs stat

}

exports.read = read
