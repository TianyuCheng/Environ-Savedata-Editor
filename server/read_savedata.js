#!/usr/bin/env node

var fs = require('fs');
var packet = require('packet');

var parser = packet.createParser();
parser.packet("header", "l32 => magic, \
                         b32f => time, \
                         b64f => political_capital, \
                         b64f => funds, \
                         l32 => region_counts");

parser.packet("region_info", "l32 => region_id, \
                              b8 => active, \
                              b32f => FUNDS, b32f => PC, \
                              b32f => EC, b32f => EN, \
                              b32f => CO2, b32f => AP, b32f => WP, b32f => LP, \
                              b32f => GDP, b32f => EQ, b32f => PP, \
                              b32f => TECH, b32f => GREEN, \
                              b32f => DONATION,\
                              l32 => num_nodes_in_history");

parser.packet("record", "b8[10]z|utf8() => key, b32f => activated_time");

function readHistoryRecord(region, parser, callback) {
  // extract history record
  parser.extract("record", function (record) {
    var key = record.key.replace(/\s+/g, ""); // strip white spaces
    var time = record.activated_time.toFixed(2) + "";
    region.history[time] = key;
    callback();
  });
}

function readRegionInfo(header, parser, callback) {
  // extract regional info
  parser.extract("region_info", function (region_info) {
    // console.log(region_info);
    region_info['history'] = {};
    // history counter
    var count = 0;
    var readNextRecord = function () {
      count++;
      if (count < region_info.num_nodes_in_history) {
        readHistoryRecord(region_info, parser, readNextRecord);
      }
      else {
        // call callback to go to next region if there is no records left
        header.regions.push(region_info);
        callback(); 
      }
    }
    // call readHistory 
    if (region_info.num_nodes_in_history <= 0) {
      header.regions.push(region_info);
      callback();
    }
    else {
      readHistoryRecord(region_info, parser, readNextRecord);
    }
  }); // end of extract header
}

function readSaveData (req, res, filename, mappings)
{
  console.log (filename);
  // create a read stream
  var reader = fs.createReadStream(filename);

  reader.on('data', function (data) {
    // extract header
    parser.extract("header", function (header) {
      // console.log(header);
      header['regions'] = new Array();
      // region counter
      var count = 0;
      // callback function
      var readNextRegion = function () {
        count++;
        if (count < header.region_counts)
          readRegionInfo(header, parser, readNextRegion);
        else {
          console.log (header);
          return res.render('savedata', {
            title : 'Environ',
            info : header,
            mappings : mappings
          });
        }
      };
      // call region parser
      readRegionInfo(header, parser, readNextRegion);
    }); // end of extract header

    parser.parse(data);
  });
}

exports.read_savedata = readSaveData;
