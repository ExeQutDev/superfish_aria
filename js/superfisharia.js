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
        var menuTarget = $('#' + menu_id);
        $(menuTarget).children('li').each(ariaMenuItem);
    }

    function ariaParseSubMenu(value, index) {
        $(index).children('li').each(ariaMenuItem);
    }

    function ariaMenuItem(value, index) {
        //console.log(index);
        //console.log('index='+index+'-- value='+value);
        if ($(index).hasClass('has-submenu') === false) {
            $(index).addClass('has-submenu');
        }
        $(index).children('a, span').attr('role', 'menuitem');
        $(index).children('a.menuparent, span.menuparent').attr('aria-expanded', 'false');
        var childMenu = $(index).children('ul[role="menu"]');
        var menuLabel = $(index).children('a.menuparent, span.menuparent').text();
        $(childMenu).attr('aria-label', menuLabel);

        $(childMenu).each(ariaParseSubMenu);

        $(index)
                .mouseenter(function () {
                    $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'true').addClass('open');
                })
                .mouseleave(function () {
                    $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'false').removeClass('open');
                })
                .focusin(function () {
                    $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'true').addClass('open');
                })
                .focusout(function () {
                    $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'false').removeClass('open');
                })
                .on('keypress', function (e) {
                    e.preventDefault();
                    $(index).parent().siblings().find('li.sf-depth-1.menuparent').superfish('hide');

                    //console.log(e.which);
                    if (e.which === 40) {
                        // down arrow
                        $(index).find('li.menuparent').superfish('show');
                        $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'true').addClass('open');
                        e.preventDefault();
                    }
                    if (e.which === 38) {
                        // up arrow
                        $(index).find('li.menuparent').superfish('hide');
                        $(index).find('a.menuparent, span.menuparent').attr('aria-expanded', 'false').removeClass('open');
                        e.preventDefault();
                    }
                });
    }

})(jQuery, Drupal, once);