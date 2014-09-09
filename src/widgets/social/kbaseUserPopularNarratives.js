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
	
	alertPanel:null,
	
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
	    // setup the alert panel
            self.alertPanel = $("<div></div>");
	    self.$elem.append(self.alertPanel);
	    
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
		    '<div id="affiliationPanel" class="panel-body"></div>' +
		    '<div class="row"><div class="col-md-1"></div><div class="col-md-11">'+
		      '<button id="addAffiliation" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> Add Affiliation</button>' +
		    '</div></div>'+
		    '<div><br></div>'+
		'</div></div>';
	    $infoPanel.append(affiliations);
	    
	    var $aff = self.$elem.find('#addAffiliation');
	    var $affPanel = self.$elem.find('#affiliationPanel');
	    $aff.click(function(e){
		console.log($affPanel);
		var $removeAff = $('<button type="button" class="btn btn-danger">Remove</button>')
		    .bind("click", function() {
			$(this).parent().parent().parent().parent().removeClass();
			$(this).parent().parent().parent().parent().empty();
		    });
		var $newAffliation = 
		    $('<div class="panel panel-default">').append($('<div class="affiliation-input-group panel-body">').append('<div class="row">'+
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
		    '</div>').append(
		    $('<div class="row">').append(
			'<div class="col-md-3"><div class="input-group">'+
			  '<span class="input-group-addon">Starting in Year</span>'+
			  '<input id="affStart" type="text" class="form-control" value=""></div>'+
			'</div>' +
			'<div class="col-md-1"></div>' +
			'<div class="col-md-3"><div class="input-group">'+
			  '<span class="input-group-addon">Ending in Year</span>'+
			  '<input id="affEnd" type="text" class="form-control" value=""></div>'+
			'</div>' +
		    '</div><div class="col-md-3"></div>').append($('<div class="col-md-2">').append($removeAff)))
		    );
	        $affPanel.append($newAffliation);
	    });
	    for (var i = 0; i < bioInfo['affiliations'].length; i++) {
		if (!bioInfo['affiliations'][i]['start_year']) {
		    bioInfo['affiliations'][i]['start_year'] = "";
		}
		if (!bioInfo['affiliations'][i]['end_year']) {
		    bioInfo['affiliations'][i]['end_year'] = "";
		}
		var $removeAff = $('<button type="button" class="btn btn-danger">Remove</button>')
		    .bind("click", function() {
			$(this).parent().parent().parent().parent().removeClass();
			$(this).parent().parent().parent().parent().empty();
		    });
		$affPanel.append(
		    $('<div class="panel panel-default">').append($('<div class="affiliation-input-group panel-body">').append('<div class="row">'+
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Title</span>'+
			  '<input id="affTitle" type="text" class="form-control" value="'+bioInfo['affiliations'][i]['title']+'"></div>'+
			'</div>' +
		    '</div>'+
		    '<div class="row">' +
			'<div class="col-md-12"><div class="input-group">'+
			  '<span class="input-group-addon">Institution</span>'+
			  '<input id="affInstitution" type="text" class="form-control" value="'+bioInfo['affiliations'][i]['institution']+'"></div>'+
			'</div>' +
		    '</div>').append(
		    $('<div class="row">').append(
			'<div class="col-md-3"><div class="input-group">'+
			  '<span class="input-group-addon">Starting in Year</span>'+
			  '<input id="affStart" type="text" class="form-control" value="'+bioInfo['affiliations'][i]['start_year']+'"></div>'+
			'</div>' +
			'<div class="col-md-1"></div>' +
			'<div class="col-md-3"><div class="input-group">'+
			  '<span class="input-group-addon">Ending in Year</span>'+
			  '<input id="affEnd" type="text" class="form-control" value="'+bioInfo['affiliations'][i]['end_year']+'"></div>'+
			'</div><div class="col-md-3"></div>').append($('<div class="col-md-2">').append($removeAff)))
		    ));
	    }
	    
	    var personalStatement =
	    '<div><br></div><div class="panel panel-default">'+
		'<div class="panel-heading">'+
		  '<h3 class="panel-title">Personal or Research Statement</h3>'+
		'</div>'+
		'<div class="panel-body">'+
		    '<div class="row">' +
			'<div class="col-md-12">'+
			  '<textarea id="personalStatement" class="form-control" rows="8" style="resize:vertical;">'+info["personal_statement"]+'</textarea>' +
			'</div>' +
		    '</div>'+
		'</div></div>';
	    $infoPanel.append(personalStatement);
	    
	    
	    // for some reason, this only works if I create another copy of teh save/cancel buttons!   I don't get jquery.
	    var $controlButtons2;
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
		
		$controlButtons2 = $('<span></span>').append($save).append($cancel);
	    }
	    var $footer = $('<div class="row">')
				.append('<div class="col-md-9"></div>')
				.append($('<div class="col-md-3">').css("text-align","right").append($controlButtons2));
	    $infoPanel.append($footer);
	    
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
				.append('<div class="col-md-9"><h2><strong>'+nameStr+'</strong></h2></div>')
				.append($('<div class="col-md-3">').css("text-align","right").append($editButton));
	    $infoPanel.append($header);
	   
	    
	    if (self.userInfoData['basic_personal_info']['location']) {
		$infoPanel.append('<i>'+self.userInfoData['basic_personal_info']['location']+'</i><br>');
	    }
	    if (self.userInfoData['basic_personal_info']['email_addresses'].length>=1) {
		$infoPanel.append('<p><a href="'+self.userInfoData['basic_personal_info']['email_addresses'][0]+'">'+
				  self.userInfoData['basic_personal_info']['email_addresses'][0]+'</a></p>');
	    }
	    
	    var aff = self.userInfoData['bio']['affiliations'];
	    for (var a=0; a<aff.length; a++) {
		var start = ""; var end="present";
		if (aff[a].start_year) {  start= aff[a].start_year; }
		if (aff[a].end_year) {  end= aff[a].end_year; }
		$infoPanel.append('<p><strong>'+aff[a].title+'</strong> ('+start+'-'+end+')<br><i>'+aff[a].institution+'</i></p>');
	    }
	    
	    
	    if (self.userInfoData['personal_statement']) {
		$infoPanel.append('<p>'+self.userInfoData['personal_statement']+'</p>');
	    }
	    
	   /*var pLoc = self.$elem.find("#pLocation").val();
	    self.userInfoData['basic_personal_info']['location']=pLoc;
	    var pEmail = self.$elem.find("#pEmail").val();
	    if (pEmail) {
		self.userInfoData['basic_personal_info']['email_addresses']=[pEmail];
	    }*/
	    
	    
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
	    
	    var bioAff = self.$elem.find(".affiliation-input-group");
	    var affiliations = [];
	    for(var ba=0; ba<bioAff.length; ba++) {
		var newAff = {
			title:$(bioAff[ba]).find("#affTitle").val(),
			institution :$(bioAff[ba]).find("#affInstitution").val(),
			start_year:parseInt($(bioAff[ba]).find("#affStart").val()),
			end_year:parseInt($(bioAff[ba]).find("#affEnd").val())
		    };
		if (newAff['title'] && newAff['institution']) {
		    affiliations.push(newAff);
		}
	    }
	    self.userInfoData['bio']['affiliations'] = affiliations;
	    
	    self.userInfoData['personal_statement'] = self.$elem.find("#personalStatement").val();
	
	    // step 2: save this object to the workspace
	    var newObjSaveData = {
		name:"info",
		type:"UserInfo.UserInfoSimple",
		data:self.userInfoData,
		provenance:[{description:"created by the KBase functional site, edited by the user"}]
	    };
	    self.wsUserInfoClient.save_objects({workspace:self.loggedInUserId+":userinfo",objects:[newObjSaveData]},
		function(data) {
		    // great, it worked.  let's just redirect to this page to refresh the elements...
		   self.alertPanel.append(
			'<div class="alert alert-success alert-dismissible" role="alert">'+
			  '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
			  '<strong>Success!</strong> Your user profile has been updated.</div>');
		},
		function(err) {
		    // we couldn't create it- this is an error - probably the object or ws existed before and was deleted
		    self.alertPanel.append(
			'<div class="alert alert-danger alert-dismissible" role="alert">'+
			  '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
			  '<strong>Error!</strong> Your user profile could not be saved: '+err.error.message+'</div>');
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