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
                        url: '/functional-site/#/narrativemanager/new?copydata=' + dataRef,
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
                     });


                  var narratives = this.getState('writableNarratives');
                  console.log('NAR');
                  console.log(narratives.length);
                  var items = [];
                  if (narratives) {

                     for (var i = 0; i < narratives.length; i++) {
                        var narrative = narratives[i];
                        items.push({
                           name: 'narrative_' + i,
                           icon: 'file',
                           label: narrative.metadata.narrative_nice_name,
                           external: true,
                           callback: (function (wsid) {
                              var widget = this;
                              return function (e) {
                                 e.preventDefault();
                                 widget.copyObjectToNarrative(wsid);
                                 // alert('copying to narrative ws id ' + wsid);
                              }
                           }.bind(this))(narrative.id)
                        });
                     }
                     console.log('ITEMS');
                     console.log(items);
                     Navbar.addDropdown({
                        place: 'end',
                        name: 'options',
                        style: 'default',
                        icon: 'copy',
                        label: 'Copy',
                        items: items
                     });
                  }
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

         getObjectRef: {
            value: function () {
               if (this.hasState('object')) {
                  if (this.hasState('object.version')) {
                     return this.getState('object.wsid') + '/' + this.getState('object.id') + '/' + this.getState('object.version');
                  } else {
                     return this.getState('object.wsid') + '/' + this.getState('object.id');
                  }
               }
            }
         },

         /**
         copy the current ws object to the given narrative.
         TODO: omit the workspace for the current data object.
         */
         copyObjectToNarrative: {
            value: function (wsid) {
               var from = this.getObjectRef();
               var to = wsid + '';
               var name = this.getState('object.name');
               
               //alert('Copying from ' + from + ' to ' + to + ' with name ' + name);
               //return;

               Utils.promise(this.workspaceClient, 'copy_object', {
                     from: {ref: from},
                     to: {wsid: to, name: name}
                  })
                  .then(function (data) {
                     if (data) {
                        alert('Copied data object.');
                     } else {
                        alert('Data not copied?');
                     }
                  })
                  .catch(function (err) {
                  console.log('ERROR'); console.log(err);
                     alert('Error copying data...');
                  })
                  .done();

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
                           //console.log('OBJECT');
                           //console.log(obj);


                           // Get more info...

                           // The narrative this lives in.
                           Utils.promise(this.workspaceClient, 'get_workspace_info', {
                                 id: this.getParam('workspaceId')
                              })
                              .then(function (data) {
                                 //console.log('WS DATA'); console.log(APIUtils.workspace_metadata_to_object(data));
                                 this.setState('workspace', APIUtils.workspace_metadata_to_object(data));

                                 // Other narratives this user has.
                                 Utils.promise(this.workspaceClient, 'list_workspace_info', {
                                       perm: 'w'
                                    })
                                    .then(function (data) {
                                       //console.log('GOT:'); console.log(data);
                                       var objects = data.map(function (x) {
                                          return APIUtils.workspace_metadata_to_object(x)
                                       });
                                       //console.log('OBJS'); console.log(objects);
                                       var narratives = objects.filter(function (obj) {
                                          if (obj.metadata.narrative && (!isNaN(parseInt(obj.metadata.narrative))) &&
                                             // don't keep the current narrative workspace.
                                             obj.id != this.getState('workspace.id') &&
                                             obj.metadata.narrative_nice_name &&
                                             obj.metadata.is_temporary && obj.metadata.is_temporary !== 'true') {
                                             return true;
                                          } else {
                                             return false;
                                          }
                                       }.bind(this));
                                       //console.log('NAR'); console.log(narratives);
                                       this.setState('writableNarratives', narratives);
                                       resolve();
                                       // FIN
                                    }.bind(this))
                                    .catch(function (err) {
                                       reject(err);
                                    })
                                    .done();

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