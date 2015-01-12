/*
 *  Directives
 *
 *  These can be thought of as the 'widgets' on a page.
 *  Scope comes from the controllers.
 *
 */

angular.module('social-directives', []);
angular.module('social-directives')
.directive('socialuserprofile', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            require(['kbaseuserprofilewidget'], function(userProfileWidget) {
                var widget = Object.create(userProfileWidget);
                widget.init({
                    container: $(ele),
                    userId: scope.params.userid
                }).go();
            });
        }
    };
})
.directive('socialusersearch', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            require(['kbaseusersearch'], function(UserSearchWidget) {
              Object.create(UserSearchWidget).init({
                    container: $(ele),
                    userId: scope.params.userid
                }).go();
            });
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
              
              require(['kbaseuserrecentactivity'], function(RecentActivityWidget) {
                try {
                  var widget = Object.create(RecentActivityWidget);
                  widget.init({
                      container: $(ele),
                      userId: scope.params.userid,
                      authToken: scope.params.kbCache.token,
                      workspaceURL: scope.params.kbCache.ws_url
                  }).go();
                } catch (ex) {
                  $(ele).html('Error: ' + ex);
                }
              });
            }
        };
    })
    .directive('socialuserhistory', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
              
              require(['kbaseuserrecentactivity'], function(RecentActivityWidget) {
                try {
                  var widget = Object.create(RecentActivityWidget);
                  widget.init({
                      container: $(ele),
                      userId: scope.params.userid,
                      authToken: scope.params.kbCache.token,
                      workspaceURL: scope.params.kbCache.ws_url
                  }).go();
                } catch (ex) {
                  $(ele).html('Error: ' + ex);
                }
              });
            }
        };
    })
    .directive('socialbrowsenarratives', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
              
              require(['kbaseuserbrowsenarratives'], function(Widget) {
                try {
                  var widget = Object.create(Widget);
                  widget.init({
                      container: $(ele),
                      userId: scope.params.userid
                  }).go();
                } catch (ex) {
                  $(ele).html('Error: ' + ex);
                }
              });
            }
        };
    })
    
    .directive('socialusercollaborators', function($rootScope) {
      return {
          link: function(scope, ele, attrs) {
            
            require(['kbaseusercollaboratornetwork'], function(Widget) {
              try {
                var widget = Object.create(Widget);
                widget.init({
                    container: $(ele),
                    userId: scope.params.userid
                }).go();
              } catch (ex) {
                $(ele).html('Error: ' + ex);
              }
            });
          }
      };
    })
    
    .directive('socialusercollaboratorsx', function($rootScope) {
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