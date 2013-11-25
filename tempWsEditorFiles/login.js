(function($, undefined) {
    var workspaceURL = "https://kbase.us/services/workspace";
    var workspaceClient = new workspaceService(workspaceURL);
    notLoggedIn();

    // Function that sets a cookie compatible with the current narrative
    // (it expects to find user_id and token in the cookie)
    var set_cookie = function() {
        var c = $("#login-widget").kbaseLogin('get_kbase_cookie');
        console.log( 'Setting kbase_session cookie');
        $.cookie('kbase_session',
                 'un=' + c.user_id
                 + '|'
                 + 'kbase_sessionid=' + c.kbase_sessionid
                 + '|'
                 + 'user_id=' + c.user_id
                 + '|'
                 + 'token=' + c.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g,'PIPESIGN'),
                 { path: '/',
                   domain: 'kbase.us' });
        $.cookie('kbase_session',
                 'un=' + c.user_id
                 + '|'
                 + 'kbase_sessionid=' + c.kbase_sessionid
                 + '|'
                 + 'user_id=' + c.user_id
                 + '|'
                 + 'token=' + c.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g,'PIPESIGN'),
                 { path: '/'});
    };

    $(function() {
      /*  $(document).on('loggedIn.kbase', function(event, token) {
            console.debug("logged in")
            loadPage();
        });

        */
        $(document).on('loggedOut.kbase', function(event, token) {
            console.debug("logged out")
            notLoggedIn();
        });

        var loginWidget = $("#login-widget").kbaseLogin({ 
            style: "narrative",
            rePrompt: false,

            login_callback: function(args) {
		set_cookie();
                loadPage();
            },

            logout_callback: function(args) {
		$.removeCookie( 'kbase_session');
            	notLoggedIn();
            },

            prior_login_callback: function(args) {
		set_cookie();
                loadPage();
            },
        });


        $("#signinbtn").click(function() {

        	showLoading();
			$("#login_error").hide();

        	loginWidget.login(

        		$('#kbase_username').val(),
        		$('#kbase_password').val(), 
        		function(args) {
        			console.log(args);
        			if (args.success === 1) {
        				
        			    this.registerLogin(args);
				    set_cookie();
				    loadPage();
	        		    doneLoading();
    	    			    $("#login-widget").show();
    	    			} else {
    	    			    $("#loading-indicator").hide();
				    $("#login_error").html(args.message);
				    $("#login_error").show();
    	    			}
        		}
        	);
        });

        $('#kbase_password').keypress(function(e){
        	if(e.which == 13){//Enter key pressed
            	$('#signinbtn').click();
        	}
    	});


    });

    function notLoggedIn() {
    	$("#header_banner").hide();
    	$("#alt_banner").show();
     	$("#login-widget").hide();
    	$("#login_section").show();
        
        $("#jsoneditor").hide();

    }



    function loadPage() {
    	//$("#alt_banner").hide(); // Hmmm???
    	//$("#header_banner").show(); // Hmmm??
	//	$("#public_section").hide();
	//    $("#newsfeed_column").show();
	//    $("#narrative_column").show();
	$("#login_section").hide();
	$("#login-widget").show();
        $("#jsoneditor").show();

        var token = $("#login-widget").kbaseLogin("token");
        var userId = $("#login-widget").kbaseLogin("get_kbase_cookie", "user_id");
        var userName = $("#login-widget").kbaseLogin("get_kbase_cookie", "name");

        if (!userName)
            userName = "KBase User";
        $("#kb_name").html(userName);
	showEditor();
    };


    var je_state = {
	    isObjLoaded:false,
	    loadedObjId:"",
	    loadedObjWs:"",
	    loadedObjType:"",
	    loadedObjIsValid:"",
	    loadedObjHasChanged:false,
	};

	
    function showEditor() {
	var token = $("#login-widget").kbaseLogin("token");
	var user_id = $("#login-widget").kbaseLogin('get_kbase_cookie').user_id;
	
	/**
 * @constructor JSONEditor
 * @param {Element} container    Container element
 * @param {Object}  [options]    Object with options. available options:
 *                               {String} mode      Editor mode. Available values:
 *                                                  'tree' (default), 'view',
 *                                                  'form', 'text', and 'code'.
 *                               {function} change  Callback method, triggered
 *                                                  on change of contents
 *                               {Boolean} search   Enable search box.
 *                                                  True by default
 *                                                  Only applicable for modes
 *                                                  'tree', 'view', and 'form'
 *                               {Boolean} history  Enable history (undo/redo).
 *                                                  True by default
 *                                                  Only applicable for modes
 *                                                  'tree', 'view', and 'form'
 *                               {String} name      Field name for the root node.
 *                                                  Only applicable for modes
 *                                                  'tree', 'view', and 'form'
 *                               {Number} indentation   Number of indentation
 *                                                      spaces. 4 by default.
 *                                                      Only applicable for
 *                                                      modes 'text' and 'code'
 * @param {Object | undefined} json JSON object
 */
	var options = {"mode":"tree","history":false,"change":function(){ je_state.loadedObjHasChanged=true; }};
	$("#je_setTreeView").prop('disabled', true);
	
	var editor = new jsoneditor.JSONEditor($("#jsoneditor")[0],options);
	
	editor.set({});
	
	
	
	
	
	$("#je_setTreeView").click(function() {
	    if(!validateJsonDocument(editor)) {
		$("#je_editorControlBar").prepend(
		    "<div class=\"alert alert-danger alert-dismissable\">"+
			"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
			"Cannot switch to tree view if object is invalid." +
		    "</div>");
		return;
	    }
	    editor.setMode("tree");
	    setAllViewButtonsActive();
	    $("#je_setTreeView").prop('disabled', true);
	});
	$("#je_setFormView").click(function() {
	    if(!validateJsonDocument(editor)) {
		$("#je_editorControlBar").prepend(
		    "<div class=\"alert alert-danger alert-dismissable\">"+
			"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
			"Cannot switch to form view if object is invalid." +
		    "</div>");
		return;
	    }
	    editor.setMode("form");
	    setAllViewButtonsActive();
	    $("#je_setFormView").prop('disabled', true);
	});
	$("#je_setTextView").click(function() {
	    editor.setMode("text");
	    setAllViewButtonsActive();
	    $("#je_setTextView").prop('disabled', true);
	});
	$("#je_setCodeView").click(function() {
	    editor.setMode("code");
	    setAllViewButtonsActive();
	    $("#je_setCodeView").prop('disabled', true);
	});
	
	
	
	$("#je_checkJsonStructure").click( function() { validateJsonDocument(editor) } );
	
	
	
	
	//var kbws = new workspaceService("http://kbase.us/services/workspace_service/",{"token":token,"user_id":user_id});
	var kbws = new workspaceService("http://kbase.us/services/workspace_service/");
	displayAvailableWs(kbws,user_id,token);
	
	
	$("#je_loadWsObj").click(function() {
	    
	    $("#jsoneditor").append($("#wsid_selection").val());
	    
	    /*  typedef structure { 
		    object_id id;
		    object_type type;
		    workspace_id workspace;
		    int instance;
		    string auth;
		    bool asHash;
		    bool asJSON;
	    } get_object_params;*/
	    var currentWsName = $("#je_selectWorkspace")[0].value;
	    var currentObjId = $("#je_selectObjectId")[0].value;
	    var currentObjIdParts = currentObjId.split("/");
	    
	    var params = {
		"workspace":currentWsName,
		"type":currentObjIdParts[0],
		"id":currentObjIdParts[1],
		"auth":token
		};
	    console.log(currentObjId);
	    $("#je_loadingObject").show();
	    
	    kbws.get_object(params).done(function(ret) {
		editor.set(ret.data);
		editor.setName(params.id);
		
		je_state.isObjLoaded = true;
		je_state.loadedObjId = currentObjIdParts[1];
		je_state.loadedObjWs = currentWsName;
		je_state.loadedObjType = currentObjIdParts[0];
		je_state.loadedObjIsValid = true;
		je_state.loadedObjHasChanged = false;
		
		$("#je_loadingObject").hide();
		
            }).fail(function() {
                editor.set({"Error":"object could not be found"});
		je_state.isObjLoaded = false;
		je_state.loadedObjId = "";
		je_state.loadedObjWs = "";
		je_state.loadedObjType = "";
		je_state.loadedObjIsValid = false;
		je_state.loadedObjHasChanged = false;
		
		$("#je_loadingObject").hide();
            });
	});
	
	
	
	$("#je_saveObject").click(function() {
	    if(!validateSaveObject(editor)) { return; }
	    
	    $("#je_savingObject").show();
	    var rawData = editor.get();
	    
	    var saveParams = {
		id:je_state.loadedObjId,
		type:je_state.loadedObjType,
		data:rawData,
		//data:JSON.stringify(rawData),
		//json:1,
		"auth":token,
		workspace:je_state.loadedObjWs,
		command:"Modified from previous version manually using the JsonEditor widget.",
	    };
	    //console.log("saving: "+JSON.stringify(saveParams));
	    //console.log(je_state);
	    
	    workspaceClient.save_object(saveParams, function(objMeta) {
		
		$("#je_editorControlBar").prepend(
		    "<div class=\"alert alert-success alert-dismissable\">"+
			"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
			"<strong>"+je_state.loadedObjId+"</strong> saved to workspace <strong>" +je_state.loadedObjWs +"</strong><br>"+
			" Current object version is: " + (objMeta[3]+1) +
		    "</div>");
		
		$("#je_savingObject").hide();
		//typedef tuple<0 object_id id, 1 object_type type,2 timestamp moddate,3 int instance, 4string command, 5username lastmodifier,
			    // 6 username owner, 7workspace_id workspace, 8 workspace_ref ref, 9 string chsum,mapping<string,string> metadata> object_metadata;
	    }, function (error) {
		//console.log(JSON.stringify(error));
		$("#je_editorControlBar").prepend(
		    "<div class=\"alert alert-danger alert-dismissable\">"+
			"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
			"<strong>Error!</strong> Unable to save object! <br>"+error.error.message+
		    "</div>");
		$("#je_savingObject").hide();
	    });
	    
	});
	
	
	
	$("#je_saveAsObject").click(function() {
	    if(!validateSaveObject(editor)) { return; }
	    
	    
	    $('#je_chooseObjNameModal').modal('show');
	    $("#je_saveObjectNewName").val(je_state.loadedObjId);
	    $("#je_chooseObjNameModalSaveBtn").click(function() {
		console.log("saving "+$("#je_saveObjectNewName").val() );
		
		$('#je_chooseObjNameModal').modal('hide');
		je_state.loadedObjId = $("#je_saveObjectNewName").val();
		
		
		// pull the data and save it
		$("#je_savingObject").show();
		var rawData = editor.get();
		
		var saveParams = {
		    id:je_state.loadedObjId,
		    type:je_state.loadedObjType,
		    data:rawData,
		    //data:JSON.stringify(rawData),
		    //json:1,
		    "auth":token,
		    workspace:je_state.loadedObjWs,
		    command:"Modified from previous version manually using the JsonEditor widget.",
		};
		
		workspaceClient.save_object(saveParams, function(objMeta) {
			$("#je_editorControlBar").prepend(
			    "<div class=\"alert alert-success alert-dismissable\">"+
				"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
				"<strong>"+je_state.loadedObjId+"</strong> saved to workspace <strong>" +je_state.loadedObjWs +"</strong><br>"+
				" Current object version is: " + (objMeta[3]+1) +
			    "</div>");
			
			$("#je_savingObject").hide();
			editor.setName(je_state.loadedObjId);
			//typedef tuple<0 object_id id, 1 object_type type,2 timestamp moddate,3 int instance, 4string command, 5username lastmodifier,
				    // 6 username owner, 7workspace_id workspace, 8 workspace_ref ref, 9 string chsum,mapping<string,string> metadata> object_metadata;
		    }, function (error) {
			//console.log(JSON.stringify(error));
			$("#je_editorControlBar").prepend(
			    "<div class=\"alert alert-danger alert-dismissable\">"+
				"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
				"<strong>Error!</strong> Unable to save object! <br>"+error.error.message+
			    "</div>");
			$("#je_savingObject").hide();
		});
		
		
		//if save works...
		
	    });
	});
    }
    
    function validateSaveObject(editor) {
	
	if (!je_state.isObjLoaded) {
	    $("#je_editorControlBar").prepend(
		"<div class=\"alert alert-danger alert-dismissable\">"+
		    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
		    "<strong>Error!</strong> No typed object is loaded."+
		"</div>");
		
	    $("#je_saveErrorNotLoaded").show();
	    return false;
	}
	validateJsonDocument(editor);
	if (!je_state.loadedObjIsValid) {
	    $("#je_editorControlBar").prepend(
		"<div class=\"alert alert-danger alert-dismissable\">"+
		    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
		    "<strong>Error!</strong> Json structure is invalid and cannot be saved! <br>"+
		    "Mouseover the \"invalid\" alert below to find out why validation failed."+
		"</div>");
	    return false;f
	}
	    
        if (!je_state.loadedObjHasChanged) {
	    $("#je_editorControlBar").prepend(
		"<div class=\"alert alert-warning alert-dismissable\">"+
		    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+
		    "<strong>Error!</strong> Object was not modified.  Nothing was saved."+
		"</div>");
	    return false;
	}
	return true;
    }
    
    
    function validateJsonDocument(editor) {
	try {
	    editor.get();
            $("#je_jsonStatus").removeClass("label-danger");
	    $("#je_jsonStatus").addClass("label-success");
	    $("#je_jsonStatus").removeAttr('title');

	    $("#je_jsonStatus").html( "valid" );
	    je_state.loadedObjIsValid = true;
	    
	} catch (e) {
	    $("#je_jsonStatus").removeClass("label-success");
	    $("#je_jsonStatus").addClass("label-danger");
	    $("#je_jsonStatus").attr('title', e.message);
	    $("#je_jsonStatus").html( "invalid" );
		
	    je_state.loadedObjIsValid = false;
	    return false;
	}
	return true;
    }

    
    function setAllViewButtonsActive() {
	$("#je_setTreeView").prop('disabled', false);
	$("#je_setFormView").prop('disabled', false);
	$("#je_setTextView").prop('disabled', false);
	$("#je_setCodeView").prop('disabled', false);
    }


    function clientError(error) {
        console.debug(error);
    };
	
	
    function displayAvailableWs(workspaceClient,user_id,token) {
	//code
	var wsDropdown = $("#je_selectWorkspace")[0];
	$("#je_selectWorkspace").change(
		function () {
		    var objDropdown = $("#je_selectObjectId")[0];
		    $("#je_selectObjectId").empty();
		    var selectedWsName = wsDropdown.value;
		    
		    var emptySelect = document.createElement("option");
		    emptySelect.text = " select an object ";
		    emptySelect.value = "";
		    objDropdown.appendChild(emptySelect);
		    
		    if (selectedWsName) {
			workspaceClient.list_workspace_objects({"workspace":selectedWsName,"auth":token},function(objList) {
			    //var objList = [["o1","Genome"],["o2","Genome"],["o3","Model"],["o4","FBAResult"]];// fetch all objects in the list
			    //typedef tuple<object_id id,object_type type,timestamp moddate,int instance,string command,username lastmodifier,
			    //username owner,workspace_id workspace,workspace_ref ref,string chsum,mapping<string,string> metadata> object_metadata;
			    for (var i=0; i < objList.length;++i){
				var objname = document.createElement("option");
				objname.text = selectedWsName + " - " + objList[i][1] + " - " + objList[i][0];
				objname.value = objList[i][1]+"/"+objList[i][0];
				objDropdown.appendChild(objname);
			    }
			});
		   }
		});
	
	var emptySelect = document.createElement("option");
	emptySelect.text = " select a workspace ";
	emptySelect.value = "";
	wsDropdown.appendChild(emptySelect);
	
	//tuple<workspace_id id,username owner,timestamp moddate,int objects,permission user_permission,permission global_permission> workspace_metadata;
	workspaceClient.list_workspaces({"auth":token,"excludeGlobal":1}, function(workspaces) {
		var others=[];
		for (var i=0; i < workspaces.length;++i){
		    if (user_id == workspaces[i][1]) {
			var wsname = document.createElement("option");
			wsname.text = workspaces[i][0] + " ("+workspaces[i][1]+")";
			wsname.value = workspaces[i][0];
			wsDropdown.appendChild(wsname);
		    } else {
			others.push(workspaces[i]);
		    }
		}
		for (var i=0; i < others.length;++i){
		    var wsname = document.createElement("option");
		    wsname.text = others[i][0] + " ("+others[i][1]+")";
		    wsname.value = others[i][0];
		    wsDropdown.appendChild(wsname);
		}
		
	    });
    }
    
    function showLoading() {
	//$('#login_form button[type="submit"]').attr('disabled','disabled');
	$("#loading-indicator").show();
    }

    function doneLoading() {
	$("#loading-indicator").hide();
    }
    
    

    


})( jQuery );

