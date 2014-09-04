
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
            var p = $(ele).kbasePanel({title: userId}) /* ,rightLabel: "ws", subText: scope.userid}); */
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
                    $(p.body()).append("gots some data");
                    console.log(data);
                    
                    // create the widget
                    // hack until search links directly to WS objects
                   // $(p.body()).KBaseGenomeOverview({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb,
                   //                                 loadingImage: "assets/img/ajax-loader.gif"});
                    
                    /*
			        for(var i = 0; i < data.length; i++) {
				    var depList = data[i]['data']['metadata']['data_dependencies'];
				    var niceName = data[i]['data']['metadata']['name'];
				    for(var k=0; k<depList.length; k++) {
				       var name = depList[k].trim().split(/\s+/)[1];
				        if (name) {
					    if (name == self.objName) {
						var objInfo = data[i]['info'];
						var savedate = new Date(objInfo[3]);
						var narName = '<a target="_blank" href="/narrative/ws.'+objInfo[6]+'.obj.'+objInfo[0]+'">'+niceName + "</a> ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+")";
					        self.narList.push({
						    name:narName,
						    details:"last edited by "+objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()
					        });
					        continue; // we found the narrative, no need to do anything else...
					    }
				        }
				    }
			        }
				if (self.narList.length > 0) {
				    // finally, render the table
				    self.renderTable();
				} else {
				    self.$elem.find('#loading-mssg').remove();
				    self.$elem.append("<br><b>There are no narratives that are using this data object.</b>");
				}*/
			       
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
                                                    type:"UserInfo.UserInfoSimple-0.1",
                                                    data:userInfoData,
                                                    provenance:[{description:"created by the KBase functional site"}]
                                                    };
                                                ws.save_objects({workspace:userId+":userinfo",objects:[newObjSaveData]},
                                                    function(data) {
                                                        // great, it worked.  let's just redirect to this page to refresh the elements...
                                                        $(p.body()).remove("#creatingloader");
                                                        console.log("created new user info");
                                                        console.log(data);
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
            
        }
    };
})


