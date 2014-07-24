

/* start of colllection of workspace modals
 *
 *
*/
app.service('modals', function() {

    this.createWorkspace = function(cancel_cb, submit_cb) {
        var body = $('<form class="form-horizontal" role="form">\
                          <div class="form-group">\
                            <label class="col-sm-4 control-label">Workspace Name</label>'+
                            '<div class="col-sm-6">'+                                 
                                '<div class="input-group">'+
                                    '<span class="input-group-addon">'+USER_ID+':</span>'+
                                    '<input type="text" class="form-control create-id focusedInput">'+
                                '</div>'+
                            '</div>\
                          </div>\
                          <div class="form-group">\
                            <label class="col-sm-4 control-label">Global Permission</label>\
                            <div class="col-sm-3">'+
                                globalPermDropDown('n')+
                            '</div>\
                          </div>\
                          <div class="form-group">\
                            <label class="col-sm-4 control-label">Description</label>\
                            <div class="col-sm-7">\
                              <textarea class="form-control create-descript" rows="3"></textarea>\
                            </div>\
                          </div>\
                      </div>')
        

        var createModal = $('<div>').kbasePrompt({
                title : 'Create Workspace',
                body : body,
                modalClass : '', 
                controls : [{
                	name: 'Cancel',
                	callback: function(e, $prompt) {
	                		$prompt.closePrompt();
    	            		if (cancel_cb) cancel_cb();
						}
					},
                	{
                    name : 'Create',
                    type : 'primary',
                    callback : function(e, $prompt) {
                        var ws_name = $('.create-id').val();
                        var perm = $('.create-permission option:selected').val();
                        var descript = $('.create-descript').val();

                        if (ws_name === '') {
                            $prompt.addAlert('must enter a workspace name');
                            $('.create-id').focus();
                            return;
                        }                   

                        // check to see if there's a colon in the user project name already
                        // if there is and it's the user's username, use it. If it's not throw error.
                        // Otherwise, append "username:"
                        var s_ws = ws_name.split(':');
                        var error;
                        if (s_ws.length > 1) {
                            if (s_ws[0] == USER_ID) {
                                var proj = USER_ID+':'+s_ws[1];
                            }  else {
                                error = 'Only your username ('+USER_ID+') may be used before a colon';
                                
                            }
                        } else {
                            var name = USER_ID+':'+ws_name
                        }

                        if (error) {
                            $prompt.addCover(error, 'danger');
                        } else {
                            var params = {
                                workspace: name,
                                globalread: perm,
                                description: descript
                            };                                            
                            var prom = kb.ws.create_workspace(params);
                            $prompt.data('dialogModal').find('.modal-body').loading()
                            $.when(prom).done(function(){                                            
                            	if (submit_cb) submit_cb();
                                kb.ui.notify('Created workspace: '+ws_name, 'success');                                            
                                $prompt.closePrompt(); 
                            }).fail(function(e) {
                                $prompt.data('dialogModal').find('.modal-body').rmLoading()
                                $prompt.addCover(e.error.message, 'danger');                                            
                            })
                        }
                    }
                }]
            }
        );
        createModal.openPrompt();
    }

});


 

