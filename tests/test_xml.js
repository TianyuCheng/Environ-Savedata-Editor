#!/usr/bin/env node

var fs = require('fs');
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
var async = require('async');

var mappings = {};
var regions_dict = {};
var events_dict = {};
var bases_dict = {};
var upgrades_dict = {};
var regions_bases = {};
var regions_events = {};
var bases_upgrades = {};
var nodes_dict = {};

// var path = "server/"
var path = ""

async.parallel([
    function (callback) {
      fs.readFile(path + 'data/xmls/regions.xml', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
        parseString(data, function (err, info) {
          // console.dir(info.regions);
          for (var index in info.regions.region) {
            var region = info.regions.region[index];
            // console.log (region.bases);
            regions_dict[region.id] = region.name;

            // bases
            var bases_list = [];
            var bases = region.bases[0]['base'];
            for (var bases_index in bases) {
              var base = bases[bases_index];
              // console.log (base);
              bases_list.push({ key : base['_'], 
                active :  base['$'].active, 
                x : base['$'].x, 
                y : base['$'].y });
            }
            regions_bases[region.id] = bases_list;

            // events
            var events_list = [];
            var events = region.events[0]['event'];
            for (var events_index in events) {
              var event = events[events_index];
              // console.log (event);
              events_list.push({ key : event['_'], 
                x : event['$'].x, 
                y : event['$'].y });
            }
            regions_events[region.id] = events_list;

          }
          callback(null, regions_dict);
        }); 
      });
    }, // end of read regions

    function (callback) {
      fs.readFile(path + 'data/xmls/bases.xml', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
        parseString(data, function (err, info) {
          // getting bases
          for (var index in info.bases.base) {
            var base = info.bases.base[index];
            // console.log (base);
            bases_dict[base.key] = base.title;

            // upgrades
            var upgrades_list = [];
            var upgrades = base.upgrades[0]['upgrade'];
            for (var upgrades_index in upgrades) {
              var upgrade = upgrades[upgrades_index];
              // console.log (upgrade);
              upgrades_list.push({ key : upgrade['_'], 
                state : upgrade['$'].state });
            }
            bases_upgrades[base.key] = upgrades_list;

          }

          // update nodes dict
          for (var key in bases_dict)
          nodes_dict[key] = bases_dict[key];

          callback(null, bases_dict);
        });
      });
    }, // end of read regions
  
    function (callback) {
      fs.readFile(path + 'data/xmls/upgrades.xml', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
        parseString(data, function (err, info) {
          // getting upgrades
          for (var index in info.upgrades.upgrade) {
            var upgrade = info.upgrades.upgrade[index];
            // console.log (upgrade);
            upgrades_dict[upgrade.key] = upgrade.title;
          }

          // update nodes dict
          for (var key in upgrades_dict)
          nodes_dict[key] = upgrades_dict[key];

          callback(null, upgrades_dict);
        });
      });
    }, // end of read upgrades

    function (callback) {
      fs.readFile(path + 'data/xmls/events.xml', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
        parseString(data, function (err, info) {
          // getting events
          for (var index in info.events.event) {
            var event = info.events.event[index];
            // console.log (event);
            events_dict[event.key] = event.title;
          }

          // update nodes dict
          for (var key in events_dict)
          nodes_dict[key] = events_dict[key];

          callback(null, events_dict);
        });
      });
    } // end of read events
  ], 
  function (err, results) {
    exports.mappings = {
      'regions_dict' : regions_dict,
      'bases_dict' : bases_dict,
      'upgrades_dict' : upgrades_dict,
      'events_dict' : events_dict,
      'nodes_dict' : nodes_dict,
      'regions_bases' : regions_bases,
      'regions_events' : regions_events,
      'bases_upgrades' : bases_upgrades
    };
    // console.log(exports.mappings);
  }
);
