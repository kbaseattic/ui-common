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
        this.container.find('.title').html(title);
      }
    },
    addButton: {
      value: function (cfg) {
        var button = $('<button id="kb-'+cfg.name+'-btn" class="btn btn-'+(cfg.style || 'default')+' navbar-btn kb-nav-btn">'+
                        '  <div class="fa fa-'+cfg.icon+'"></div>'+
                        '  <div class="kb-nav-btn-txt">'+cfg.label+'</div>' +
        '</button>')
        .on('click', function (e) {
          alert('this is the navbar demo page');
        });
        
        this.container.find('.-buttons').prepend(button);
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
      },
    }
  });
  return Navbar;
});