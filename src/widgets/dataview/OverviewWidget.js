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

               // Version is optional
               if (this.hasConfig('objectVersion')) {
                  this.setParam('objectVersion', this.getConfig('objectVersion'));
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

         render: {
            value: function () {
               // The state.status property is used to switch to the appropriate view.
               switch (this.getState('status')) {
               case 'found':
                  var name = this.getState('object.name');
                  if (name) {
                     Navbar.setTitle(name);
                  }
                  this.places.content.html(this.renderTemplate('main'));
                     
                  var dataRef = this.getState('object.wsid') + '/' + this.getState('object.id') + '/' + this.getState('object.version');
                     
                  Navbar.addButton({
                        name: 'copy',
                        label: '+ New Narrative',
                        style: 'primary',
                        icon: 'plus-square',
                        url: '/functional-site/#/narrativemanager/new?copydata='+dataRef,
                        external: true
                     })
                     .addButton({
                        name: 'download',
                        label: 'Download',
                        style: 'primary',
                        icon: 'download',
                        callback: function () {
                           alert('download object');
                        }.bind(this)
                     })
                     .addDropdown({
                        place: 'end',
                        name: 'options',
                        style: 'default',
                        icon: 'copy',
                        label: 'Copy',
                        items: [{
                              name: 'narrative1',
                              icon: 'key',
                              label: 'Narrative 1',
                              url: 'xxx',
                              external: true
                        },
                           {
                              name: 'narrative2',
                              icon: 'key',
                              label: 'Narrative 3',
                              url: 'xxx',
                              external: true
                        },
                           {
                              name: 'narrative3',
                              icon: 'key',
                              label: 'Narrative 3',
                              url: 'xxx',
                              external: true
                        }]
                     });
                  break;
               case 'notfound':
                  Navbar.setTitle('<span style="color: red;">This Object was Not Found</span>');
                  Navbar.clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               case 'denied':
                  Navbar.setTitle('<span style="color: red;">Access Denied to this Object</span>');
                  Navbar.clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               case 'error':
                  Navbar.setTitle('<span style="color: red;">An Error has Occurred Accessing this Object</span>');
                  Navbar.clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               default:
                  Navbar.setTitle('An Error has Occurred Accessing this Object');
                  Navbar.clearButtons();
                  this.setState('error', {
                     type: 'internal',
                     code: 'invalidstatus',
                     shortMessage: 'The internal status "' + this.getState('status') + '" is not suppored',
                     originalMessage: err.message
                  });
                  this.places.content.html(this.renderTemplate('error'));
                  break;
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
                        if (!data || data.length === 0) {
                           this.setState('status', 'notfound');
                           resolve();
                        } else {
                           this.setState('status', 'found');
                           var obj = APIUtils.object_info_to_object(data[0]);
                           this.setState('object', obj);
                           console.log('OBJECT');
                           console.log(obj);
                          
                           
                           // Get more info...
                           
                           // The narrative this lives in.
                           Utils.promise(this.workspaceClient, 'get_workspace_info', {
                              id: this.getParam('workspaceId')
                           })
                           .then(function (data) {
                              console.log('WS DATA'); console.log(APIUtils.workspace_metadata_to_object(data));
                              this.setState('workspace', APIUtils.workspace_metadata_to_object(data));
                              
                              // Other narratives this user has.

                              
                               resolve();
                              
                              
                           }.bind(this))
                           .catch(function (err) {
                              reject(err);
                           })
                           .done();
                        }
                     }.bind(this))
                     .catch(function (err) {
                        //console.log('ERROR');
                        //console.log(err);

                        if (err.status && err.status === 500) {
                           // User probably doesn't have access -- but in any case we can just tell them
                           // that they don't have access.
                           if (err.error.error.match(/^us.kbase.workspace.database.exceptions.NoSuchObjectException:/)) {
                              this.setState('status', 'notfound');
                              this.setState('error', {
                                 type: 'client',
                                 code: 'notfound',
                                 shortMessage: 'This object does not exist',
                                 originalMessage: err.error.message
                              });
                           } else if (err.error.error.match(/^us.kbase.workspace.database.exceptions.InaccessibleObjectException:/)) {
                              this.setState('status', 'denied');
                              this.setState('error', {
                                 type: 'client',
                                 code: 'denied',
                                 shortMessage: 'You do not have access to this object',
                                 originalMessage: err.error.message
                              });
                           } else {
                              this.setState('status', 'error');
                              this.setState('error', {
                                 type: 'client',
                                 code: 'error',
                                 shortMessage: 'An unknown error occured',
                                 originalMessage: err.error.message
                              });
                           }
                           resolve();
                        } else {
                           this.setState('error', {
                              type: 'general',
                              code: 'error',
                              shortMessage: 'An unknown error occured'
                           });
                           reject(err);
                        }
                     }.bind(this))
                     .done();
               }.bind(this));
            }
         }


      });

      return widget;
   });