/**
 * Makes superfish menu more accessible for keyboard and screen reader users.
 */

(function ($, Drupal, once) {
    
  Drupal.behaviors.superfisharia = {
    attach: function (context) {
        // get all superfish menu instances
        $(once('superfisharia-menu', '.sf-menu', context))
          .each(ariaParseMenu);
    }
  };
  
  function ariaParseMenu(value, index) {
      // parse menu items per menu
      var menu = $(this);
      var menu_id = $(menu).attr('id');
      var menuTarget = $('#'+menu_id);
      $(menuTarget).children('.menuparent').each(ariaMenuItem);
  }
  
  function ariaMenuItem(value, index) {
      if ($(index).hasClass('has-submenu') === false) {
          $(index).addClass('has-submenu');
      }
      $(index).children('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').attr('aria-expanded', 'false').attr('role', 'menuitem');
      $(index).children('a, span').not("[role='menuitem']").attr('role', 'menuitem');
      var childMenu = $(index).children('ul[role="menu"]');
      var menuLabel = $(index).children('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').text();
      $(childMenu).attr('aria-label', menuLabel);
      $(index).children('ul[role="menu"], .menuparent').each(ariaMenuItem);
      
      $(index)
      .mouseenter(function() {
          $(index).find('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').attr('aria-expanded', 'true').addClass('open');
      })
      .mouseleave(function() {
          $(index).find('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').attr('aria-expanded', 'false').removeClass('open');
      })
      .focusin(function() {
          $(index).find('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').attr('aria-expanded', 'true').addClass('open');
      })
      .focusout(function() {
          $(index).find('a.sf-depth-1.menuparent, span.sf-depth-1.menuparent').attr('aria-expanded', 'false').removeClass('open');
      });
  }
  
})(jQuery, Drupal, once);