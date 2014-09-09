
/*
 *  Directives
 *  
 *  These can be thought of as the 'widgets' on a page.  
 *  Scope comes from the controllers.
 *
*/

angular.module('social-directives', []);
angular.module('social-directives')

.directive('socialuseroverview', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
            var loggedInName   = $('<div></div>').kbaseLogin().get_kbase_cookie('name');
            var userId = scope.params.userid;
            
            // setup temporary panel
	    if(!userId) {
		var p = $(ele).kbasePanel({title: "User Profile"});
                $(p.body()).append("No user specified.");
	    } else {
		var p = $(ele).kbasePanel({title: userId})
		p.loading();
		
		// create ws client (because we need to go to the dev workspace)
		var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
		var ws;
		var isLoggedIn = false;
		if (scope.params.kbCache.token) {
		    ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token});
		    isLoggedIn = true;
		} else {
		    ws = new Workspace(peopleWsUrl);
		}
		
		//
		var objectIds = [{ref:userId+":userinfo/info"}];
		ws.get_objects(objectIds,
		    function(data) {
			var isYou = false;
			if (isLoggedIn) {
			    if (loggedInUserId === userId) {
				// is this really the only way to change the title?!?!  seems like we should extend the kbasepanel...
				$(ele).find(".panel-title").html("You - "+loggedInName + " ("+userId+")");
				isYou=true;
			    }
			}
			if (!isYou) {
			    $(ele).find(".panel-title").html( data[0]['data']['basic_personal_info']['real_name'] + " ("+userId+")");
			}
			$(p.body()).KBaseUserOverview({
					    userInfo:data[0],
					    wsUserInfoUrl:peopleWsUrl,
					    wsUserInfoRef:userId+":userinfo/info",
					    kbCache:scope.params.kbCache
					});
		    },
		    function(err) {
			// if we get an error, then no workspace or no profile exists (or is readable by this user...)
			console.log("Getting user info failed.");
			console.log(err);
			if (isLoggedIn) {
			    if (loggedInUserId === userId) {
				// is this really the only way to change the title?!?!  seems like we should extend the kbasepanel...
				$(ele).find(".panel-title").html("You - "+loggedInName + " ("+userId+")");
				
				$(p.body()).append(
				    $('<div id="createbtn">').append(
					$('<button type="button" class="btn btn-primary">Create Your Public KBase User Page</button>')
					    .bind("click", function() {
						$(p.body()).find("#createbtn").empty();
						$(p.body()).html('<div id="creatingloader"><p class="muted ajax-loader"> \
							<img src="assets/img/ajax-loader.gif"> ... initializing your User Page ...</p></div>');
						
						// define function to create the user data
						var createUserInfoDataObject = function () {
						    var userInfoData = {
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
						    var newObjSaveData = {
							name:"info",
							type:"UserInfo.UserInfoSimple",
							data:userInfoData,
							provenance:[{description:"created by the KBase functional site"}]
							};
						    ws.save_objects({workspace:userId+":userinfo",objects:[newObjSaveData]},
							function(data) {
							    // great, it worked.  let's just redirect to this page to refresh the elements...
							    $(p.body()).remove("#creatingloader");
							    location.reload();
							},
							function(err) {
							    $(p.body()).remove("#creatingloader");
							    $(p.body()).append("<p><b> Error: </b> Cannot create new user page for you.</p>");
							    $(p.body()).append("<p>"+err.error.message+"</p>");
							    // we couldn't create it- this is an error - probably the object or ws existed before and was deleted
							    console.log("couldn't create user info ");
							    console.log(err);
							});
						};
						var createWsParams = {workspace:userId+":userinfo", globalread:"r"}
						ws.create_workspace(createWsParams,
						    function(data) {
							// great, it worked. now create the object
							console.log("Created new ws");
							console.log(data);
							createUserInfoDataObject();
						    },
						    function(err) {
							// we couldn't create it- either it already exists (who cares..) or it was deleted in which case
							// we will get a later error...  try to create the object anyway...
							console.log("Couldn't create new ws: ");
							console.log(err);
							createUserInfoDataObject();
						    });
				})));
			    } else {
				$(p.body()).append("No visible information for user <i>"+userId+"</i>.");
			    }
			} else {
			    $(p.body()).append("No public information for user <i>"+userId+"</i>.");
			}
		    });
	    } // end else if (userId)
        }
    };
})


       
.directive('socialuserquickstats', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
            // setup panel
            var p = $(ele).kbasePanel({title: "KBase Power Ranking"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    var level = Math.floor((Math.random() * 10) + 1);
		    var color = "label-primary";
		    if (level>7) { color = "label-primary";
		    } else if (level>4) { color = "label-info";
		    } else { color = "label-default"; }
		    
		    $(p.body()).append(
				    '<center><h2><span class="label ' + color +'">'+
				    '<span class="glyphicon glyphicon-star"></span> Level ' + level +
				    '</span> </h2></center>'
				    );
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})
.directive('socialuserhistory', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
            // setup panel
            var p = $(ele).kbasePanel({title: "Recent Activity"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})
.directive('socialusercollaborators', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
	    
            // setup panel
            var p = $(ele).kbasePanel({title: "Common Collaborator Network"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
                    $(p.body()).KBaseUserCollaboratorNetwork({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})
.directive('socialuserprojects', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Project Membership"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})

.directive('socialuserpopularnarratives', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Popular Narratives"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})


.directive('socialusertopapps', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Top Apps"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})

.directive('socialuserresourceusage', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Resource Usage"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})
.directive('socialuserpublications', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Publications"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})

.directive('socialuserfollowing', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Following"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})
.directive('socialuserfollowers', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "Followers"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:userId+":userinfo/info"}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    $(p.body()).append("stuff");
                    /*$(p.body()).KBaseUserOverview({
                                        userInfo:data[0],
                                        wsUserInfoUrl:peopleWsUrl,
                                        wsUserInfoRef:userId+":userinfo/info",
                                        kbCache:scope.params.kbCache
                                    });*/
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("Not visible for user <i>"+userId+"</i>.");
		});
	}
    };
})


;

