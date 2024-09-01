(function ($, Drupal, once) {
    
    Drupal.behaviors.SuperfishAria = {
        attach: function (context, settings) {

            var tabbingContext;

            // Keyboard mapping
            var key = {
                tab: 9,
                enter: 13,
                esc: 27,
                space: 32,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };

            // state vars for index hopping
            var currentIndex, subIndex;
            var appsMenuItems = $('.sf-menu > li');
            var subMenuItems = $('.sf-menu > li li');

            var gotoIndex = function (idx) {
                if (idx === appsMenuItems.length) {
                    idx = 0;
                } else if (idx < 0) {
                    idx = appsMenuItems.length - 1;
                }
                appsMenuItems[idx].focus();
                currentIndex = idx;
            };

            var gotoSubIndex = function (menu, idx) {
                var items = $(menu).children('li');

                if (idx === items.length) {
                    idx = 0;
                } else if (idx < 0) {
                    idx = items.length - 1;
                }

                items[idx].focus();
                subIndex = idx;
            };
            
            once('SuperfishAria-Override', '.sf-menu', context).forEach(function (element) {
                // setup main menu state
                var menuAttr = $('.sf-menu', context).attr('aria-label');
                var menuItemAttrTabindex = $('.sf-menu', context).attr('tabindex');
                if (typeof menuAttr === 'undefined' || menuAttr === false) {
                    var menuId = $(element).attr('id').replace("-", " ");
                    $(element).attr('aria-label', menuId);
                    $(element).attr('role', 'menubar');
                }
                if (typeof menuItemAttrTabindex === 'undefined' || menuItemAttrTabindex === false) {
                    $(element).attr('tabindex', '-1');
                }
                /*
                // suppressed tabbingManager integration as it is unstable and almost totally useless.
                $('.sf-menu ul').on('focusin', function(item) {
                    tabbingContext = Drupal.tabbingManager.constrain($('.sf-menu li, .sf-menu li a, .sf-menu li li, .sf-menu li li a'));
                    var args = {
                      '@count': $('.sf-menu li').length  
                    };
                    Drupal.annouce(Drupal.t('Tabbing in contrained to @count elements.', args));
            
                });
                $('.sf-menu ul').on('focusout', function(item) {
                    tabbingContext.release();
                });
                */
                
            });

            once('SuperfishAria-MenuItem-Wrapper-Override', '.sf-menu li', context).forEach(function (element) {
                // setup menu item wrapper
                var menuItemAttrTabindex = $(element, context).attr('tabindex');
                if (typeof menuItemAttrTabindex === 'undefined' || menuItemAttrTabindex === false) {
                    $(element).attr('tabindex', '0');
                }
                $(element, context).on('focus', function (item) {
                    $(item, context).trigger('hover');
                });
            });

            once('SuperfishAria-MenuItem-Override', '.sf-menu li a', context).forEach(function (element) {
                // setup menu item button
                var menuItemAttrRole = $(element, context).attr('role');
                var menuItemAttrHasPopup = $(element, context).attr('aria-haspopup');
                var menuItemAttrExpanded = $(element, context).attr('aria-expanded');
                var menuItemAttrTabindex = $(element, context).attr('tabindex');
                var menuItemSubmenu = $(element, context).siblings('ul').length;

                if (typeof menuItemAttrRole === 'undefined' || menuItemAttrRole === false) {
                    $(element).attr('role', 'menuitem');
                }
                if (typeof menuItemAttrHasPopup === 'undefined' || menuItemAttrHasPopup === false) {
                    if (menuItemSubmenu > 0) {
                        var subMenu = "true";
                    } else {
                        var subMenu = "false";
                    }
                    $(element).attr('aria-haspopup', subMenu);
                }
                if (typeof menuItemAttrExpanded === 'undefined' || menuItemAttrExpanded === false) {
                    var hasPopup = $(element).attr('aria-haspopup');
                    if (hasPopup === "true") {
                        $(element).attr('aria-expanded', "false");
                    }
                }
                if (typeof menuItemAttrTabindex === 'undefined' || menuItemAttrTabindex === false) {
                    $(element).attr('tabindex', '0');
                }

                // menu item link
                $(element, context).addClass('menuitem-button');

            });

            once('SuperfishAria-MenuItem-Trigger', 'li.menuitem-wrapper').forEach(function (item, index) {
                if (index === 0) {
                    currentIndex = 0;
                }
                $(item)
                .mouseenter(function () {
                    $(item).find('a.menuparent, span.menuparent').attr('aria-expanded', 'true');
                })
                .mouseleave(function () {
                    $(item).find('a.menuparent, span.menuparent').attr('aria-expanded', 'false');
                })
                .focusin(function () {
                    $(item).find('a.menuparent, span.menuparent').attr('aria-expanded', 'true');
                    subIndex = 0;
                })
                .focusout(function () {
                    $(item).find('a.menuparent, span.menuparent').attr('aria-expanded', 'false');
                });
                /*
                // Suppressing keyboard controls as it's unstable.
                .on('keyup', function (e) {
                    var test = null;
                    switch (e.which) {
                        case key.tab:
                            if (e.shiftKey) {
                                gotoIndex(currentIndex - 1);
                            } else {
                                gotoIndex(currentIndex + 1);
                            }
                             e.preventDefault();
                            break;
                        case key.enter:
                        case key.down:
                            $(this).click();
                            subindex = 0;
                            gotoSubIndex($(this).children('li'), 0);
                            e.preventDefault();
                            break;
                        case key.esc:
                            break;
                        case key.space:
                            break;
                        case key.left:
                            gotoIndex(currentIndex - 1);
                            e.preventDefault();
                            break;
                        case key.right:
                            gotoIndex(currentIndex + 1);
                            e.preventDefault();
                            break;
                        case key.up:
                            $(this).click();
                            var submenu = $(this).children('ul');
                            subindex = $(submenu).children('li').length - 1;
                            gotoSubIndex(submenu, subindex);
                            e.preventDefault();
                            break;
                    }
                });
                */
            });
            
        }
    };
})(jQuery, Drupal, once);