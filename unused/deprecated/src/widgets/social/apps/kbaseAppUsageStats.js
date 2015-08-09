(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseAppUsageStats",
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
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","600px");;
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
	    
	    var $display = $('<div>').css("width","95%");
	    
	    $display.append('<div><h4><strong>This App was run <span class="label label-primary">'+ad.usage.n_times_run+'</span> times.</h4></strong></div>');
	    
	    $display.append('<br><div><h4><strong>This App was installed & saved by <span class="label label-primary">'+ad.usage.n_users_installed+'</span> users.</h4></strong></div>');
	   
	   
	    $display.append('<br><br><div><strong>Most users ran these apps before running this app:</h4></strong></div>');
	    $display.append('<div class="list-group">'+
				'<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#3 in the App Gallery</span>'+
				    '<strong>Ultimate Model Simulator</strong><br><small>Simulates anything, really.</small></a>'+
				'<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#56 in the App Gallery</span>'+
				    '<strong>NCBI importer</strong><br><small>Imports stuff from NCBI to your workspace.</small></a>'+
				'</div>'
			    );
	    
	    $display.append('<div><strong>Most users ran these apps after running this app:</h4></strong></div>');
	    $display.append('<div class="list-group">'+
				'<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#52 in the App Gallery</span>'+
				    '<strong>View Some Data</strong><br><small>Takes some data and view it.</small></a>'+
				'</div>'
			    );
	   
	    $display.append('<div><strong>If you like this app, you might also like:</h4></strong></div>');
	    $display.append('<div class="list-group">'+
				'<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#35 in the App Gallery</span>'+
				    '<strong>Some Related App</strong><br><small>Does something related.</small></a>'+
				'<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#79 in the App Gallery</span>'+
				    '<strong>An Alternative App</strong><br><small>It can completely replace this app, for sure.</small></a>'+
				'</div>'
			    );
	   
	    self.$mainPanel.append($display);
	}

    });
})( jQuery )