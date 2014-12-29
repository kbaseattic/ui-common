/*
 *  Directives
 *
 *  These can be thought of as the 'widgets' on a page.
 *  Scope comes from the controllers.
 *
 */

angular.module('social-directives', []);
angular.module('social-directives')

.directive('socialuseroverview3', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            require(['kbaseuserprofilewidget'], function(userProfileWidget) {
                var widget = Object.create(userProfileWidget);
                widget.init({
                    container: $(ele),
                    userId: scope.params.userid,
                    token: scope.params.kbCache.token
                }).sync();

            });
        }
    };
})
.directive('socialuseroverview2', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
           
            var loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
            var loggedInName = $('<div></div>').kbaseLogin().get_kbase_cookie('name');
            var userId = scope.params.userid;

            // setup temporary panel
            if (!userId) {
                var p = $(ele).kbasePanel({
                    title: "User Profile"
                });
                $(p.body()).append("No user specified.");
            } else {
                var p = $(ele).kbasePanel({
                    title: userId
                })
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var isLoggedIn = false;


                // DATA
                // This is where we get the data to feed to the widget.
                // Each widget has its own independent data fetch.

                var userProfileServiceURL = 'http://dev19.berkeley.kbase.us/services/user_profile/rpc';
                var userProfile;

                if (scope.params.kbCache.token) {
                    userProfileClient = new UserProfile(userProfileServiceURL, {
                        token: scope.params.kbCache.token
                    });
                    isLoggedIn = true;
                } else {
                    userProfileClient = new UserProfile(userProfileServiceURL);
                }

                userProfileClient.get_user_profile([userId], function(data) {
                    var userOwnsProfile = false;
                    if (isLoggedIn) {
                        var loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
                        var loggedInName = $('<div></div>').kbaseLogin().get_kbase_cookie('name');
                        if (loggedInUserId === userId) {
                            userOwnsProfile = true;
                        }
                    }

                    var userProfile = data[0];

                    if (userProfile !== null) {
                        userProfile.env = {};
                        userProfile.env.isOwner = userOwnsProfile;
                        if (userOwnsProfile) {
                            $(ele).find('.panel-title').html('You - ' + loggedInName + ' (' + userId + ')');
                        } else {
                            $(ele).find('.panel-title').html(userProfile.user.realname + ' (' + userId + ')');
                        }
                        $(p.body()).KBaseUserOverview({
                            userInfo: userProfile,
                            userProfileClient: userProfileClient,
                            loggedInUserId: loggedInUserId,
                            userId: userId,
                            kbCache: scope.params.kbCache
                        });
                    } else {
                        // console.log('User not found getting user profile.');
                        //if (userOwnsProfile) {
                            if (userOwnsProfile) {
                                $(ele).find('.panel-title').html('You - ' + loggedInName + ' (' + userId + ')');
                            } else {
                                // $(ele).find('.panel-title').html('Real Name??' + ' (' + userId + ')');
                            }
                            $(p.body()).KBaseUserOverview({
                                container: $(ele),
                                userInfo: null,
                                userProfileClient: userProfileClient,
                                loggedInUserId: loggedInUserId,
                                userId: userId,
                                kbCache: scope.params.kbCache
                            });
                            
                        /*    $('[data-button="create-profile"]').on('click', function(e) {
                                var minimalProfile = {
                                    user: {
                                        username: userId,
                                        realname: loggedInName,
                                        thumbnail: null
                                    },
                                    profile: {
                                        title: "",
                                        suffix: "",
                                        location: "",
                                        email_addresses: []
                                    },
                                    isOwner: true
                                };
                                userProfileClient.set_user_profile({
                                    profile: minimalProfile
                                }, function(result) {
                                    console.log('Profile successfully saved.');
                                }, function(err) {
                                    console.log('Error saving profile');
                                    console.log(JSON.stringify(err));
                                });
                            });
*/
                        //} else {
                        //    $(ele).find('.panel-title').html('Profile not found for ' + userId);
                        //    $(p.body()).append('<p>No profile found for user ' + userId + '</p>');
                        //}

                    }

                }, function(err) {
                    console.log('Error getting user profile.');
                    console.log(err);
                    $(ele).find('.panel-title').html('Error getting profile');
                    $(p.body()).append('<p>Error getting profile: ' + err + '</p>');

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
                var p = $(ele).kbasePanel({
                    title: "KBase Power Ranking"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        var level = Math.floor((Math.random() * 10) + 1);
                        var color = "label-primary";
                        if (level > 7) {
                            color = "label-primary";
                        } else if (level > 4) {
                            color = "label-info";
                        } else {
                            color = "label-default";
                        }

                        var shareindex = (Math.random() * 20).toFixed(2);
                        var activityindex = (Math.random() * 20).toFixed(2);
                        var influenceindex = (Math.random() * 20).toFixed(2);

                        $(p.body()).append(
                            '<center><h2><span class="label ' + color + '">' +
                            '<span class="glyphicon glyphicon-star"></span> Level ' + level +
                            '</span> </h2>' +
                            '<br>Contributer Index:<br><strong>' + shareindex + '</strong><br>' +
                            '<br>Activity Index:<br><strong>' + activityindex + '</strong><br>' +
                            '<br>Influence Index:<br><strong>' + influenceindex + '</strong><br>' +
                            '</center>'
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
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })
    .directive('socialusercoding', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "User Coding"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        var level = Math.floor((Math.random() * 10) + 1);
                        var color = "label-primary";
                        if (level > 7) {
                            color = "label-primary";
                        } else if (level > 4) {
                            color = "label-info";
                        } else {
                            color = "label-default";
                        }

                        var shareindex = (Math.random() * 20).toFixed(2);
                        var activityindex = (Math.random() * 20).toFixed(2);
                        var influenceindex = (Math.random() * 20).toFixed(2);

                        $(p.body()).append(
                            '<table class="table" style="width:100%">' +
                            '<tr><td>GSP</td><td></td></tr>' +
                            '<tr><td>KBase</td><td><span class="glyphicon glyphicon-check"></span></td></tr>' +
                            '<tr><td>Role</td><td>developer</td></tr>' +
                            '</table>'
                        );
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })
    .directive('socialuserhistory', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Recent Activity"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();
                $(p.body()).KBaseUserRecentActivity({
                    // userInfo: data[0],
                    // wsUserInfoUrl: peopleWsUrl,
                    // wsUserInfoRef: userId + ":userinfo/info",
                    userId: userId,
                    kbCache: scope.params.kbCache
                });
            }
        };
    })
    .directive('socialusercollaborators', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Common Collaborator Network"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).KBaseUserCollaboratorNetwork({
                            userInfo: data[0],
                            wsUserInfoUrl: peopleWsUrl,
                            wsUserInfoRef: userId + ":userinfo/info",
                            kbCache: scope.params.kbCache
                        });
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })
    .directive('socialuserprojects', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Project Membership"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).KBaseUserProjectMembership({
                            userInfo: data[0],
                            wsUserInfoUrl: peopleWsUrl,
                            wsUserInfoRef: userId + ":userinfo/info",
                            kbCache: scope.params.kbCache
                        });
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })

.directive('socialuserpopularnarratives', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;

            // setup panel
            var p = $(ele).kbasePanel({
                title: "Popular Narratives"
            }) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();

            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {
                ws = new Workspace(peopleWsUrl, {
                    token: scope.params.kbCache.token
                });
            } else {
                ws = new Workspace(peopleWsUrl);
            }

            var objectIds = [{
                ref: userId + ":userinfo/info"
            }];
            ws.get_objects(objectIds,
                function(data) {
                    // create the widget if we found the data
                    $(p.body()).KBaseUserPopularNarratives({
                        userInfo: data[0],
                        wsUserInfoUrl: peopleWsUrl,
                        wsUserInfoRef: userId + ":userinfo/info",
                        kbCache: scope.params.kbCache
                    });
                },
                function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                    $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                });
        }
    };
})


.directive('socialusertopapps', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var userId = scope.params.userid;

            // setup panel
            var p = $(ele).kbasePanel({
                title: "Top Apps"
            }) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();

            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {
                ws = new Workspace(peopleWsUrl, {
                    token: scope.params.kbCache.token
                });
            } else {
                ws = new Workspace(peopleWsUrl);
            }

            var objectIds = [{
                ref: userId + ":userinfo/info"
            }];
            ws.get_objects(objectIds,
                function(data) {
                    // create the widget if we found the data
                    $(p.body()).append(
                        '' +
                        '<div class="list-group">' +
                        '<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#3 in the App Gallery</span>' +
                        '<strong>Ultimate Model Simulator</strong><br><small>Simulates anything, really.</small></a>' +
                        '<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#52 in the App Gallery</span>' +
                        '<strong>View Some Data</strong><br><small>Takes some data and view it.</small></a>' +
                        '<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#56 in the App Gallery</span>' +
                        '<strong>NCBI importer</strong><br><small>Imports stuff from NCBI to your workspace.</small></a>' +
                        '<a href="#/app/sampleapp" class="list-group-item"><span class="badge">#81 in the App Gallery</span>' +
                        '<strong>Generate List</strong><br><small>Convert some things to a list.</small></a>' +
                        '</div>' +
                        ''
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
                    $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                });
        }
    };
})

.directive('socialuserresourceusage', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Resource Usage"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).KBaseUserResourceUsage({
                            userInfo: data[0],
                            wsUserInfoUrl: peopleWsUrl,
                            wsUserInfoRef: userId + ":userinfo/info",
                            kbCache: scope.params.kbCache
                        });
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })
    .directive('socialuserpublications', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Publications"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).append("linked publications");
                        /*$(p.body()).KBaseUserOverview({
                                                    userInfo:data[0],
                                                    wsUserInfoUrl:peopleWsUrl,
                                                    wsUserInfoRef:userId+":userinfo/info",
                                                    kbCache:scope.params.kbCache
                                                });*/
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })

.directive('socialuserfollowing', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Following"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).append("some people");
                        /*$(p.body()).KBaseUserOverview({
                                                      userInfo:data[0],
                                                      wsUserInfoUrl:peopleWsUrl,
                                                      wsUserInfoRef:userId+":userinfo/info",
                                                      kbCache:scope.params.kbCache
                                                  });*/
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })
    .directive('socialuserfollowers', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
                var userId = scope.params.userid;

                // setup panel
                var p = $(ele).kbasePanel({
                    title: "Followers"
                }) /* ,rightLabel: "ws", subText: scope.userid}); */
                p.loading();

                // create ws client (because we need to go to the dev workspace)
                var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
                var ws;
                if (scope.params.kbCache.token) {
                    ws = new Workspace(peopleWsUrl, {
                        token: scope.params.kbCache.token
                    });
                } else {
                    ws = new Workspace(peopleWsUrl);
                }

                var objectIds = [{
                    ref: userId + ":userinfo/info"
                }];
                ws.get_objects(objectIds,
                    function(data) {
                        // create the widget if we found the data
                        $(p.body()).append("some people");
                        /*$(p.body()).KBaseUserOverview({
                                                    userInfo:data[0],
                                                    wsUserInfoUrl:peopleWsUrl,
                                                    wsUserInfoRef:userId+":userinfo/info",
                                                    kbCache:scope.params.kbCache
                                                });*/
                    },
                    function(err) {
                        // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                        $(p.body()).append("Not visible for user <i>" + userId + "</i>.");
                    });
            }
        };
    })

.directive('socialappoverview', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var appid = scope.params.appid;

            // setup panel
            var p = $(ele).kbasePanel({
                title: appid
            }) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();

            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {
                ws = new Workspace(peopleWsUrl, {
                    token: scope.params.kbCache.token
                });
            } else {
                ws = new Workspace(peopleWsUrl);
            }

            var objectIds = [{
                ref: "appdata/" + appid
            }];
            ws.get_objects(objectIds,
                function(data) {
                    // create the widget if we found the data
                    var appData = data[0]['data'];
                    $(ele).find(".panel-title").html(appData['name']);
                    $(p.body()).KBaseAppOverview({
                        appData: appData,
                        wsUserInfoUrl: peopleWsUrl,
                        appDataRef: "appdata/" + appid,
                        kbCache: scope.params.kbCache
                    });
                },
                function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                    $(p.body()).append("No app exists with id <i>" + appid + "</i>.");
                    console.error(err);
                });
        }
    };
})


.directive('socialappreviews', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var appid = scope.params.appid;

            // setup panel
            var p = $(ele).kbasePanel({
                title: "Reviews"
            }) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();

            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {
                ws = new Workspace(peopleWsUrl, {
                    token: scope.params.kbCache.token
                });
            } else {
                ws = new Workspace(peopleWsUrl);
            }

            var objectIds = [{
                ref: "appdata/" + appid
            }];
            ws.get_objects(objectIds,
                function(data) {
                    // create the widget if we found the data
                    var appData = data[0]['data'];
                    $(p.body()).KBaseAppReviews({
                        appName: appid,
                        appData: appData,
                        appRefs: data[0]['refs'],
                        wsUserInfoUrl: peopleWsUrl,
                        appDataRef: "appdata/" + appid,
                        kbCache: scope.params.kbCache
                    });
                },
                function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                    $(p.body()).append("No app exists with id <i>" + appid + "</i>.");
                    console.error(err);
                });
        }
    };
})

.directive('socialappusagestats', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var appid = scope.params.appid;

            // setup panel
            var p = $(ele).kbasePanel({
                title: "Usage Stats"
            }) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();

            // create ws client (because we need to go to the dev workspace)
            var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {
                ws = new Workspace(peopleWsUrl, {
                    token: scope.params.kbCache.token
                });
            } else {
                ws = new Workspace(peopleWsUrl);
            }

            var objectIds = [{
                ref: "appdata/" + appid
            }];
            ws.get_objects(objectIds,
                function(data) {
                    // create the widget if we found the data
                    var appData = data[0]['data'];
                    $(p.body()).KBaseAppUsageStats({
                        appData: appData,
                        wsUserInfoUrl: peopleWsUrl,
                        appDataRef: "appdata/" + appid,
                        kbCache: scope.params.kbCache
                    });
                },
                function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
                    $(p.body()).append("No app exists with id <i>" + appid + "</i>.");
                    console.error(err);
                });
        }
    };
})



;