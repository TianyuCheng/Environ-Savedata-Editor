(function ( $ ) {

  // toggleable checkbox
  $.fn.toggleable = function () {
    // process on each one
    $(this).each(function() {
      icon = $(this).find("img");
      checkbox = $(this).find("input");
      checkbox.hide();
      icon.css({
        'display' : 'block',
        'margin-left' : 'auto',
        'margin-right' : 'auto'
      });

      $(this).click(function() {
        var _checkbox = $(this).find("input");
        var _icon = $(this).find("img");
        var isChecked = _checkbox.prop("checked");
        if (isChecked) {
          _checkbox.prop('checked', false);
          _icon.attr('src', '/images/icons/cross-icon.png');
        }
        else {
          _checkbox.prop('checked', true);
          _icon.attr('src', '/images/icons/tick-icon.png');
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
  $.fn.menuify = function () {
    // process each one
    $(this).each(function() {
      var menu_buttons = $(this).find(".menu-option");
      var toggler = $(this).find(".menu-toggle");
      var show = true;
      // console.log(menu_buttons);

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

    });

  }

}(jQuery));
