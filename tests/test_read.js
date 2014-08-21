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
  region_info['FUNDS_COST'] = data.readFloatLE(_offset += 4);
  region_info['PC_COST']  = data.readFloatLE(_offset += 4);

  region_info['EC']       = data.readFloatLE(_offset += 4);
  region_info['EN']       = data.readFloatLE(_offset += 4);
  region_info['TE']       = data.readFloatLE(_offset += 4);
  region_info['GS']       = data.readFloatLE(_offset += 4);
  region_info['GG']       = data.readFloatLE(_offset += 4);
  region_info['SE']       = data.readFloatLE(_offset += 4);
  region_info['PO']       = data.readFloatLE(_offset += 4);
  region_info['BT']       = data.readFloatLE(_offset += 4);

  console.log (region_info);
  
  // read economy bars
  for (var i = 0; i < info.calcCycles; i++) 
    region_info.economy_bars.push(data.readFloatLE(_offset += 4));
  console.log (region_info.economy_bars);

  // read economy bars
  for (var i = 0; i < info.calcCycles; i++) 
    region_info.environ_bars.push(data.readFloatLE(_offset += 4));
  console.log (region_info.environ_bars);


  // // read history 
  var num_nodes_in_history = data.readInt32LE(_offset += 4);
  for (var i = 0; i < num_nodes_in_history; i++) {
    var length = data.readInt8(_offset + 4);
    var node_key = data.toString('utf-8', _offset + 5, _offset + 13); 
    var timestamp = data.readFloatLE(_offset + 13);
    _offset += 13;
    region_info.history[timestamp] = node_key;
  }
  console.log (region_info.history)
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
    console.log (info);
    for (var i = 0; i < info.region_counts; i++) {
      offset = readRegionInfo(data, info, offset);
    }
    // console.log(info);

    // if (callback != null) callback(filename);
    // return res.render('savedata', {
    //   title : 'Environ',
    //   info : info,
    //   mappings : mappings
    // });
  });
}

// readSaveData(null, null, './savedata.dat');
readSaveData(null, null, '/Users/tc26752/Desktop/savedata.dat');
