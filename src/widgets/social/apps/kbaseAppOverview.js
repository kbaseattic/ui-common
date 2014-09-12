(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseAppOverview",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            appData:null,
	    wsUserInfoUrl:"https://dev04.berkeley.kbase.us:7058",
	    appDataRef:"",
            kbCache:{},
        },
	
	wsUserInfoClient:null,
	loggedIn:false,
	loggedInUserId:null,
	userInfoData:null,
	isMe:false,
	
	$alertPanel:null,
	$mainPanel:null,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    
	    console.log(options.appData);
	    
            if (options.wsUserInfoUrl) {
		if (options.kbCache.token) {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {token: self.options.kbCache.token});
		    self.loggedIn = true;
		    self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');;
		}
            }
	    
	    // setup the alert panel
            self.$alertPanel = $("<div></div>");
	    self.$elem.append(self.$alertPanel);
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","400px");
	    self.$elem.append(self.$mainPanel);
	    
           self.render();
	    
	    return this;
	},
 /*	 "name":"Sample App",
	 "ver"
    "author_user_ids":["msneddon","wstester3"],
    "description":"This is a sample app that does some things and performs some analysis by calling some services.",
    "src_code_url":"https://github.com/kbase/narrative",
    "rank":44,
    "usage":{
        "n_users_installed": 138,
        "n_times_run":23857
    },
    "screenshots":[],
    "exampleNarratives":[]*/
	
	render: function() {
	    var self = this;
	    var ad = self.options.appData;
	    
	    var $header = $('<div>');
	    $header.append('<div><strong>Version: </strong>&nbsp&nbsp'+ad['version']+"</div>");
	    $header.append('<div><strong>Release Date: </strong>&nbsp&nbsp'+ad['release_date']+"</div>");
	    
	    var $authors = $('<div>');
	    for(var k=0; k<ad['author_user_ids'].length; k++) {
		if (k==0) {
		    $authors.append('<strong>Authors: </strong>&nbsp&nbsp<a href="#/people/'+ad['author_user_ids'][k]+'">'+ad['author_user_ids'][k]+"</a>");
		} else {
		    $authors.append(', <a href="#/people/'+ad['author_user_ids'][k]+'">'+ad['author_user_ids'][k]+"</a>");
		}
	    }
	    $header.append($authors);
	    
	    $header.append('<div><strong>Description: </strong>&nbsp&nbsp'+ad['description']+"</div>");
	    
	    self.$mainPanel.append($header);
	    
	    
	    var $ssPanel = $("<div>").append(
		'<br><br><div class="row" style="width:85%">'+
		    '<div class="col-md-3"><div style="background-color: gray; border: 1px solid black; padding-left:25px; padding-top:25px; width: 250px; height:250px;">'+
		    '<br><h3>No Screenshot Available</h3>' +
		    '</div></div>' +
		    
		    '<div class="col-md-3"><div style="background-color: gray; border: 1px solid black; padding-left:25px; padding-top:25px; width: 250px; height:250px;">'+
		    '<br><h3>No Screenshot Available</h3>' +
		    '</div></div>' +
		    
		    '<div class="col-md-3"><div style="background-color: gray; border: 1px solid black; padding-left:25px; padding-top:25px; width: 250px; height:250px;">'+
		    '<br><h3>No Screenshot Available</h3>' +
		    '</div></div>' +
		    
		    '<div class="col-md-3"></div>'+
		'</div>'
	    );
	   
	    self.$mainPanel.append($ssPanel);
	}

    });
})( jQuery )