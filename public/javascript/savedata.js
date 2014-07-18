(function ( $ ) {

  var bases_dict = null;
  var events_dict = null;
  var upgrades_dict = null;;

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
          icon.attr('src', '/images/icons/cross-icon.png');
        }
        else {
          checkbox.prop('checked', true);
          icon.attr('src', '/images/icons/tick-icon.png');
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
  $.fn.selectify = function (nodes_dict) {

    var info = nodes_dict; 
    var that = $(this);
    that.attr('style', 'width: 200px');

    // check if it is first time
    if (bases_dict == null)
    {
      bases_dict = info.bases_dict;
      events_dict = info.events_dict;
      upgrades_dict = info.upgrades_dict;
    }

    // feed with optgroups, starting with bases
    var bases_group = $('<optgroup label="Base"></optgroup>');
    for (var key in bases_dict)
    {
      bases_group.append($('<option value="' + key+  '">' + bases_dict[key] + '</option>'));
    }
    that.append(bases_group);

    // events
    var events_group = $('<optgroup label="Events"></optgroup>');
    for (var key in events_dict)
    {
      events_group.append($('<option value="' + key+  '">' + events_dict[key] + '</option>'));
    }
    that.append(events_group);

    // upgrades
    var upgrades_group = $('<optgroup label="Upgrades"></optgroup>');
    for (var key in upgrades_dict)
    {
      upgrades_group.append($('<option value="' + key+  '">' + upgrades_dict[key] + '</option>'));
    }
    that.append(upgrades_group);
   
    // process on each one
    that.each(function() {
      var node_key = $(this).parents("tr").find(".node-key");
      // console.log(node_key.text());
      // console.log($(this).find('option[value="' + node_key.text() + '"]'));
      var option = $(this).find('option[value="' + node_key.text() + '"]');
      option.prop("selected", true);

      // bind selection
      $(this).change(function() {
        node_key.text($(this).val());
      });
    });
  }

  // show hide menu in regions
  $.fn.menuify = function (mappings) {
    // process each one
    $(this).each(function() {
      var menu_buttons = $(this).find(".menu-option");
      var toggler = $(this).find(".menu-toggle");
      var show = true;

      toggler.css("cursor", "pointer");
      toggler.click(function(){
        show = !show;
        var li = menu_buttons.parents("li");
        var table = $(this).parents(".region-info").find("[class^=table-]");
        if (show)
        {
            li.addClass("pure-menu-selected");
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

      var base_table = $(this).find(".table-bases");
      var upgrades_table = $(this).find(".table-upgrades");
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
        if (record != null) {
          // change status and icon
          var checkbox = record.find(".status").find("input");
          if (_status == "+") {
            checkbox.prop("checked", true);
            checkbox.trigger("change");
          }
          else {
            checkbox.prop("checked", false);
            checkbox.trigger("change");
          }
        }
        //

      }

    });

  }

  // for update
  $.fn.reHistorify = function () {
    // process on each region
    $(this).each(function() {

      // find the tables of this region
      var bases_table = $(this).find(".table-bases");
      var upgrades_table = $(this).find(".table-upgrades");
      var events_table = $(this).find(".table-events");

      // time in increasing order
      // for (var timestamp in history) {
      $(this).find(".table-history tbody tr").each(function () {
        _status = $(this).find(".toggleable input").prop("checked");
        _key = $(this).find(".node-key").text();
        _type = _key.substring(0, 1);

        // console.log(_key + ": " + _status);
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
        $(this).find("select").change(function() {
          $(this).parents(".region-info").reHistorify();
        });

        // binding for checkbox
        $(this).find(".toggleable img").click(function(e) {
          var icon = $(this);
          var checkbox = $(this).parent().find("input");
          var isChecked = checkbox.prop("checked");
          if (isChecked) {
            checkbox.prop('checked', false);
            icon.attr('src', '/images/icons/cross-icon.png');
          }
          else {
            checkbox.prop('checked', true);
            icon.attr('src', '/images/icons/tick-icon.png');
          }
          $(this).parents(".region-info").reHistorify();
          e.stopPropagation();
        });
  }

  $.fn.addHistory = function () {

    $(this).each(function () {
      var add_icon = $(this);
      var region_div = $(this).parents(".region-info");
      var toggleable = region_div.find(".toggleable");
      var table = $(this).parents(".table-history").find("table tbody");

      // set css
      add_icon.css("cursor", "pointer");

      var NewHistoryRecord = function(key) {
        var time = parseInt($("#gametime").val());
        var new_record = $('<tr></tr>');
        new_record.append($('<td><input type="number" min="0" step="0.1" class="scores" value="' + time + '"/></td>'));
        new_record.append($('<td class="toggleable"><input type="checkbox" checked/><img src="/images/icons/tick-icon.png"/></td>'));
        new_record.append($('<td><select class="node-options"></select></td>'));
        new_record.append($('<td><img src="/images/icons/minus-icon.png"/></td>'));

        new_record.sorted();
        new_record.find(".scores").scores();
        new_record.find(".toggleable").toggleable();
        new_record.find(".node-options").selectify();

        return new_record;
      }

      // click add history
      add_icon.click(function (e) {
        var record = NewHistoryRecord("");
        table.append(record);
      });

    });

  }
  // the end

}(jQuery));
