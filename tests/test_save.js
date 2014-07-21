#!/usr/bin/env node

var fs = require('fs');

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, string + padding, padding)
}

var info = {"time":95.94,"political_capital":14889.94,"funds":2222.18,"region_counts":7,
            "regions":[
            {"id":0,"active":false,
              "scores":{"economy":15.44,"environment":-6.88,"technology":2.8,"green-sentiment":3.33,"gross-domestic-product":0,"purchasing-power":0,"income-equality":0,"donations":0,"co2-emission":0,"air-pollution":0,"water-pollution":0,"land-pollution":0},
              "history":[]},
            {"id":1,"active":true,
              "scores":{"economy":21.37,"environment":-25.36,"technology":7.1,"green-sentiment":0,"gross-domestic-product":0,"purchasing-power":1.2,"income-equality":0,"donations":0,"co2-emission":2.8,"air-pollution":0,"water-pollution":0,"land-pollution":0},
              "history":[{"key":"+B7","time":30.44},{"key":"+B5","time":35.66},{"key":"+U38","time":36.55},{"key":"+U40","time":37.61},{"key":"+U42","time":38.75},{"key":"+B6","time":46.23},{"key":"+U41","time":47.88},{"key":"+U43","time":49.59},{"key":"+B4","time":55.12},{"key":"+U31","time":55.99}]},
            {"id":2,"active":false,
              "scores":{"economy":10.21,"environment":14.64,"technology":0,"green-sentiment":0,"gross-domestic-product":0,"purchasing-power":0,"income-equality":0,"donations":0,"co2-emission":0,"air-pollution":0,"water-pollution":0,"land-pollution":0},
              "history":[{"key":"+E6","time":3},{"key":"+E4","time":30}]},
            {"id":3,"active":true,
              "scores":{"economy":10.34,"environment":10.54,"technology":9.7,"green-sentiment":0,"gross-domestic-product":0,"purchasing-power":-3.8,"income-equality":0,"donations":0,"co2-emission":-16.1,"air-pollution":-10,"water-pollution":0,"land-pollution":0},
              "history":[{"key":"+B1","time":8.03},{"key":"+U1","time":9.53},{"key":"+U3","time":10.54},{"key":"+B2","time":14.02},{"key":"+U11","time":15.04},{"key":"+U13","time":16.18},{"key":"+B4","time":20.16},{"key":"+U30","time":21.51},{"key":"+U32","time":22.61},{"key":"+U31","time":23.96},{"key":"+E21","time":57}]},
            {"id":4,"active":true,
              "scores":{"economy":-0.54,"environment":-5.36,"technology":0,"green-sentiment":20,"gross-domestic-product":0,"purchasing-power":0,"income-equality":0,"donations":0,"co2-emission":0,"air-pollution":0,"water-pollution":15,"land-pollution":10},
              "history":[{"key":"+E10","time":84}]},
            {"id":5,"active":false,
              "scores":{"economy":15.06,"environment":-0.36,"technology":0,"green-sentiment":0,"gross-domestic-product":0,"purchasing-power":0,"income-equality":0,"donations":0,"co2-emission":0,"air-pollution":0,"water-pollution":0,"land-pollution":0},
              "history":[]},
            {"id":6,"active":true,
              "scores":{"economy":36.21,"environment":-35.36,"technology":0,"green-sentiment":0,"gross-domestic-product":0,"purchasing-power":0,"income-equality":0,"donations":0,"co2-emission":0,"air-pollution":0,"water-pollution":0,"land-pollution":0},
              "history":[{"key":"+B2","time":62.3},{"key":"+B5","time":66.35},{"key":"+B1","time":69.83},{"key":"+B6","time":74.53},{"key":"+B4","time":78.14}]}]} 

var magic = 1989127302;

function writeRegion(writer, region) {
  // console.log(region);

  var size = 4 + 4 + 14 * 4 + 4;
  var buffer = new Buffer(size);
  buffer.writeInt32LE(region.id, 0);
  buffer.writeInt32LE(region.active, 4);

  // these two does not count
  buffer.writeFloatLE(0, 8);  // political capital
  buffer.writeFloatLE(0, 12);  // funds

  var offset = 16;
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
  size = numNodes * (4 + 9);
  buffer = new Buffer(size);
  offset = 0;
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

serialize('test.dat', info);
