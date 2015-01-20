define(['jquery', 'nunjucks', 'kbasesession'], 
function ($, nunjucks, Session) {
  "use strict";
  var Navbar = Object.create({},{
    init: {
      value: function (cfg) {
        if (typeof cfg.container === 'string') {
          this.container = $(cfg.container);
        } else {
          this.container = cfg.container;
        }
        
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
        
        var button = $('<button data-kbase-button="'+cfg.name+'" id="kb-'+cfg.name+'-btn" class="btn btn-'+(cfg.style || 'default')+' navbar-btn kb-nav-btn">'+
                       '  <div class="fa fa-'+cfg.icon+'" style="'+iconStyle+'"></div>' + label + '</button>')
        .on('click', function (e) {
          e.preventDefault();
          cfg.callback();
        });
        if (cfg.place === 'end') {
          this.container.find('.navbar-buttons').append(button);
        } else {
          this.container.find('.navbar-buttons').prepend(button);          
        }
      }
    },
    findButton: {
      value: function (name) {
        var button = this.container.find('[data-kbase-button="'+name+'"]');
        return button;
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
            menuItem.on('click', function (e) {
              if (item.callback) {
                item.callback(e);
              }
            });
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
  return Navbar;
});