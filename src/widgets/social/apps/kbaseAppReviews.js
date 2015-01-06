(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseAppReviews",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
	    appName:"",
            appData:null,
	    appRefs:[],
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
	    
            if (options.wsUserInfoUrl) {
		if (options.kbCache.token) {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {token: self.options.kbCache.token});
		    self.loggedIn = true;
		    self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
		} else {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl);
		    self.loggedIn = false;
		    self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
		}
            }
	    
	    // setup the alert panel
            self.$alertPanel = $("<div></div>");
	    self.$elem.append(self.$alertPanel);
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","600px");
	    self.$elem.append(self.$mainPanel);
	    
	    self.gatherReviews();
            self.render();
	    
	    return this;
	},
	
	
	
	reviews: null,
	
	gatherReviews: function() {
	    var self = this;
	    self.wsUserInfoClient.list_referencing_objects([{ref:self.options.appDataRef}],
		function(data) {
		    var objList = data[0];
		    
		    self.reviews = {
			myReview : null,
			allReviewsByUser : {},
			sortedAllReviews : []
		    };
		    
		    for(var k=0; k<objList.length; k++){
			var info = objList[k];
			//tuple<obj_id objid, obj_name name, type_string type,
			//timestamp save_date, int version, username saved_by,
			//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
			//object_info;
			if ((info[2].split("-")[0])!=="UserInfo.AppReview") {
			    continue;
			}
			if (self.reviews.allReviewsByUser[info[5]]) {
			    // if the review was more recent then the one we already have, then save it
			    if(self.reviews.allReviewsByUser[info[5]][3] < info[3]) {
				self.reviews.allReviewsByUser[info[5]] = info;
			    }
			} else {
			    self.reviews.allReviewsByUser[info[5]] = info;
			}
		    }
		    
		    
		    
		    // now we organize the valid reviews and compute stats
		    var validReviews = []; var totalStars = 0;
		    for (var r in self.reviews.allReviewsByUser) {
			// important check that this is objects own property 
			// not from prototype prop inherited
			if(self.reviews.allReviewsByUser.hasOwnProperty(r)) {
			    var review = self.reviews.allReviewsByUser[r];
			    if (review[10]['rating']) {
				if (!review[10]['review_text']) {
				    review[10]['review_text']="";
				}
				
				var packagedReview = {
				    reviewer : review[5],
				    timestamp: review[3],
				    review_text: review[10]['review_text'],
				    rating:Number(review[10]['rating'])
				};
				totalStars += Number(review[10]['rating']);
				validReviews.push(packagedReview);
				if (self.loggedIn) {
				    if (packagedReview['reviewer'] === self.loggedInUserId) {
					self.reviews.myReview = packagedReview;
				    }
				}
			    }
			}
		    }
		    
		    self.reviews.sortedAllReviews = validReviews;
		    self.reviews.sortedAllReviews.sort(function(a,b) {
			var x = new Date(a.timestamp);
			var y = new Date(b.timestamp);
			return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
		    });
		    self.reviews['avg_rating'] = totalStars/validReviews.length;
		    
		    //console.log(self.reviews);
		    self.render();
		},
		function(err) {
		    console.log("error");
		    console.log(err);
		    self.render();
		}
	    );
	    
	    
	},
	
	$addReviewPanel : null,
	
	render: function() {
	    var self = this;
	    self.$mainPanel.empty();
	    if (self.reviews) {
	    
		var $addReviewButton;
		
		if (self.loggedIn) {
		    $addReviewButton= $('<button type="button" class="btn btn-default">Review This App</button>');
		    $addReviewButton.click(function(e){
			e.preventDefault(); //to prevent standard click event
			$addReviewButton.hide();
			self.$addReviewPanel.show();
		    });
		} else {
		    $addReviewButton= $('<b>You must be logged in to review this App.</b>');
		}
		
	    
		var headerHtml = '';
		if (self.reviews.sortedAllReviews.length == 0) {
		    headerHtml = '<br>&nbsp&nbsp&nbsp&nbsp<h2 style="display:inline;"><strong>&nbsp&nbsp&nbspNo Reviews Yet!</strong></h2><br><br>';
		} else if(self.reviews.sortedAllReviews.length == 1) {
		    headerHtml = '<br>&nbsp&nbsp&nbsp&nbsp<h2 style="display:inline;">'+self.reviews['avg_rating']+' Stars</h2></strong> &nbsp out of 5, based on '+self.reviews.sortedAllReviews.length+' review';
		} else {
		    headerHtml = '<br>&nbsp&nbsp&nbsp&nbsp<h2 style="display:inline;"><strong>'+self.reviews['avg_rating']+' Stars</strong></h2> &nbsp out of 5, based on '+self.reviews.sortedAllReviews.length+' reviews<br><br>';
		}
	    
		var $summaryHeaderDiv = $('<div>').css("width","95%").append(
		    		        $('<div>').addClass("panel").addClass("panel-default").append(
					    $('<div>').addClass("row").append(
						$('<div>').addClass("col-md-8").append(headerHtml)
					    ).append(
						$('<div>').addClass("col-md-4").css("text-align","center").append("<br>").append($addReviewButton)
					    )
					)
		    		    );
		self.$mainPanel.append($summaryHeaderDiv);
	    
		var defaultStars = "4";
		var defaultComment = "";
		if(self.reviews.myReview) {
		    defaultComment = self.reviews.myReview['review_text'];
		    defaultStars = self.reviews.myReview['rating'];
		}
	    
		self.$addReviewPanel = $('<div>').css("width","95%").hide();
		if (self.loggedIn) {
		    var comments =
			'</div><div class="panel panel-default">'+
			    '<div class="panel-heading">'+
			      '<h3 class="panel-title">Add/Edit Your Review</h3>'+
			    '</div>'+
			    '<div class="panel-body">'+
			        '<div class="row">' +
				    '<div class="col-md-12"><div class="input-group">'+
				    '<span class="input-group-addon">Stars (1-5):</span>'+
					'<input id="stars" type="text" class="form-control" value="'+defaultStars+'"></input>'+
				    '</div></div>' +
				'</div>'+
				'<div class="row">' +
				    '<div class="col-md-12">'+
				      '<textarea id="comments" class="form-control" rows="2" style="resize:vertical;">'+defaultComment+'</textarea>' +
				    '</div>' +
				'</div>'+
				'<div class="row">' +
				    '<div class="col-md-12" style="text-align:right">'+
				      '<div class="btn-group">' +
					'<button id="submitreview" class="btn btn-default">Submit</button>' +
					'<button id="cancelreview" class="btn btn-default">Cancel</button>'
				      '</div'>
				    '</div>' +
				'</div>'+
			    '</div>';
		    self.$addReviewPanel.append(comments);
		}
		self.$addReviewPanel.find("#cancelreview").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    $addReviewButton.show();
		    self.$addReviewPanel.hide();
		});
		self.$addReviewPanel.find("#submitreview").click(function(e) {
		    var stars = self.$addReviewPanel.find("#stars").val().trim();
		    var starNum = parseInt(stars, 10);
		    if (isNaN(starNum)) {
			alert("The number of stars you give this app must be a valid number.");
			return;
		    }
		    if (starNum<1 || starNum>5) {
			alert("The number of stars you give this app must be a number between 1 and 5.");
			return;
		    }
		    var comment = self.$addReviewPanel.find("#comments").val().trim();
		    
		    if (starNum<=2 && !comment) {
			alert("You must provide a comment if you give an App only 1 or 2 stars.");
			return;
		    }
		    
		    var review = {
			app:self.options.appDataRef,
			rating:starNum,
			review_text:comment,
			user_id:self.loggedInUserId+":userinfo/info"
		    };
		    
		    // save to the WS
		    var newObjSaveData = {
			name:self.options.appName+".review",
			type:"UserInfo.AppReview",
			data:review,
			provenance:[{description:"created by the KBase functional site, edited by the user"}]
		    };
		    self.wsUserInfoClient.save_objects({workspace:self.loggedInUserId+":userinfo",objects:[newObjSaveData]},
			function(data) {
			    // great, it worked.  let's just redirect to this page to refresh the elements...
			   self.$alertPanel.append(
				'<div class="alert alert-success alert-dismissible" role="alert">'+
				  '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
				    '<strong>Success!</strong> Your review has been saved.</div>');
			    // refresh the reviews
			    self.gatherReviews();
			},
			function(err) {
			    // we couldn't create it- this is an error - probably the object or ws existed before and was deleted
			    self.$alertPanel.append(
				'<div class="alert alert-danger alert-dismissible" role="alert">'+
				  '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
				  '<strong>Error!</strong> Your review could not be saved.<br>This is probably because you do not have a public profile.  Create one '+
				  '<a href="#/people/'+self.loggedInUserId+'">here</a>.'+
				  '<br><br> The raw error was: '+err.error.message+'</div>');
			    console.log(err);
			});
		});
		self.$mainPanel.append(self.$addReviewPanel);
		
		
		// render the list of reviews
		var $reviewList = $('<div>').css("width","95%");
		if (self.reviews.sortedAllReviews.length>0) {
		    var $reviewListItemsContainer = $('<div class="list-group">');
		    
		    for(var r=0; r<self.reviews.sortedAllReviews.length; r++) {
			
			var d = new Date(self.reviews.sortedAllReviews[r]['timestamp']);
			
			var time = "";
			/*var minutes = d.getMinutes(); if (minutes<10) { minutes = "0"+minutes; }
			if (d.getHours()>=12) {
			    if(d.getHours()!=12) { time = (d.getHours()-12) + ":"+minutes+"pm"; }
			    else { time = "12:"+minutes+"pm"; }
			} else {
			    time = d.getHours() + ":"+minutes+"am";
			}
			time += " on " +self.monthLookup[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();*/
			time = self.monthLookup[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
			
			var stars = '';
			for(var s=0; s<5; s++) {
			    if(s<self.reviews.sortedAllReviews[r]['rating']) {
				stars += '<span class="glyphicon glyphicon-star" style="color:orange"></span>';
			    } else {
				stars += '<span class="glyphicon glyphicon-star" style="color:gray"></span>';
			    }
			}
			
			$reviewListItemsContainer.append(
			    '<a href="#/people/'+self.reviews.sortedAllReviews[r]['reviewer']+'" class="list-group-item">' +
			    '<div><h4 style="display:inline">'+stars+'&nbsp&nbsp&nbsp&nbsp'+self.reviews.sortedAllReviews[r]['reviewer']+'&nbsp&nbsp&nbsp&nbsp</h4><i>'+time+'</i></div>' +
			    '<div>'+self.reviews.sortedAllReviews[r]['review_text']+'</div>'+
			    '</a>'
			);
		    }
		    $reviewList.append($reviewListItemsContainer);
		} else {
		    $reviewList.append("<strong>No user reviews yet.  You should be the first!</strong>");
		}
		self.$mainPanel.append($reviewList);
		
	    }
	    else {
		self.$mainPanel.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>getting reviews...</center></p></div>');
	    }
	},
	
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )