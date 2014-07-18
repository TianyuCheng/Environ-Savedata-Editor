(function ( $ ) {

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
        }

      });

    });

  }

  // option boxes
  $.fn.selectify = function (nodes_dict) {

    var info = nodes_dict; 
    var that = $(this);
    that.attr('style', 'width: 200px');

    // feed with optgroups, starting with bases
    var bases_group = $('<optgroup label="Base"></optgroup>');
    for (var key in info.bases_dict)
    {
      bases_group.append($('<option value="' + key+  '">' + info.bases_dict[key] + '</option>'));
    }
    that.append(bases_group);

    // events
    var events_group = $('<optgroup label="Events"></optgroup>');
    for (var key in info.events_dict)
    {
      events_group.append($('<option value="' + key+  '">' + info.events_dict[key] + '</option>'));
    }
    that.append(events_group);

    // upgrades
    var upgrades_group = $('<optgroup label="Upgrades"></optgroup>');
    for (var key in info.upgrades_dict)
    {
      upgrades_group.append($('<option value="' + key+  '">' + info.upgrades_dict[key] + '</option>'));
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
      var upgrades_table = $(this).find(".table-upgrades tbody");
      var base_keys = base_table.find(".key");
      base_keys.each(function () {
        var key = $(this).text();
        var upgrades = mappings.bases_upgrades[key];
        var cell = $(this).parent();
        cell.css("cursor", "pointer");

        cell.click(function() {
          upgrades_table.find("tr").hide();
          // upgrades_table.find("tr").slideUp();
          for (var index in upgrades)
          {
            upgrades_table.find("." + upgrades[index].key).show();
            // upgrades_table.find("." + upgrades[index].key).slideDown();
          }
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
  // the end

}(jQuery));
