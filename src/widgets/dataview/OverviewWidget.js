define(['kb.widget.dataview.base', 'kb.utils.api', 'kbaseutils', 'kbasesession', 'kbc_Workspace', 'kbasenavbar', 'q'],
   function (DataviewWidget, APIUtils, Utils, Session, WorkspaceService, Navbar, Q) {
      "use strict";
      var widget = Object.create(DataviewWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'OverviewWidget';
               cfg.title = 'Data Overview';
               this.DataviewWidget_init(cfg);

               this.templates.env.addFilter('dateFormat', function (dateString) {
                  if (Utils.isBlank(dateString)) {
                     return '';
                  } else {
                     return Utils.niceElapsedTime(dateString);
                  }
               }.bind(this));
               this.templates.env.addFilter('fileSizeFormat', function (numberString) {
                  if (Utils.isBlank(numberString)) {
                     return '';
                  } else {
                     return Utils.fileSizeFormat(numberString);
                  }
               }.bind(this));

               if (this.hasConfig('workspaceId')) {
                  this.setParam('workspaceId', this.getConfig('workspaceId'));
               } else {
                  throw 'Workspace ID is required';
               }

               if (this.hasConfig('objectId')) {
                  this.setParam('objectId', this.getConfig('objectId'));
               } else {
                  throw 'Object ID is required';
               }

               if (this.hasConfig('objectVersion')) {
                  this.setParam('objectVersion', this.getConfig('objectVersion'));
               } else {
                  throw 'Object Version is required';
               }

               return this;
            }
         },

         go: {
            value: function () {
               this.start();
               return this;
            }
         },

         setup: {
            value: function () {
               if (this.hasConfig('workspace_url')) {
                  this.workspaceClient = new WorkspaceService(this.getConfig('workspace_url'), {
                     token: Session.getAuthToken()
                  });
               } else {
                  throw 'The workspace client url is not defined';
               }
            }
         },

         renderLayout: {
            value: function () {
               this.container.html(this.renderTemplate('layout'));
               this.places = {
                  title: this.container.find('[data-placeholder="title"]'),
                  alert: this.container.find('[data-placeholder="alert"]'),
                  content: this.container.find('[data-placeholder="content"]')
               };

            }
         },
         
         afterRender: {
            value: function () {
               var name = this.getState('object.name');
               if (name) {
                  Navbar.setTitle(name);
               }
            }
         },

         setInitialState: {
            value: function () {
               var widget = this;
               return Q.Promise(function (resolve, reject, notify) {
                  Utils.promise(this.workspaceClient, 'get_object_info_new', {
                        objects: [{
                           wsid: this.getParam('workspaceId'),
                           objid: this.getParam('objectId'),
                           ver: this.getParam('objectVersion')
                     }],
                        includeMetadata: 1
                     })
                     .then(function (data) {
                        console.log('here');
                        if (!data || data.length === 0) {
                           this.setState('status', 'notfound');
                           resolve();
                        } else {
                           this.setState('status', 'found');
                           var obj = APIUtils.object_info_to_object(data[0]);
                           console.log('OBJECT');
                           console.log(obj);
                           this.setState('object', obj);
                           resolve();
                        }
                     }.bind(this))
                     .catch(function (err) {
                        console.log('ERROR');
                        console.log(err);
                        reject(err);
                     })
                     .done();
               }.bind(this));
            }
         }


      });

      return widget;
   });