(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseAppReviews",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
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
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","400px");
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
			    if (review[10]['rating'] && review[10]['review_text']) {
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
		    
		    validReviews.sort(function(a,b) {
			var x = new Date(a.date);
			var y = new Date(b.date);
			return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
		    });
		    
		    self.reviews.sortedAllReviews = validReviews;
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
			    '<a href="#" onclick="return false;" class="list-group-item" style="cursor:default;">' +
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
	    
	    //self.$mainPanel.append($ssPanel);
	},
	
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )