define(['jquery', 'nunjucks', 'kbasesession'], 
function ($, nunjucks, Session) {
  "use strict";
  var Navbar = Object.create({},{
    init: {
      value: function (cfg) {
        console.log('in navbar');
        if (typeof cfg.container === 'string') {
          this.container = $(cfg.container);
        } else {
          this.container = cfg.container;
        }
        
        // Looks like a widget ... acts like a widget ...
        this.widgetTitle = 'Navbar Widget';
        this.widgetName = 'Navbar';
        
        this.templates = {};
        this.templates.env = new nunjucks.Environment(new nunjucks.WebLoader('/src/widgets/' + this.widgetName + '/templates'), {
          'autoescape': false
        });
        this.templates.env.addFilter('kbmarkup', function(s) {
          if (s) {
            s = s.replace(/\n/g, '<br>');
          }
          return s;
        });
        // This is the cache of templates.
        this.templates.cache = {};

        // The context object is what is given to templates.
        this.context = {};
        this.context.env = {          
          widgetTitle: this.widgetTitle,
          widgetName: this.widgetName
        };
        
        console.log('About to load css?');
        
        // Don't load css dynamically for now. There are parts of the functional
        // site which don't know about this widget yet. And perhaps it will be
        // best practice to load the css for core ui components statically so that
        // the layout doesn't jump around as components load.
        // this.loadCSS();
        return this;
      }
    },
    version: {
      value: "0.0.1"
    },
    getVersion: { 
      value: function () {
        return this.version;
      }
    },
    loadCSS: {
      value: function() {
        console.log('loading css'); console.log('/src/widgets/' + this.widgetName + '/style.css');
        $('<link>')
        .appendTo('head')
        .attr({type: 'text/css', rel: 'stylesheet'})
        .attr('href', '/src/widgets/' + this.widgetName + '/style.css');
      }
    },
    setTitle: {
      value: function (title) {
        // okay, we are punning on a class set on this element.
        this.container.find('.navbar-title').html(title);
      }
    },
    clearButtons: {
      value: function () {
        this.container.find('.navbar-buttons').empty();
      }
    },
    addButton: {
      value: function (cfg) {
        var iconStyle = '';
        var label = '';
        if (cfg.label) {
          label = '<div class="kb-nav-btn-txt">'+cfg.label+'</div>';
        } else {
          iconStyle += 'font-size: 150%;';
        }
        //if (cfg.color) {
        //   iconStyle += 'color: ' + cfg.color + ';';
        //}
        
        var button = $('<button data-button="'+cfg.name+'" id="kb-'+cfg.name+'-btn" class="btn btn-'+(cfg.style || 'default')+' navbar-btn kb-nav-btn">'+
                       '  <div class="fa fa-'+cfg.icon+'" style="'+iconStyle+'"></div>' + label + '</button>')
        .on('click', function (e) {
          e.preventDefault();
          cfg.callback();
        });
        if (cfg.disabled) {
          button.prop('disabled', true);
        }
        if (cfg.place === 'end') {
          this.container.find('.navbar-buttons').append(button);
        } else {
          this.container.find('.navbar-buttons').prepend(button);          
        }
      }
    },
    findButton: {
      value: function (name) {
        return this.container.find('.navbar-buttons [data-button="'+name+'"]');
      }
    },
    addDropdown: {
      value: function (cfg) {
        var button = $('<button type="button" class="btn btn-'+cfg.style+' dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+cfg.label+'<span class="caret"></span></button>');
        var menu = $('<ul class="dropdown-menu" role="menu"></ul>');
        for (var i=0; i<cfg.items.length; i++) {
          var item = cfg.items[i];
          if (item.type === 'divider') {
            menu.append('<li class="divider"></li>');
          } else {
            var menuItem = $('<li><a href="#" data-widget-menu-item="'+item.name+'"><span class="fa fa-'+item.icon+'" style="font-size: 150%; color:'+item.color+'; margin-right: 10px;"></span>' + item.label + '</a></li>');
            if (item.callback) {
              menuItem.on('click', item.callback);
            }
            menu.append(menuItem);
          }
        }
        
        var dropdown = $('<div class="dropdown" style="display: inline-block;"></div>').append(button).append(menu);
        
        if (cfg.place === 'end') {
          this.container.find('.navbar-buttons').append(dropdown);
        } else {
          this.container.find('.navbar-buttons').prepend(dropdown);
        }
      }
    },
    
    addDefaultMenu: {
      value: function (cfg) {
        if (!cfg.search === false) {
          this.addMenuItem({
            name: 'search',
            label: 'Search Data',
            url: '/functional-site/#/search/?q=*',
            place: 'end' 
          });
        }
        if (!cfg.narrative === false) {
          this.addMenuItem({
            name: 'narrative',
            label: 'Narrative',
            url: '/functional-site/#/narrativemanager/start',
            place: 'end'
          });
        }
          this.addMenuItem({
            type: 'divider', 
            name: 'help',
            place: 'end'
          });
         
          this.addHelpMenuItem({
            name: 'contactus',
            label: 'Contact Us',
            url: 'http://staging.kbase.us/contact-us',
            place: 'end'
          });
          this.addHelpMenuItem({
            name: 'about',
            label: 'About KBase',
            url: 'http://staging.kbase.us/about/why-kbase'
          });
      }
    },
    
    addMenuItem: {
      value: function (cfg) {
        var menu = this.container.find('.navbar-menu .dropdown-menu');
        if (menu) {
          if (cfg.type === 'divider') {
            var item = $('<li  role="presentation" class="divider"></li>').attr('data-menu-item', cfg.name);
          } else {
            var item = $('<li></li>');
            
            if (cfg.url) {
             item.append($('<a></a>')
                .attr('href', cfg.url)
                .text(cfg.label)
                .attr('data-menu-item', cfg.name));
            } else if (cfg.callback) {
             item.append($('<a></a>')
                .attr('href', '#')
                .text(cfg.label)
                .attr('data-menu-item', cfg.name))
              .on('click', function (e) {
                e.preventDefault();
                cfg.callback();
              });
            }
          }
        }
        if (!item) {
          return;
        }
        if (cfg.place === 'end') {
          menu.append(item);
        } else {
          menu.prepend(item);
        }
      }
    },
    
    removeMenuItem: {
      value: function (cfg) {
        
      }
    },
    setAboutURL: {
      value: function (cfg) {
        
      }
    },
    addHelpMenuItem: {
      value: function (cfg) { 
        if (cfg.type === 'divider') {
          var item = $('<li  role="presentation" class="divider"></li>').attr('data-menu-item', cfg.name);
        } else {
          if (cfg.url) {       
            var link = $('<a></a>')
            .attr('href', cfg.url)
            .text(cfg.label)
            .attr('data-menu-item', cfg.name);
            if (cfg.external) {
              link.attr('target', '_blank');
            }
          } else if (cfg.callback) {
           var link = $('<a></a>')
              .attr('href', '#')
              .text(cfg.label)
              .attr('data-menu-item', cfg.name)
              .on('click', function (e) {
                e.preventDefault();
                cfg.callback();
              });
          } else {
            var link = $('<span></span>').text(cfg.label);
          }
          var item = $('<li></li>').append(link);
        }
        if (cfg.place === 'end') {
          var menu = this.container.find('.navbar-menu .dropdown-menu');
          if (!menu) {
            return;
          }
          menu.append(item);
        } else {
          var helpDivider = this.container.find('.navbar-menu .dropdown-menu [data-menu-item="help"]');
          if (!helpDivider) {
            return;
          }
          helpDivider.after(item);
        }
      }
    },
    removeHelpMenuItem: {
      value: function (cfg) {
        
      }
    },
    clearMenu: {
      value: function (cfg) {
        this.container.find('.navbar-menu .dropdown-menu').empty();
      }
    },
    
    // TEMPLATES
    getTemplate: {
      value: function(name) {
        if (this.templates.cache[name] === undefined) {
          this.templates.cache[name] = this.templates.env.getTemplate(name + '.html');
        }
        return this.templates.cache[name];
      }
    },

    createTemplateContext: {
      value: function(additionalContext) {
        /*
          var context = this.merge({}, this.context);
          return this.merge(context, {
            state: this.state, 
            params: this.params
          })
          */
        
        // We need to ensure that the context reflects the current auth state.
        this.context.env.loggedIn = this.isLoggedIn();
        if (this.isLoggedIn()) {
          this.context.env.loggedInUser = this.auth.username;
          this.context.env.loggedInUserRealName = this.auth.realname;
        } else {
          delete this.context.env.loggedInUser;
          delete this.context.env.loggedInUserRealName;
        }
        
        this.context.env.isOwner = this.isOwner();
        
        if (additionalContext) {
          var temp = this.merge({}, this.context);
          return this.merge(temp, additionalContext);
        } else {
          return this.context;
        }
      }
    },

    renderTemplate: {
      value: function(name, context) {
        var template = this.getTemplate(name);
        if (!template) {
          throw 'Template ' + name + ' not found';
        }
        var context = context ? context : this.createTemplateContext();
        return template.render(context);
      }
    }
  });
  var TheNavbar = Object.create(Navbar).init({container: '#kbase-navbar'});
  return TheNavbar;
});