(function ( $ ) {

  var bases_dict = null;
  var events_dict = null;
  var upgrades_dict = null;
  var regions_bases = null;
  var regions_events = null;
  var upgrades_bases = null;
  var savefile = null;

  // toggleable checkbox
  $.fn.toggleable = function () {
    // process on each one
    $(this).each(function() {
      var icon = $(this).find("img");
      var checkbox = $(this).find("input");
      checkbox.hide();
      icon.css({
        'display' : 'block',
        'margin-left' : 'auto',
        'margin-right' : 'auto'
      });

      // link connection
      checkbox.change(function() {
        var isChecked = checkbox.prop("checked");
        if (isChecked) {
          icon.attr('src', '/images/icons/tick-icon.png');
        }
        else {
          icon.attr('src', '/images/icons/cross-icon.png');
        }
      });

      $(this).click(function() {
        var isChecked = checkbox.prop("checked");
        if (isChecked) {
          checkbox.prop('checked', false);
          checkbox.trigger("change");
        }
        else {
          checkbox.prop('checked', true);
          checkbox.trigger("change");
        }
      });
    
    });

  }
 
  // scores input box
  $.fn.scores = function () {
    // process on each one
    $(this).each(function() {
      input = $(this);
      input.attr('style', 'text-align: center');
    
      input.on({
        keypress : function (event) {

          if (event.which == 13) {
            event.preventDefault();
          }

          switch (event.keyCode) {
            case 13:  // enter
              $(this).blur();
              break;
            case 46:  // character '.'
              break;
            case 45:  // character '-'
              break;
            case 43:  // character '+'
              break;
            default:
              if (event.keyCode < 48 || event.keyCode > 58) 
                return false;
          }
        },
        blur : function(event) {
          // truncating to 2 decimal
          var val = parseFloat($(this).val()).toFixed(2);
          $(this).val(val);
        }

      });

    });

  }

  // option boxes
  $.fn.selectify = function () {

    var that = $(this);
    that.attr('style', 'width: 200px');

    $(this).each (function () {
      var region_id = parseInt($(this).parents(".region-info").attr("id").split("-")[1]);
      // feed with optgroups, starting with bases
      var bases_group = $('<optgroup label="Bases"></optgroup>');
      var bases = regions_bases[region_id];
      for (var index in bases)
      {
        var base = bases[index];
        bases_group.append($('<option value="' + base.key+  '">' + bases_dict[base.key] + '</option>'));
      }
      that.append(bases_group);

      // events
      var events_group = $('<optgroup label="Events"></optgroup>');
      var events = regions_events[region_id];
      for (var index in events)
      {
        var event = events[index];
        events_group.append($('<option value="' + event.key+  '">' + events_dict[event.key] + '</option>'));
      }
      that.append(events_group);

      // upgrades
      for (var index in bases)
      {
        var base_key = bases[index].key;
        var upgrades = bases_upgrades[base_key];
        var group = $('<optgroup label="' + bases_dict[base_key] + ' Upgrades"></optgroup>');
        for (var jindex in upgrades)
        {
          var upgrade = upgrades[jindex];
          group.append($('<option value="' + upgrade.key+  '">' + upgrades_dict[upgrade.key] + '</option>'));
        }
        that.append(group);
      }
     
      // process on each one
      that.each(function() {
        var node_key = $(this).parents("tr").find(".node-key");
        var option = $(this).find('option[value="' + node_key.text() + '"]');
        option.prop("selected", true);

        node_key.text($(this).val());
        // bind selection
        $(this).change(function() {
          node_key.text($(this).val());
        });
      }); // end of that each

    }); // end of each

  }

  // show hide menu in regions
  $.fn.menuify = function (mappings) {
    // process each one
    $(this).each(function() {
      var menu_buttons = $(this).find(".menu-option");
      var toggler = $(this).find(".menu-toggle");
      var show = true;

      var base_table = $(this).find(".table-bases");
      var upgrades_table = $(this).find(".table-upgrades");

      toggler.css("cursor", "pointer");
      toggler.click(function(){
        show = !show;
        var li = menu_buttons.parents("li");
        var table = $(this).parents(".region-info").find("[class^=table-]");
        if (show)
        {
            li.addClass("pure-menu-selected");
            table = table.not(".table-upgrades");
            table.slideDown();
        }
        else 
        {
            li.removeClass("pure-menu-selected");
            table.slideUp();
        }
      });

      menu_buttons.each(function() {
        // process each button
        var table = $(this).parents(".region-info").find($(this).attr("rel"));
        var li = $(this).parents("li");
        if (!li.hasClass("pure-menu-selected"))
          table.hide();

        $(this).click(function() {
          if (li.hasClass("pure-menu-selected"))
          {
            li.removeClass("pure-menu-selected");
            // table.slideUp();
            table.animate({
              "width" : "toggle",
              "height" : "toggle",
              "opacity" : 0
            }, 500);
          }
          else          
          {
            li.addClass("pure-menu-selected");
            // table.slideDown();
            table.animate({
              "width" : "toggle",
              "height" : "toggle",
              "opacity" : 1
            }, 500);
          }
        });

      });

      var upgrades_body = upgrades_table.find("tbody");
      var base_keys = base_table.find(".key");
      var upgrades_show = true;
      var last_selected = "";

      base_keys.each(function () {
        var key = $(this).text();
        var upgrades = mappings.bases_upgrades[key];
        var cell = $(this).parent().find(".title");
        cell.css("cursor", "pointer");

        cell.click(function() {
          // check upgrades status by key
          if (upgrades_show && last_selected == key) 
            upgrades_show = false;
          else 
            upgrades_show = true;

          last_selected = key;

          // show the upgrades table if not shown
          if (upgrades_show) {
            upgrades_table.show();
          }
          else 
          {
            upgrades_table.hide();
          }

          var rows = upgrades_body.find("tr");
          rows.removeClass("selected").show();
          for (var index in upgrades)
          {
            upgrades_body.find("." + upgrades[index].key).addClass("selected");
          }
          upgrades_body.find("tr").not(".selected").hide();

        });

      });

    });

  }

  $.fn.historify = function (regions, mappings) {
    // process on each region
    $(this).each(function() {
      var region_id = parseInt($(this).attr("id").split("-")[1]);
      var history = regions[region_id].history;

      // find the tables of this region
      var bases_table = $(this).find(".table-bases");
      var upgrades_table = $(this).find(".table-upgrades");
      var events_table = $(this).find(".table-events");
      var history_table = $(this).find(".table-history table tbody");

      // console.log (regions[region_id]);
      // time in increasing order
      for (var timestamp in history) {
        value = history[timestamp];
        _status = value.substring(0, 1);  // +/-
        _key = value.substring(1);        // B1, U1, E1, etc
        _type = _key.substring(0, 1);

        var record = null;
        switch (_type) {
          case 'B':
            record = bases_table.find("." + _key);
            break;
          case 'U':
            record = upgrades_table.find("." + _key);
            break;
          case 'E':
            record = events_table.find("." + _key);
            break;
          
          default:
        }
        // add record into history
        var history_record = NewHistoryRecord(_key, timestamp);
        history_table.append(history_record);
        // manually set key due to the event sequence
        history_record.find(".node-options").selectify();
        
        if (record != null) {
          // change status and icon
          var checkbox = record.find(".status").find("input");
          if (_status == "+") {
            checkbox.prop("checked", true);
            checkbox.trigger("change");
            // manually set prop for record
            history_record.find("input").prop("checked", true);
          }
          else {
            checkbox.prop("checked", false);
            checkbox.trigger("change");
            // manually set prop for record
            history_record.find("input").prop("checked", false);
          }
        }
        // $(this).parents(".region-info").reHistorify();
      }

    });

  }

  // for update
  $.fn.reHistorify = function () {
    // console.log("reHistorify");
    // process on each region
    $(this).each(function() {

      // find the tables of this region
      var bases_table = $(this).find(".table-bases");
      var upgrades_table = $(this).find(".table-upgrades");
      var events_table = $(this).find(".table-events");

      bases_table.find("tr .toggleable input").prop("checked", false).trigger("change");
      upgrades_table.find("tr .toggleable input").prop("checked", false).trigger("change");
      events_table.find("tr .toggleable input").prop("checked", false).trigger("change");

      // time in increasing order
      $(this).find(".table-history tbody tr").each(function () {
        // _status = $(this).find(".toggleable input").prop("checked");
        _status = $(this).find(".toggleable input").is(":checked");
        _key = $(this).find(".node-key").text();
        _type = _key.substring(0, 1);

        // console.log(_key + "|" + _status + "|" + _type);
        var record = null;
        switch (_type) {
          case 'B':
            record = bases_table.find("." + _key);
            break;
          case 'U':
            record = upgrades_table.find("." + _key);
            break;
          case 'E':
            record = events_table.find("." + _key);
            break;

          default:
        }
        if (record != null) {
          // change status and icon
          var checkbox = record.find(".status").find("input");
          if (_status) {
            checkbox.prop("checked", true);
            checkbox.trigger("change");
          }
          else {
            checkbox.prop("checked", false);
            checkbox.trigger("change");
          }
        }
      });

    });

  }

  $.fn.sorted = function () {
  
    // timestamp as trigger to sort history
    $(this).find(".scores").blur(function() {

      // find parent for easy row moving
      var myself = $(this).parents("tr");
      
      // try to move up in table
      var my_prev = myself.prev();
      if (my_prev.length > 0) 
      {
        var my_score = parseFloat(myself.find("input.scores").val());
        var my_prev_score = parseFloat(my_prev.find("input.scores").val());
        // console.log(my_prev.prev().prev().length);
        while (my_score < my_prev_score)
        {
          myself.insertBefore(my_prev);
          my_prev = myself.prev();
          // console.log("move up " + my_score + " < " + my_prev_score);

          if (my_prev.length == 0) break;
          my_score = parseFloat(myself.find("input.scores").val());
          my_prev_score = parseFloat(my_prev.find("input.scores").val());
        }
      }

      // try to move down in table
      var my_next = myself.next();
      if (my_next.length > 0) 
      {
        var my_score = parseFloat(myself.find("input.scores").val());
        var my_next_score = parseFloat(my_next.find("input.scores").val());
        // console.log(my_next.next().next().length);
        while (my_score > my_next_score)
        {
          myself.insertAfter(my_next);
          my_next = myself.next();
          // console.log("move down " + my_score + " > " + my_next_score);

          if (my_next.length == 0) break;
          my_score = parseFloat(myself.find("input.scores").val());
          my_next_score = parseFloat(my_next.find("input.scores").val());
        }
      }
      $(this).parents(".region-info").reHistorify();
    });

    // binding for select change
    var select = $(this).find("select");
    select.unbind("change");
    select.change(function() {
      // manually set key due to the event sequence
      $(this).parents("tr").find(".node-key").text($(this).val());
      $(this).parents(".region-info").reHistorify();
    });

    // binding for checkbox
    var toggler = $(this).find(".toggleable");
    toggler.unbind("click");

    // manually set key due to the event sequence
    toggler.click(function(e) {
      var icon = $(this);
      var checkbox = $(this).find("input");
      var isChecked = checkbox.prop("checked");
      console.log(isChecked);
      if (isChecked)
        checkbox.prop('checked', false);
      else
        checkbox.prop('checked', true);
      checkbox.trigger("change");
      $(this).parents(".region-info").reHistorify();
      e.stopPropagation();
    });
  }

  var NewHistoryRecord = function(key, _time, _stats) {
    var time = _time || parseInt($("#gametime").val());
    var stats = _stats;
    if (_stats == null)
       stats = true;

    var new_record = $('<tr></tr>');
    new_record.append($('<td><input type="number" min="0" step="0.1" class="scores" value="' + time + '"/></td>'));
    if (stats)
      new_record.append($('<td class="toggleable"><input type="checkbox" checked/><img src="/images/icons/tick-icon.png"/></td>'));
    else 
      new_record.append($('<td class="toggleable"><input type="checkbox"/><img src="/images/icons/cross-icon.png"/></td>'));
    new_record.append($('<td class="hide"><span class="node-key">' +  key + '</span></td>'));
    new_record.append($('<td><select class="node-options"></select></td>'));
    new_record.append($('<td class="delete-history"><img src="/images/icons/minus-icon.png"/></td>'));

    new_record.find(".scores").scores();
    new_record.find(".toggleable").toggleable();
    new_record.sorted();

    // manually set key due to the event sequence
    new_record.find(".toggleable input").prop("checked", stats);
    new_record.find(".delete-history").find("img").deletable();
    return new_record;
  }

  $.fn.deletable = function () {
      $(this).each(function() {
        $(this).css("cursor", "pointer");
        $(this).click(function () {
          var record = $(this).parents("tr");
          var region = record.parents(".region-info");
          record.fadeOut(500, function() {
            record.remove();
            region.reHistorify();
          });
        
        });
      });

  }

  // core function for saving data into json and passing to backend
  $.fn.save = function () {
    console.log("exporting json");
    var save_info = {
      'time' : parseFloat($("#gametime").val()),
      'political_capital' : parseFloat($("#political_capital").val()),
      'funds' : parseFloat($("#funds").val()),
      'region_counts' : info.region_counts,
      'regions' : []
    };

    var regions = savefile.regions;
    for (var region_id in regions)
    {
      var region = regions[region_id];
      var scores_list = ["economy", "environment", "technology", "green-sentiment", "gross-domestic-product", 
                         "purchasing-power", "income-equality", "donations", "co2-emission", "air-pollution", 
                         "water-pollution", "land-pollution"];
      // set up scores
      var scores = {}
      for (var i in scores_list)
        scores[scores_list[i]] = parseFloat($("#region-" + region_id + "-" + scores_list[i]).val());

      // set up history
      var history_records = $("#region-" + region_id).find(".table-history tbody tr");
      var history = new Array();
      history_records.each(function () {
        var record = $(this);
        var timestamp = parseFloat(record.find(".scores").val());
        var stats = record.find(".toggleable input").prop("checked");
        var key = record.find(".node-key").text();
        if (stats) stats = "+"; else stats = "-";

        history.push({
          "key" : stats + key,
          "time" : timestamp
        });
      });

      var region_info = {
        'id' : parseInt(region_id),
        'active' : $("#region-" + region_id + "-status").prop("checked"),
        'scores' : scores,
        'history' : history
      };

      save_info['regions'][region_id] = region_info;
    }

    // prepare hints
    var hint = $("#status-hint");

    // console.log(save_info);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(save_info),
      contentType: 'application/json',
      url: '/savedata/save',						
      success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));

        // show hints
        hint.removeClass("hide");
        hint.addClass("status-success");
        hint.text("Successfully saved!");
        hint.fadeIn(500, function() {
          setTimeout(function () {
            hint.fadeOut(500, function () {
              hint.removeClass("status-success").addClass("hide");
            });
          }, 2000);
        });
      },
      error: function(data) {
        // show hints
        hint.removeClass("hide");
        hint.addClass("status-error");
        hint.text("An error occurred while saving!");
        hint.fadeIn(500, function() {
          setTimeout(function () {
            hint.fadeOut(500, function () {
              hint.removeClass("status-success").addClass("hide");
            });
          }, 2000);
        });
      }
    });

    return save_info;
  }


  $.fn._start = function (info, nodes_dict) {

    // retain global copies
    savefile = info;
    bases_dict = nodes_dict.bases_dict;
    events_dict = nodes_dict.events_dict;
    upgrades_dict = nodes_dict.upgrades_dict;
    regions_bases = nodes_dict.regions_bases;
    regions_events = nodes_dict.regions_events;
    bases_upgrades = nodes_dict.bases_upgrades;
  }

  $.fn._end = function () {
  
    // binding for checkbox
    var status_handles = $(document).find("div[class^=table-]").not(".table-history").find(".toggleable");
    status_handles.unbind("click");
    status_handles.click(function(e) {
      var checkbox = $(this).parent().find("input");
      var isChecked = checkbox.prop("checked");
      if (isChecked) {
        checkbox.prop('checked', false);
        checkbox.trigger("change");
      }
      else {
        checkbox.prop('checked', true);
        checkbox.trigger("change");
      }
      var key = $(this).parents("tr").find(".key").text();
      var stats = !isChecked;
      var new_record = NewHistoryRecord(key, null, stats);
      var history_table = $(this).parents(".region-info").find(".table-history table tbody");
      history_table.append(new_record);
      new_record.find(".node-options").selectify();
      new_record.parents(".region-info").reHistorify();
    });


    $(".add-history").each(function () {
      var add_icon = $(this);
      var region_div = $(this).parents(".region-info");
      var toggleable = region_div.find(".toggleable");
      var table = $(this).parents(".table-history").find("table tbody");

      // set css
      add_icon.css("cursor", "pointer");

      // click add history
      add_icon.click(function (e) {
        var new_record = NewHistoryRecord("", null);
        table.append(new_record);
        new_record.find(".node-options").selectify();
        $(this).parents(".region-info").reHistorify();
      });

    });

    $("#save").click(function () {
      $(this).save();
    });
  }

}(jQuery));
