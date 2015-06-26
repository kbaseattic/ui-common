

/*  Controllers
 *
 *  These are the 'glue' between models and views.
 *  See: https://docs.angularjs.org/guide/controller
 *
*/


app.controller('KBaseTables', function($scope, $stateParams) {
    $scope.tab = 'data';
    $scope.info = {type: $stateParams.type,
                   ws: $stateParams.ws,
                   name: $stateParams.name,
                   kind: $stateParams.type.split('.')[1]};

})
.controller('KBaseExamples', function($scope, $stateParams) {
    $scope.tab = "Narrative Examples";

    // order in which examples are dsiplayed
    $scope.typeOrder = ['KBaseSearch.GenomeSet',
                        'KBaseBiochem.Media',
                        'KBaseFBA.FBAModel',
                        'KBaseFBA.FBA',
                        'KBasePhenotypes.PhenotypeSet',
                        'KBasePhenotypes.PhenotypeSimulationSet']

    // example objects from KBaseExampleData
    kb.ws.list_objects({workspaces: ['KBaseExampleData']})
        .done(function(data){
            var examples = {}; // by type
            data.forEach(function(obj) {
                var type = obj[2].split('-')[0],
                    name = obj[1],
                    ws = obj[7];


                if (type in examples)
                    examples[type].push({obj: name, ws: ws});
                else
                    examples[type] = [{obj: name, ws: ws}];
            })

            $scope.$apply(function() {
                $scope.examples = examples;
            })
        })

    $scope.otherExamples =
        {'KBaseSearch.GenomeSet': [{ws: 'chenry:SingleGenomeNarrative', obj: 'Rhodobacter_Pangenome_Set'}],
         'KBaseBiochem.Media': [{ws: 'chenry:SingleGenomeNarrative', obj: 'QuantOptMedia-Acetoin'},
                                {ws: 'chenrydemo', obj: 'mediaexample'},
                                {ws: 'KBaseMedia', obj: 'PlantHeterotrophicMedia'}],
          'KBaseFBA.FBAModel': [{ws: 'nconrad:testObjects', obj: 'iBsu1103'},
                                {ws: 'PublishedFBAModels', obj: 'iJO1366'}],
          'KBasePhenotypes.PhenotypeSet': [{ws: 'chenrydemo', obj: 'testpheno'}],
          'KBasePhenotypes.PhenotypeSimulationSet': [{ ws: 'dejongh:COBRA2014', obj: 'Rsp-biolog.simulation'}]
        };
})



.controller('RxnDetail', function($scope, $stateParams) {
    $scope.ids = $stateParams.ids.split('&');
})

.controller('CpdDetail', function($scope, $stateParams) {
    $scope.ids = $stateParams.ids.split('&');
})


.controller('GenomeDetail', function($scope, $stateParams) {
    $scope.params = {'genomeID' : $stateParams.id,
                     'workspaceID' : $stateParams.ws,
                     'kbCache' : kb}
})

.controller('GeneDetail', function($scope, $stateParams) {
    $scope.params = {'genomeID' : $stateParams.gid,
                     'featureID' : $stateParams.fid,
                     'workspaceID' : $stateParams.ws,
                     'version' : $stateParams.ver,
                     'kbCache' : kb}
})


.controller('MediaDetail', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('ModelDetailCards', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('MemeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('CmonkeyDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('InferelatorDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('MAKDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'workspace': $stateParams.ws,
					 'kbCache' : kb};
})

.controller('FloatDataTable', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'workspace': $stateParams.ws,
					 'kbCache' : kb};
})

.controller('RegpreciseDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('BambiDetail', function($scope, $stateParams) {
    $scope.params = {'bambi_run_result_id': $stateParams.id,
                     'workspace_id': $stateParams.ws}
})

.controller('PPIDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
		     'ws': $stateParams.ws};
})

.controller('SpecDetail', function($scope, $stateParams) {
    $scope.params = {
        'kind' : $stateParams.kind,
        'id' : $stateParams.id
    };
})


.controller('GPTypeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id, 'ws':$stateParams.ws}
})

.controller('GTTypeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id, 'ws':$stateParams.ws}
})

.controller('GVTypeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id, 'ws':$stateParams.ws}
})

.controller('GGLTypeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id, 'ws':$stateParams.ws}
})

.controller('GTVTypeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id, 'ws':$stateParams.ws}
})


.controller('ModelDetail', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('ModelDetailCards', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('FBADetail', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('FBADetailCards', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('WSObjects', function($scope, $stateParams, $location) {
    var type = $location.path().match(/\/\w*\/*/g)[0]
             .replace('/','').replace('/','');

    $scope.type = type;
    $scope.ws = $stateParams.ws;
})

.controller('WsRefViewer', function($scope, $stateParams) {
    $scope.params = {
	'id': $stateParams.id,
	'ws':$stateParams.ws,
	'version':$stateParams.version,
        'kbCache' : kb }
})
.controller('WsRefUsersViewer', function($scope, $stateParams) {
    $scope.params = {
	'id': $stateParams.id,
	'ws':$stateParams.ws,
	'version':$stateParams.version,
        'kbCache' : kb }
})

.controller('WsObjGraphView', function($scope, $stateParams) {
    $scope.params = { 'ws':$stateParams.ws, 'kbCache' : kb }
})
.controller('WsObjGraphCenteredView', function($scope, $stateParams) {
    $scope.params = { 'ws':$stateParams.ws, 'id': $stateParams.id, 'kbCache' : kb }
})



.controller('Trees', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})


.controller('Taxonomy', function($scope, $stateParams) {
    $scope.params = {
	'taxonname': $stateParams.taxonname,
	'ws':$stateParams.ws,
        'kbCache' : kb }
})


.controller('WB', function($scope, $stateParams, $location) {
    $scope.ws = $stateParams.ws;
    $scope.type = $stateParams.type;

    $scope.nar_url = configJSON.narrative_url;

    var sub = $location.path().split('/')[1];

    if (sub == 'narratives') {
        $scope.tab = $location.path().split('/')[2];
    }

    $scope.showPreviousChanges = function() {
        $('#previous-changes').slideToggle();
    }

    $scope.hideSidebar = function(route) {
        $('#ws-sidebar').toggle('slide', {
                         direction: 'left',
                         duration: 'fast',
                             complete: function() {
                                $state.transitionTo(route,  {ws:ws, id:id})
                         }
                     })
    }

})


.controller('Login', function($scope, $stateParams, $location, kbaseLogin, $modal) {
    $scope.nar_url = configJSON.narrative_url; // used for links to narratives

    // callback for ng-click 'loginUser':
    $scope.loginUser = function (user) {
        $("#loading-indicator").show();

        kbaseLogin.login(
            user.username,
            user.password,
            function(args) {
                if (args.success === 1) {

                    this.registerLogin(args);
                    //this.data('_session', kbaseCookie);

                    //set the cookie
                    // var c = $("#login-widget").kbaseLogin('get_kbase_cookie');

                    // var cookieName = 'kbase_session';
                    // var cookieString = 'un=' + c.user_id +
                    //                    '|kbase_sessionid=' + c.kbase_sessionid +
                    //                    '|user_id=' + c.user_id +
                    //                    '|token=' + c.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g, 'PIPESIGN');
                    // $.cookie(cookieName, cookieString, { path: '/', domain: 'kbase.us', expires: 60 });
                    // $.cookie(cookieName, cookieString, { path: '/', expires: 60 });

                    //this.data('_session', c);

                    USER_ID = $("#signin-button").kbaseLogin('session').user_id;
                    USER_TOKEN = $("#signin-button").kbaseLogin('session').token;

                    //kb = new KBCacheClient(USER_TOKEN);
                    //kb.nar.ensure_home_project(USER_ID);

                    $location.path('/narratives/featured');
                    $scope.$apply();
                    window.location.reload();

                } else {
                    console.log("error logging in");
                    $("#loading-indicator").hide();
                    var errormsg = args.message;
                    if (errormsg == "LoginFailure: Authentication failed.") {
                        errormsg = "Login Failed: your username/password is incorrect.";
                    }
                    $("#login_error").html(errormsg);
                    $("#login_error").show();

                }

            }
        );
    };

    $scope.logoutUser = function() {
        kbaseLogin.logout(false);
    };

    $scope.loggedIn = function() {
        var c = kbaseLogin.get_kbase_cookie();
        $scope.username = c.name;
        return (c.user_id !== undefined && c.user_id !== null);
    };

})





.controller('WBLanding', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;

    $( "#sortable-landing" ).sortable({placeholder: "drag-placeholder",
        handle: '.panel-heading',
        cancel: '.panel-title,.panel-subtitle,.label,.glyphicon',
        start: function() {
          $(this).find('.panel-body').addClass('hide');
          $(this).sortable('refreshPositions');
        },
        stop: function() {
          $(this).find('.panel-body').removeClass('hide');
        }
    });

    //$( "#sortable-landing" ).disableSelection();
})


.controller('WBGeneLanding', function($scope, $stateParams) {

    $scope.ws = $stateParams.ws;
    $scope.fid = $stateParams.fid;
    $scope.gid = $stateParams.gid;

    if($scope.ws == "CDS" ) {
        $scope.ws = "KBasePublicGenomesV3";
    }
    if (!$scope.gid) {
        var temp = $scope.fid.split(".");
        if (temp.length>3) {
            $scope.gid = temp[0]+"."+temp[1];
        }
    }
    $scope.id = $scope.gid;

    $( "#sortable-landing" ).sortable({placeholder: "drag-placeholder",
        handle: '.panel-heading',
        cancel: '.panel-title,.panel-subtitle,.label,.glyphicon',
        start: function() {
          $(this).find('.panel-body').addClass('hide');
          $(this).sortable('refreshPositions');
        },
        stop: function() {
          $(this).find('.panel-body').removeClass('hide');
        }
    });

    //$( "#sortable-landing" ).disableSelection();
})



.controller('WBModelLanding', function($scope, $stateParams, $location) {

    var type = $location.path().split('/')[2];
    if (type == 'fbas') {
        type = "FBA";
    } else if (type == "models") {
        type = "Model";
    }

    $scope.type = type;
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
    $scope.selected = [{workspace: $scope.ws, name: $scope.id}]

    $scope.defaultMap = $stateParams.map;


    $( "#sortable-landing" ).sortable({placeholder: "drag-placeholder",
        handle: '.panel-heading',
        cancel: '.panel-title,.panel-subtitle,.label,.glyphicon',
        start: function() {
          $(this).find('.panel-body').addClass('hide');
          $(this).sortable('refreshPositions');
        },
        stop: function() {
          $(this).find('.panel-body').removeClass('hide');
        }
    });
})

.controller('WSManage', function($scope, $stateParams) {


})


.controller('WBJSON', function($scope, $stateParams) {
    $scope.ws = $stateParams.ws;
    $scope.id = $stateParams.id;
})

.controller('WBTour', function($scope, $state, $stateParams, $location) {
    $scope.ws = 'chenryExample';  // workspace to use for tour

    // if not logged in, prompt for login
    if (!USER_ID) {
        var signin_btn = $('#signin-button');
        signin_btn.popover({content: "You must login before taking the tour",
                            trigger: 'manual', placement: 'bottom'})
        signin_btn.popover('show');

    // otherwise, do the tour
    } else {
        function checkSomething() {
            $scope.checkedList.push([ 'kb|g.0.fbamdl', 'chenryExample', 'FBAModel-2.0' ]);
            $scope.$apply();
            $('.ncheck').eq(2).addClass('ncheck-checked');
        }

        var tour = [{element: '.btn-new-ws', text:'Create a new workspace here', placement: 'bottom'},
                    {element: '.btn-ws-settings', n: 2,
                        text:'Manage workspsace sharing and other settings, as \
                        well as clone and delete workspaces using the gear button.',
                        bVisible: true, time: 4000},
                    {element: '.obj-id', n: 2,
                        text: 'View data about the object, including visualizations and KBase widgets'},
                    {element: '.show-versions', n: 2, text: 'View the objects history.'},
                    {element: '.btn-show-info', n: 2,
                        text: 'View meta data,  download the objects, etc', bVisible: true},
                    {element: '.ncheck', n: 2, text: 'Select objects by using checkboxes<br> and see options appear above',
                        event: checkSomething},
                    {element: '.btn-table-settings', text: 'Show and hide columns and set other object table settings'},
                    {element: '.type-filter', text: 'Filter objects by type'},
                    {element: '.btn-delete-obj', text: 'Delete the objects selected in the table'},
                    {element: '.btn-mv-dd', text: 'Go ahead, copy your colleague\'s objects to your own workspace'},
                    {element: '.btn-rename-obj', text: 'Rename a selected object'},
                    {element: '.btn-trash', text: 'View the trash bin for this workspace.<br>  \
                                    Unreferenced objects will be deleted after 30 days.'}]

        function exit_callback() {
            $scope.$apply( $state.go('ws') );
        }

        new Tour({tour: tour, exit_callback: exit_callback});
    }
})


.controller('TreeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('PangenomeDetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('MSADetail', function($scope, $stateParams) {
    $scope.params = {'id': $stateParams.id,
                     'ws': $stateParams.ws};
})

.controller('KidlEdtDetail', function($scope, $stateParams) {
    $scope.params = {'type': $stateParams.type,
                     'mod': $stateParams.mod};
})
