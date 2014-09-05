(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserOverview",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            userInfo:null,
	    wsUserInfoUrl:"https://dev04.berkeley.kbase.us:7058",
	    wsUserInfoRef:"",
            kbCache:{},
        },
    
	wsUserInfoClient:null,
	loggedIn:false,
	loggedInUserId:null,
	userInfoData:null,
	isMe:false,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    
	    console.log(options.userInfo);
	    
            if (options.wsUserInfoUrl) {
		if (options.kbCache.token) {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {token: self.options.kbCache.token});
		    self.loggedIn = true;
		    self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');;
		}
            }
	    if (options.userInfo) {
		self.userInfoData = options.userInfo['data'];
		if (self.userInfoData['basic_personal_info']['user_name']===self.loggedInUserId) {
		    self.isMe = true;
		}
	    }
            
            self.setupOverallStructure();
	    self.setupPicture();
	    self.showInfoView();
	    //self.showEditView();
	    return this;
	},
    
    /*var userInfoData = {
                                                    basic_personal_info: {
                                                        real_name:loggedInName,
                                                        user_name:userId,
                                                        title:"",
                                                        suffix:"",
                                                        location:"",
                                                        email_addresses:[]
                                                    },
                                                    bio: {
                                                        affiliations:[],
                                                        degrees:[]
                                                    },
                                                    websites: [],
                                                    personal_statement: "",
                                                    interests: {
                                                        keywords:[],
                                                        research_statement:""
                                                    },
                                                    publications: [],
                                                    collaborators: [],
                                                    my_apps: [],
                                                    my_services: [],
                                                    resource_usage: {
                                                        disk_quota:20,
                                                        disk_usage:14,
                                                        disk_units:"GB",
                                                        cpu_quota:2000,
                                                        cpu_usage:138,
                                                        cpu_units : "CPU Hours"
                                                    }
                                                };
    */
    
    
	showEditView: function() {
	    var self = this;
	    var $infoPanel = self.$elem.find("#info");
	    $infoPanel.empty();
	    var info = self.userInfoData;
	    var pInfo = info['basic_personal_info'];
	    var bioInfo = info['bio'];
	    var $controlButtons;
	    if (self.isMe) {
		var $save = $('<button type="button" class="btn btn-success">Save</button>')
				.bind("click", function() {
				    self.saveData();
				    self.showInfoView();
				});
		var $cancel = $('<button type="button" class="btn btn-danger">Cancel</button>')
				.bind("click", function() {
				    self.showInfoView();
				});
		
		$controlButtons = $('<span></span>').append($save).append($cancel);
	    }
	    
	    var $header = $('<div class="row">')
				.append('<div class="col-md-9"></div>')
				.append($('<div class="col-md-3">').css("text-align","right").append($controlButtons));
	    $infoPanel.append($header);
	    
	    var email = "";
	    if(pInfo["email_addresses"][0]) {
		email = pInfo["email_addresses"][0];
	    }
	    
	    var nameTitleGroup =
	    '<div><br></div><div class="panel panel-default">'+
		'<div class="panel-heading">'+
		  '<h3 class="panel-title">Basic Personal Information</h3>'+
		'</div>'+
		'<div class="panel-body">'+
		    '<div class="row">' +
			'<div class="col-md-2"><small><i>title</h4></i></small></div>' +
			'<div class="col-md-7"><i>name</i></div>'+
			'<div class="col-md-3"><i>suffix</i></div>'+
		    '</div>'+
		    
		    '<div class="row">' +
			'<div class="col-md-2">' +
			    '<div class="btn-group"><button id="pTitle" type="button" class="btn btn-lg dropdown-toggle" data-toggle="dropdown">'+pInfo["title"]+
			    '<span class="caret"></span><span class="sr-only"></span></button>'+
				'<ul id="pTitleList" class="dropdown-menu" role="menu">'+
				'<li><a>Mr.</a></li><li><a>Ms.</a></li><li><a>Dr.</a></li>'+
				'<li><a>Prof.</a></li><li><a>Sir</a></li><li><a>Dame</a></li>'+  
				'<li><a>Count</a></li><li><a>Champion</a></li>'+
			    '</ul></div>' +
			'</div>' +
			'<div class="col-md-7"><div class="input-group-lg"><input id="pRealName" type="text" class="form-control" value="'+pInfo["real_name"]+'"></div></div>'+
			'<div class="col-md-3"><div class="input-group-lg"><input id="pSuffix" type="text" class="form-control" value="'+pInfo["suffix"]+'"></div></div>'+
		    '</div>'+
		    
		    '<div><br></div>'+
		    '<div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Location</span>'+
			  '<input id="pLocation" type="text" class="form-control" value="'+pInfo["location"]+'"></div>'+
			'</div>' +
		    '</div>'+
		    
		    '<div><br></div>'+
		    '<div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Primary Email</span>'+
			  '<input id="pEmail" type="text" class="form-control" value="'+email+'"></div>'+
			'</div>' +
		    '</div>'+
		    
		    
		'</div></div>';
	    $infoPanel.append(nameTitleGroup);
	    self.$elem.find('#pTitleList li > a').click(function(e){
	        $('#pTitle').text(this.innerHTML);
	    });
	    
	    // this is not the right jquery way to do this!  but it is just a prototype and i can do this faster...
	    var affiliations =
	    '<div><br></div><div class="panel panel-default">'+
		'<div class="panel-heading">'+
		  '<h3 class="panel-title">Affiliations</h3>'+
		'</div>'+
		'<div id="affiliationPanel" class="panel-body">' +
		'</div><div class="row"><div class="col-md-1"></div><div class="col-md-11">'+
		'<button id="addAffiliation" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> Add Affiliation</button>' +
		'</div></div><div><br></div>'+
		'</div></div>';
	    $infoPanel.append(affiliations);
	    var newAfflication = 
		    '<div class="panel panel-default"><div class="panel-body"><div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Title</span>'+
			  '<input id="affTitle" type="text" class="form-control" value=""></div>'+
			'</div>' +
		    '</div>'+
		    '<div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Institution</span>'+
			  '<input id="affInstitution" type="text" class="form-control" value=""></div>'+
			'</div>' +
		    '</div>'+
		    '</div></div>';
	    var $aff = self.$elem.find('#addAffiliation');
	    $aff.click(function(e){
	        self.$elem.find('#affiliationPanel').append(newAfflication);
	    });
	    for (var i = 0; i < bioInfo['affiliations'].length; i++) {
		$aff.append('<div class="panel panel-default"><div class="panel-body"><div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Title</span>'+
			  '<input id="affTitle" type="text" class="form-control" value="'+bioInfo['affiliations'][0]['title']+'"></div>'+
			'</div>' +
		    '</div>'+
		    '<div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Institution</span>'+
			  '<input id="affInstitution" type="text" class="form-control" value="'+bioInfo['affiliations'][0]['institution']+'"></div>'+
			'</div>' +
		    '</div>'+
		    '</div></div>');
	    }
	},
	
	showInfoView: function() {
	    var self = this;
	    var $infoPanel = self.$elem.find("#info");
	    $infoPanel.empty();
	    var pInfo = self.userInfoData['basic_personal_info'];
	    var $editButton;
	    if (self.isMe) {
		$editButton = $('<button type="button" class="btn btn-primary">Edit Info</button>')
				    .bind("click", function() {
					    self.showEditView();
				    });
	    }
	    var nameStr = "";
	    if (pInfo["title"]) { nameStr += pInfo["title"]+" "; }
	    nameStr += pInfo["real_name"];
	    if (pInfo["suffix"]) { nameStr += ", "+pInfo["suffix"]; }
	    
	    var $header = $('<div class="row">')
				.append('<div class="col-md-9"><h2>'+nameStr+'</h2></div>')
				.append($('<div class="col-md-3">').css("text-align","right").append($editButton));
	    $infoPanel.append($header);
	   
	  
	   
	    
	    
	},
    
    
	
    
	saveData: function() {
	    var self = this;
	    // step 1: translate forms to this object...
	    var pName = self.$elem.find("#pRealName").val();
	    self.userInfoData['basic_personal_info']['real_name']=pName;
	    
	    var pSuffix = self.$elem.find("#pSuffix").val();
	    self.userInfoData['basic_personal_info']['suffix']=pSuffix;
	    
	    var pTitle = self.$elem.find('#pTitle').text();
	    self.userInfoData['basic_personal_info']['title']=pTitle;
	    
	    var pLoc = self.$elem.find("#pLocation").val();
	    self.userInfoData['basic_personal_info']['location']=pLoc;
	    var pEmail = self.$elem.find("#pEmail").val();
	    if (pEmail) {
		self.userInfoData['basic_personal_info']['email_addresses']=[pEmail];
	    }
	    
	
	// step 2: save this object to the workspace
	var newObjSaveData = {
	    name:"info",
	    type:"UserInfo.UserInfoSimple-0.1",
	    data:self.userInfoData,
	    provenance:[{description:"created by the KBase functional site, edited by the user"}]
	};
	self.wsUserInfoClient.save_objects({workspace:self.loggedInUserId+":userinfo",objects:[newObjSaveData]},
	    function(data) {
		// great, it worked.  let's just redirect to this page to refresh the elements...
					    
	    },
	    function(err) {
		// we couldn't create it- this is an error - probably the object or ws existed before and was deleted
		console.log("couldn't create user info ");
		console.log(err);
	    });
	    
	},
    
	setupPicture: function() {
	    var self = this;
	    var pic = '<center><img src="assets/images/nouserpic.png" width="95%" style="max-width: 300px;"></center>';
	    self.$elem.find("#picture").append(pic);
	    if (self.isMe) {
		 self.$elem.find("#picture").append('<center><button type="button" class="btn btn-primary">Upload New Picture</button></center>');
	    }
	},
    
	setupOverallStructure: function() {
	    var self = this;
	    self.$elem.append(
		    $('<div id="mainframe">').append(
			$('<div class="row"></div>')
			.append($('<div id="picture" class="col-md-3">'))
			.append($('<div id="info" class="col-md-9">'))
		    ));
	}

    });
})( jQuery )