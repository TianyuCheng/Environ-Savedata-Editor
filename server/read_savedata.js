#!/usr/bin/env node

var fs = require('fs');

function readRegionInfo(data, info, offset) {
  var region_info = {};
  var _offset = offset;
  region_info['region_id'] = data.readInt32LE(_offset += 4);
  region_info['active'] = Boolean(data.readInt32LE(_offset += 4));
  region_info['economy_bars'] = new Array();
  region_info['environ_bars'] = new Array();
  region_info['history'] = {};

  // _offset -= 4;
  // scores
  region_info['FUNDS']    = data.readFloatLE(_offset += 4);
  region_info['PC']       = data.readFloatLE(_offset += 4);
  region_info['EC']       = data.readFloatLE(_offset += 4);
  region_info['EN']       = data.readFloatLE(_offset += 4);
  region_info['CO2']      = data.readFloatLE(_offset += 4);
  region_info['AP']       = data.readFloatLE(_offset += 4);
  region_info['WP']       = data.readFloatLE(_offset += 4);
  region_info['LP']       = data.readFloatLE(_offset += 4);
  region_info['GDP']      = data.readFloatLE(_offset += 4);
  region_info['EQ']       = data.readFloatLE(_offset += 4);
  region_info['PP']       = data.readFloatLE(_offset += 4);
  region_info['TECH']     = data.readFloatLE(_offset += 4);
  region_info['GREEN']    = data.readFloatLE(_offset += 4);
  region_info['DONATION'] = data.readFloatLE(_offset += 4);
  
  // read economy bars
  for (var i = 0; i < info.calcCycles; i++) 
    region_info.economy_bars.push(data.readFloatLE(_offset += 4));

  // read economy bars
  for (var i = 0; i < info.calcCycles; i++) 
    region_info.environ_bars.push(data.readFloatLE(_offset += 4));

  // // read history 
  var num_nodes_in_history = data.readInt32LE(_offset += 4);
  // console.log (num_nodes_in_history);
  for (var i = 0; i < num_nodes_in_history; i++) {
    _offset += 1; // skip string length
    var node_key = data.toString('utf-8', _offset, _offset + 8); 
    var timestamp = data.readFloatLE(_offset += 8);
    _offset += 4;
    region_info.history[timestamp] = node_key;
  }
  info.regions.push(region_info);
  return _offset;
}

function readSaveData (req, res, filename, mappings, callback) {

  // console.log (filename);
  // create a read stream
  var reader = fs.createReadStream(filename);

  reader.on('data', function (data) {
    // console.log(data);
    var info = {};
    info['magic'] = data.readInt32LE(0);
    info['time'] = data.readFloatLE(4);
    info['expansionPnts'] = data.readFloatLE(8);
    info['calcCycles'] = data.readInt32LE(12);
    info['political_capital'] = data.readDoubleLE(16);
    info['funds'] = data.readDoubleLE(24);
    info['region_counts'] = data.readInt32LE(32);
    info['regions'] = new Array();

    var offset = 32;
    for (var i = 0; i < info.region_counts; i++) {
      offset = readRegionInfo(data, info, offset);
    }
    // console.log(info);

    if (callback != null) callback(filename);
    return res.render('savedata', {
      title : 'Environ',
      info : info,
      mappings : mappings
    });
  });
}

exports.read_savedata = readSaveData;
// readSaveData(null, null, "savedata.dat", null, null);
