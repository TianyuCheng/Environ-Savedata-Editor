#!/usr/bin/env node

var fs = require('fs');
var magic = 1989127302;

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}

function writeRegion(writer, region) {
  console.log(region);

  var size = 4 + 1 + 14 * 4 + 4;
  var buffer = new Buffer(size);
  buffer.writeInt32LE(region.id, 0);
  buffer.writeInt8(region.active, 4);

  // these two does not count
  buffer.writeFloatLE(0, 5);  // political capital
  buffer.writeFloatLE(0, 9);  // funds

  var offset = 13;
  var scores = ['economy', 'environment', 'co2-emission', 
      'air-pollution', 'water-pollution', 'land-pollution',
      'gross-domestic-product', 'income-equality', 'purchasing-power',
      'technology', 'green-sentiment', 'donations'];

  // write in scores
  for (var i in scores) {
    var score = scores[i];
    buffer.writeFloatLE(region.scores[score], offset);
    offset += 4;
  }

  var numNodes = region.history.length;
  buffer.writeInt32LE(numNodes, offset);   // write in num of nodes in history
  // console.log (buffer);
  writer.write(buffer);

  // write in history
  size = numNodes * (4 + 10);
  var history = new Buffer(size);
  offset = 0;
  for (var i = 0; i < numNodes; i++) {
    var node = region.history[i];
    var key = pad(10, node.key, ' ');
    history.write(key, offset);
    history.writeFloatLE(node.time, offset + 10);
    offset += 14;
  }
  writer.write(history);
}

function writeHeader(writer, info) {
  var header = new Buffer(28);

  // write header
  header.writeUInt32LE(magic, 0);
  header.writeFloatLE(info.time, 4);
  header.writeDoubleLE(info.political_capital, 8);
  header.writeDoubleLE(info.funds, 16);
  header.writeInt32LE(info.region_counts, 24);
  // console.log(header);
  writer.write(header);
  return header;
}


function serialize(filename, info) {
  var writer = fs.createWriteStream(filename);
  writeHeader(writer, info);

  for (var i = 0; i < info.region_counts; i++) {
    writeRegion(writer, info.regions[i]);
  }

}

exports.serialize = serialize;
