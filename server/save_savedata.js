#!/usr/bin/env node

var fs = require('fs');
var magic = 1989127302;
var calcCycles = 0;

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, string + padding, padding)
}

function writeRegion(writer, region) {
  // console.log(region);
  // format: region_id, region_active, 14 scores, calcCycles * (4 + 4), history_num, history_num * (9 + 4)
  var numNodes = region.history.length;
  var size = 4 + 4 + 14 * 4 + calcCycles * 8 + 4 + numNodes * 13;
  var buffer = new Buffer(size);
  buffer.writeInt32LE(region.id, 0);
  buffer.writeInt32LE(region.active, 4);

  // these two does not count
  buffer.writeFloatLE(0, 8);  // political capital
  buffer.writeFloatLE(0, 12);  // funds

  var offset = 12;
  var scores = ['economy', 'environment', 'co2-emission', 
      'air-pollution', 'water-pollution', 'land-pollution',
      'gross-domestic-product', 'income-equality', 'purchasing-power',
      'technology', 'green-sentiment', 'donations'];

  // write in scores
  for (var i in scores) {
    var score = scores[i];
    buffer.writeFloatLE(region.scores[score], offset += 4);
  }

  for (var i = 0; i < calcCycles; i++)
    buffer.writeFloatLE(region.economy_bars[i], offset += 4);

  for (var i = 0; i < calcCycles; i++)
    buffer.writeFloatLE(region.environ_bars[i], offset += 4);

  // var numNodes = region.history.length;
  buffer.writeInt32LE(numNodes, offset += 4);   // write in num of nodes in history

  offset += 4;
  // write in history
  for (var i = 0; i < numNodes; i++) {
    var node = region.history[i];
    var key = pad(8, node.key, ' ');
    buffer.writeInt8(8, offset);
    buffer.write(key, offset + 1);
    buffer.writeFloatLE(node.time, offset + 9);
    offset += 13;
  }
  writer.write(buffer);
}

function writeHeader(writer, info) {
  var header = new Buffer(36);

  // write header
  header.writeUInt32LE(magic, 0);
  header.writeFloatLE(info.time, 4);
  header.writeFloatLE(info.expansionPnts, 8);
  header.writeUInt32LE(info.calcCycles, 12);
  header.writeDoubleLE(info.political_capital, 16);
  header.writeDoubleLE(info.funds, 24);
  header.writeInt32LE(info.region_counts, 32);
  // console.log(header);
  writer.write(header);
  return header;
}


function serialize(filename, info) {
  calcCycles = info.calcCycles;
  var writer = fs.createWriteStream(filename);
  writeHeader(writer, info);

  for (var i = 0; i < info.region_counts; i++) {
    writeRegion(writer, info.regions[i]);
  }

}

// serialize('test.dat', info);
exports.serialize = serialize;
