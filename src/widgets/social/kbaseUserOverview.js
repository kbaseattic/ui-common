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
		    self.wsUserInfoClient = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
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
    
    
	
    
	showInfoView: function() {
	    var self = this;
	    var $infoPanel = self.$elem.find("#info");
	    var pInfo = self.userInfoData['basic_personal_info'];
	    var $editButton;
	    if (self.isMe) {
		$editButton = $('<button type="button" class="btn btn-primary">Edit Info</button>');
	    }
	    var nameStr = "";
	    if (pInfo["title"]) { nameStr += pInfo["title"]; }
	    nameStr += pInfo["real_name"];
	    if (pInfo["suffix"]) { nameStr += pInfo["suffix"]; }
	    
	    var $header = $('<div class="row">')
				.append('<div class="col-md-9"><h2>'+nameStr+'</h2></div>')
				.append($('<div class="col-md-3">').css("text-align","right").append($editButton));
	    $infoPanel.append($header);
	   
	   /*$infoPanel.append(
		    
			'<div><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
			    'Title <span class="caret"></span>'+
			  '</button>'+
			'<ul class="dropdown-menu" role="menu">'+
			  '<li>Mr.</li><li>Ms.</li><li>Mrs.</li><li>Dr.</li><li>Prof.</li>'+
			'</ul></div>'+
		      
		      '<div class="input-group">'+
			'<input type="text" class="form-control">'+
			'<span class="input-group-addon">.00</span>'+
		      '</div>'+
		      
		      '<div class="input-group">'+
			'<span class="input-group-addon">$</span>'+
			'<input type="text" class="form-control">'+
			'<span class="input-group-addon">.00</span>'+
		      '</div>');
	   */
	   
	    
	   
	},
    
    
	setupPicture: function() {
	    var self = this;
	    var pic = '<center><img src="assets/images/nouserpic.png" width="95%"></center>';
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