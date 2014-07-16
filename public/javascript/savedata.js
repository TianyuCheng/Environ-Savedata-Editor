(function ( $ ) {
 
$.fn.rich = function(info) {

 var nodes_dict = info 

  // ====== begin ======
  jQuery('.scores').on({

    keypress : function (event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      if (event.keyCode == 13) // enter
  {
    $(this).blur();
  }
      else if (event.keyCode == 46) // .
  {
    // pass
  }
      else if (event.keyCode < 48 || event.keyCode > 58)
  {
    return false;
  }
    },

  focus : function () {
    // $(this).selText();
  } 

  });

  jQuery('.toggleable').on({

    click : function()
  {
    // true/false
    if ($(this).text() == 'true')
  {
    $(this).text('false');
  }
    else if ($(this).text == 'false')
  {
    $(this).text('true');
  }

  // activate/deactivate
    else if ($(this).text() == 'activate')
  {
    $(this).text('deactivate');
  }
    else 
  {
    $(this).text('activate');
  }
  }

  });


  jQuery('.node-key').on({

    blur : function () {
      var key = $(this).text();
      var obj = $(this).parent().parent().children("td").find('.node-title');
      // console.log(obj);
      obj.text(nodes_dict[key]);
    } ,

    keypress : function (event) {
      if (event.which == 13) {
        event.preventDefault();
      }
      if (event.keyCode == 13) // enter
        $(this).blur();
    }

  });
  // ===== end =======

};
}(jQuery));

