define(['kb.widget.dataview.base', 'kb.utils.api', 'kbaseutils', 'kbasesession', 'kbc_Workspace', 'kbasenavbar', 'q'],
   function (DataviewWidget, APIUtils, Utils, Session, WorkspaceService, Navbar, Q) {
      "use strict";
      var widget = Object.create(DataviewWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'OverviewWidget';
               cfg.title = 'Data Object Summary';
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
               this.templates.env.addFilter('length2', function (x) {
                  if (x) {
                     if (x instanceof Array) {
                        return x.length;
                     } else if (x instanceof Object) {
                        return Object.keys(x).length;
                     }
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

               // Subobject specification is optional
               if (this.hasConfig('sub')) {
                  this.setParam('sub', this.getConfig('sub'));
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

                  var dataRef = this.getObjectRef();

                  Navbar
                  .clearButtons();

                  Navbar.addDropdown({
                	  place: 'end',
                	  name: 'download',
                	  style: 'default',
                	  icon: 'download',
                	  label: 'Download',
                	  widget: 'kbaseDownloadPanel',
                	  params: {'ws': this.getState('workspace.id'), 'obj': this.getState('object.id'), 'ver': this.getState('object.version')}
                  });

                  Navbar
                  .addButton({
                        name: 'copy',
                        label: '+ New Narrative',
                        style: 'primary',
                        icon: 'plus-square',
                        url: '/functional-site/#/narrativemanager/new?copydata=' + dataRef,
                        external: true
                     })
                     /*.addButton({
                        name: 'download',
                        label: 'Download',
                        style: 'primary',
                        icon: 'download',
                        callback: function () {
                           alert('download object');
                        }.bind(this)
                     })*/;

                  var narratives = this.getState('writableNarratives');
                  if (narratives) {
                     var items = [];
                     for (var i = 0; i < narratives.length; i++) {
                        var narrative = narratives[i];
                        items.push({
                           name: 'narrative_' + i,
                           icon: 'file',
                           label: narrative.metadata.narrative_nice_name,
                           external: true,
                           callback: (function (narrative) {
                              var widget = this;
                              return function (e) {
                                 e.preventDefault();
                                 widget.copyObjectToNarrative(narrative);
                              }
                           }.bind(this))(narrative)
                        });
                     }
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
                  Navbar
                  .setTitle('<span style="color: red;">This Object was Not Found</span>')
                  .clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               case 'denied':
                  Navbar
                  .setTitle('<span style="color: red;">Access Denied to this Object</span>')
                  .clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               case 'error':
                  Navbar
                  .setTitle('<span style="color: red;">An Error has Occurred Accessing this Object</span>')
                  .clearButtons();
                  this.places.content.html(this.renderTemplate('error'));
                  break;
               default:
                  Navbar
                  .setTitle('An Error has Occurred Accessing this Object')
                  .clearButtons();
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
                  return APIUtils.makeWorkspaceObjectRef(this.getState('workspace.id'), this.getState('object.id'), this.getState('object.version'))
               }
            }
         },
         
         makeUrl: {
            value: function (path) {
               return window.location.protocol + '//' + window.location.host + path;
            }
         },

         /**
         copy the current ws object to the given narrative.
         TODO: omit the workspace for the current data object.
         */
         copyObjectToNarrative: {
            value: function (narrativeWs) {
               var from = this.getObjectRef();
               var to = narrativeWs.id + '';
               var name = this.getState('object.name');
   
               Utils.promise(this.workspaceClient, 'copy_object', {
                     from: {ref: from},
                     to: {wsid: to, name: name}
                  })
                  .then(function (data) {
                     if (data) {

                        var narrativeUrl = this.makeUrl('/narrative/'+APIUtils.makeWorkspaceObjectId(narrativeWs.id, narrativeWs.metadata.narrative));
                        this.alert.addSuccessMessage('Success','Successfully copied this data object to Narrative <i>' + narrativeWs.metadata.narrative_nice_name + '</i>.  <a href="'+narrativeUrl+'" target="_blank">Open this Narrative</a>');
                     } else {
                        this.alert.addErrorMessage('Error', 'An unknown error occurred copying the data.');
                     }
                  }.bind(this))
                  .catch(function (err) {
                     if (err.error && err.error.message) {
                        var msg = err.error.message;
                     } else {
                        var msg = '';
                     }
                     this.alert.addErrorMessage('Error', 'Error copying the data object to the selected Narrative. ' + msg);
                     console.log('ERROR'); console.log(err);
                  }.bind(this))
                  .done();

            }
         },
         
         fetchVersions: {
            value: function () {
               
               // Note: we can just get the object history in one call :) -mike
               Utils.promise(this.workspaceClient, 'get_object_history', 
                  {ref: APIUtils.makeWorkspaceObjectRef(
                          this.getState('workspace.id'),
                          this.getState('object.id'))}
               )
               .then(function (dataList) {
                  
                  var versions = dataList.map(function (x) {
                        return APIUtils.object_info_to_object(x);
                     });
                  this.setState('versions', versions.sort(
                          function (a,b) {return b.version - a.version}));
                  
               }.bind(this))
               .catch(function (err) {
                  console.log('ERROR'); 
                  console.log(err);
               })
               .done();
              
              
            }
         },
         
//         checkRefCountAndFetchReferences: {
//             value: function () {
//                 Utils.promise(this.workspaceClient,
//                         'list_referencing_objects_counts',
//                         [{ref: }])
//             }
//         }
//         
         fetchReferences: {
            value: function () {
               Utils.promise(this.workspaceClient, 'list_referencing_objects',
                             [{ref: this.getObjectRef()}]
               )
               .then(function (dataList) {
                  var refs = [];
                  if (dataList[0]) {
                     for(var i=0; i<dataList[0].length; i++) {
                        refs.push(APIUtils.object_info_to_object(dataList[0][i]));
                     }
                  }
                  this.setState('references', refs.sort(function (a,b) {return b.name - a.name}));
               }.bind(this))
               .catch(function (err) {
                  console.log('ERROR'); 
                  console.log(err);
               })
               .done();
            }
         },
         
         createDataIcon : {
            value: function (object_info) {
               try {
                  var icons = $.parseJSON(
                     $.ajax({
                       url: "assets/icons/icons.json", // should not be hardcoded!! but figure that out later
                       async: false,
                       dataType: 'json'
                     }).responseText
                   );
                  //console.log(icons);
                  
                  var type = object_info[2].split('-')[0].split('.')[1];
                  var $logo = $('<span>');
                  var icon = _.has(icons.data, type) ? icons.data[type] : icons.data['DEFAULT'];
                  
                  var code = 0;
                  for (var i = 0; i < type.length; code += type.charCodeAt(i++));
                  var color =  icons.colors[code % icons.colors.length];
                  // background circle
                  $logo.addClass("fa-stack fa-2x")
                    .append($('<i>')
                      .addClass("fa fa-circle fa-stack-2x")
                      .css({'color': color}));
                  
                  var isCustomIcon = (icon.length > 0 && icon[0].length > 4 &&
                                          icon[0].substring(0, 4) == 'icon');
                    
                  if (isCustomIcon) {
                      // add custom icons (more than 1 will look weird, though)
                      _.each(icon, function (cls) {
                          $logo.append($('<i>')
                            .addClass("icon fa-inverse fa-stack-1x " + cls));
                      });
                  }
                  else {
                      // add stack of font-awesome icons
                      _.each(icon, function (cls) {
                          $logo.append($('<i>')
                            .addClass("fa fa-inverse fa-stack-1x " + cls));
                      });
                  }
                  
                  return $('<div>').append($logo).html(); //probably a better way to do this...
                  
               } catch(err) {
                  console.error("When fetching icon config: ",err);
                  return "";
               }
            }
         },
         
         
         setInitialState: {
            value: function () {
               var widget = this;
               return Q.Promise(function (resolve, reject, notify) {
                  if(this.getParam('sub')) {
                     this.setState('sub',this.getParam('sub'));
                  }
                  
                  Utils.promise(this.workspaceClient, 'get_object_info_new', {
                        objects: [{
                           ref:  APIUtils.makeWorkspaceObjectRef(this.getParam('workspaceId'), this.getParam('objectId'), this.getParam('objectVersion'))
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
                           
                           // create the data icon
                           this.setState('dataicon',this.createDataIcon(data[0]));

                           // Get more info...
                           
                           // The narrative this lives in.
                           var workspaceId = this.getParam('workspaceId');
                           var isIntegerId = /^\d+$/.test(workspaceId);
                           Utils.promise(this.workspaceClient, 'get_workspace_info', {
                                 id:  isIntegerId ? workspaceId : null,
                                 workspace: isIntegerId ? null : workspaceId
                              })
                              .then(function (data) {
                                 this.setState('workspace', APIUtils.workspace_metadata_to_object(data));
                              
                                 // Okay, the rest doens't really have to be done here ..
                                 
                                 // Get versions to populate the versions panel.
                                 this.fetchVersions();
                                 
                                 // Get the references to this object
                                 this.fetchReferences();
                              
                              
                                 // Other narratives this user has.
                                 Utils.promise(this.workspaceClient, 'list_workspace_info', {
                                       perm: 'w'
                                    })
                                    .then(function (data) {
                                       var objects = data.map(function (x) {
                                          return APIUtils.workspace_metadata_to_object(x)
                                       });
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