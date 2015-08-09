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
            self.$mainPanel = $("<div></div>").css("overflow","auto");
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
	    
	    var $header = $('<div>').addClass("row").css("width","95%");
	    
	    var $basicInfo = $('<div>').addClass("col-md-8");
	    $basicInfo.append('<div><strong>Version: </strong>&nbsp&nbsp'+ad['version']+"</div>");
	    $basicInfo.append('<div><strong>Release Date: </strong>&nbsp&nbsp'+ad['release_date']+"</div>");
	    var $authors = $('<div>');
	    for(var k=0; k<ad['author_user_ids'].length; k++) {
		if (k==0) {
		    $authors.append('<strong>Authors: </strong>&nbsp&nbsp<a href="#/people/'+ad['author_user_ids'][k]+'">'+ad['author_user_ids'][k]+"</a>");
		} else {
		    $authors.append(', <a href="#/people/'+ad['author_user_ids'][k]+'">'+ad['author_user_ids'][k]+"</a>");
		}
	    }
	    $basicInfo.append($authors);
	    $basicInfo.append('<div><strong>Description: </strong>&nbsp&nbsp'+ad['description']+"</div>");
	    
	    
	    $basicInfo.append('<br><div><strong>Input Types: </strong>&nbsp&nbspKBaseGenomes.Genome</div>');
	    $basicInfo.append('<div><strong>Output Types: </strong>&nbsp&nbspKBaseTrees.Tree</div>');
	    
	    var $topButtons = $('<div>').addClass("col-md-4").css("text-align","right").append(
				      '<div>' +
					'<h4><span class="label label-primary">#18 in the App Gallery</span></h4>' +
				      '</div>'
				    ).append(
				      '<div class="btn-group">' +
					'<button id="saveapp" class="btn btn-default">Save to Favorites</button>' +
					'<button id="launchapp" class="btn btn-default">Launch in New Narrative</button>' +
				      '</div>'  
				    );
	    
	    $topButtons.find("#saveapp").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This button should save/install this App so it can be found easily in the Narrative list of functions for the user.");
		});
	    $topButtons.find("#launchapp").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This should create a new narrative populated with this App.");
		});
	    
	    $header.append($basicInfo);
	    $header.append($topButtons);
	    
	    
	    
	    self.$mainPanel.append($header);
	    
	    var imgHtml = "";
	    if (ad['name'] === 'Sample App') {
		imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="assets/images/social/sample_app11.png" width="100%">' +
			'</div></td>';
		imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="assets/images/social/sample_app12.png" width="100%">' +
			'</div></td>';
		imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="assets/images/social/sample_app13.png" width="100%">' +
			'</div></td>';
		imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="assets/images/social/sample_app14.png" width="100%">' +
			'</div></td>';
		imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="assets/images/social/sample_app15.png" width="100%">' +
			'</div></td>';
	    } else {
		for (var p=0; p<8; p++) {
		    imgHtml += '<td style="padding:10px;"><div style="background-color: gray; border: 1px solid black; padding-left:25px; padding-top:25px; width: 250px; height:250px;">'+
			'<br><h3>No Screenshot Available</h3>' +
			'</div></td>';
		}
	    }
	    
	    
	    var $ssPanel = $("<div>").append(
		'<br><br><div style="width:95%;overflow:auto;">'+
		    '<table style="border:0px;"><tr>'+
		    imgHtml +
		    '</tr></table>'+
		'</div>'
	    );
	   
	    self.$mainPanel.append($ssPanel);
	}

    });
})( jQuery )