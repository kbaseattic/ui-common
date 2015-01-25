
/*
 *  KBase "Functional Website"
 *
 *  Login, Workspace/Narrative Browser, Upload, Apps
 *
 *  Uses Angular.js
 *
 *  -- Some of the critical files --
 *  App:               js/app.js
 *  Controllers:       js/controllers.js
 *  Directives:        js/directives/landingpages.js
 *                     js/directives/*
 *
 *  Views (templates): views/*
 *
*/

var cardManager = undefined;

var app = angular.module('landing-pages',
    ['lp-directives',
     'card-directives',
     'trees-directives',
     'ws-directives',
     'modeling-directives',
     'communities-directives',
     'narrative-directives',
     'ui.router',
     'ngResource',
     'kbaseLogin',
     'ui.bootstrap',
     'search'])
    .config(['$locationProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider',
    function($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider) {

    // enable CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // with some configuration, we can change this in the future.
    $locationProvider.html5Mode(false);

    $stateProvider
        .state('login', {
          url: "/login/",
          templateUrl: 'views/login.html',
          controller: 'Login'
        });


    // narrative pages routing
    $stateProvider
        .state('narratives', {
          url: "/narratives/",
          templateUrl: 'views/ws/narratives.html',
          controller: 'WB'
        }).state('narratives.mynarratives', {
          url: "my-narratives",
          templateUrl: 'views/ws/narrative-table.html',
          controller: 'WB'
        }).state('narratives.shared', {
          url: "shared",
          templateUrl: 'views/ws/narrative-table.html',
          controller: 'WB'
        }).state('narratives.public', {
          url: "public",
          templateUrl: 'views/ws/narrative-table.html',
          controller: 'WB'
        }).state('narratives.featured', {
          url: "featured",
          templateUrl: 'views/ws/featured.html',
          controller: 'WB'
        })

    // workspace browser routing
    $stateProvider
        .state('ws', {
          url: "/ws/",
          templateUrl: 'views/ws/ws.html',
          controller: 'WB'
        }).state('ws.recent', {
          url: "recent",
          templateUrl: 'views/ws/recent.html',
          controller: 'WB'
        }).state('ws.id', {
          url: "objects/:ws?type",
          templateUrl: 'views/ws/objtable.html',
          controller: 'WB'
        }).state('ws.tour', {
          url: "tour/",
          templateUrl: 'views/ws/objtable.html',
          controller: 'WBTour'
        }).state('ws-manage', {
          url: "/ws/manage",
          templateUrl: 'views/ws/manage.html',
          controller: 'WSManage',
        });


    // revised output widget test page
    $stateProvider
        .state('test', {
          url: "/test/",
          templateUrl: 'views/test-landing.html',
          controller: 'KBaseExamples'
        }).state('landing', {
          url: "/test/:type/:ws/:name",
          templateUrl: 'views/test.html',
          controller: 'KBaseTables'
        })

    // model viewer routing
    $stateProvider
        .state('ws.mv', {
          url: "mv/",
          templateUrl: 'views/ws/mv.html',
        }).state('ws.mv.model', {
          url: "model/:ws/:id?fba",
          templateUrl: 'views/ws/model.html',
          reloadOnSearch: false,
        }).state('ws.mv.fba', {
          url: "fba/:ws/:id?fba",
          templateUrl: 'views/ws/data.html',
          reloadOnSearch: false
        }).state('ws.mv.maps', {
          url: "maps/:ws/:id/?fba",
          templateUrl: 'views/ws/maps.html',
          reloadOnSearch: false
        }).state('ws.mv.modeleditor', {
          url: "model-editor/:ws/:id/",
          templateUrl: 'views/ws/model-editor.html',
        });



    // workspace object landing pages
    $stateProvider
        .state('ws.models', {
          url: "models/:ws/:id?map",
          templateUrl: 'views/ws/sortable/model.html',
          controller: 'WBLanding',
        }).state('ws.fbas', {
          url: "fbas/:ws/:id",
          templateUrl: 'views/ws/sortable/fba.html',
          controller: 'WBLanding',
        }).state('ws.etc', {
          url: "etc/:ws/:id",
          templateUrl: 'views/ws/sortable/etc.html',
          controller: 'WBLanding'
        }).state('ws.genomes', {
          url: "genomes/:ws/:id",
          templateUrl: 'views/objects/genome.html',
          controller: 'WBLanding'
        }).state('ws.media', {
          url: "media/:ws/:id",
          templateUrl: 'views/ws/sortable/media.html',
          controller: 'WBLanding'
        }).state('ws.maps', {
          url: "maps/:ws/:id",
          templateUrl: 'views/ws/sortable/metabolic_map.html',
          controller: 'WBLanding'
        }).state('ws.provenance', {
          url: "provenance/:ws/:id",
          templateUrl: 'views/ws/provenance.html',
          controller: 'WBLanding'
        }).state('ws.json', {
          url: "json/:ws/:id",
          templateUrl: 'views/ws/json.html',
          controller: 'WBJSON'
        }).state('ws.pangenome', {
          url: "pangenome/:ws/:id",
          templateUrl: 'views/ws/sortable/pangenome.html',
          controller: 'WBLanding'
        }).state('ws.phenotype', {
          url: "phenotype/:ws/:id",
          templateUrl: 'views/ws/phenotype.html',
          controller: 'WBLanding'
        }).state('ws.promconstraint', {
          url: "promconstraint/:ws/:id",
          templateUrl: 'views/ws/promconstraint.html',
          controller: 'WBLanding'
        }).state('ws.regulome', {
          url: "regulome/:ws/:id",
          templateUrl: 'views/ws/regulome.html',
          controller: 'WBLanding'
        }).state('ws.expression_series', {
          url: "expression_series/:ws/:id",
          templateUrl: 'views/ws/expression_series.html',
          controller: 'WBLanding'
        }).state('ws.simulation', {
          url: "simulation/:ws/:id",
          templateUrl: 'views/ws/simulation.html',
          controller: 'WBLanding'
        });


    // communities pages
    $stateProvider
        .state('ws.metagenome', {
          url: "metagenome/:ws/:id",
          templateUrl: 'views/ws/objs/metagenome.html',
          controller: 'WBLanding'
        }).state('ws.collection', {
          url: "collection/:ws/:id",
          templateUrl: 'views/ws/objs/collection.html',
          controller: 'WBLanding'
        }).state('ws.profile', {
          url: "profile/:ws/:id",
          templateUrl: 'views/ws/objs/profile.html',
          controller: 'WBLanding'
        });

    // other pages
    $stateProvider
        .state('trees', {
          url: "/trees/",
          templateUrl: 'views/trees/trees.html',
          controller: 'Trees'
        });

    $stateProvider
        .state('rxns',
            {url:'/rxns',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('rxnsids', {
            url: "/rxns/:ids",
            templateUrl: 'views/objects/rxn.html',
            controller: 'RxnDetail'
        });

    $stateProvider
        .state('cpds',
            {url:'/cpds',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('cpdsids',
            {url:'/cpds/:ids',
             templateUrl: 'views/objects/cpd.html',
             controller: 'CpdDetail'
         });

    $stateProvider
        .state('models', {
             url: '/models',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('modelbyid', {
             url: '/models/:ws/:id',
             templateUrl: 'views/objects/model.html',
             controller: 'ModelDetail'});

    $stateProvider
       .state('gptype', {
            url: '/KBaseGwasData.GwasPopulation/:ws/:id',
            templateUrl: 'views/objects/gptype.html',
            controller: 'GPTypeDetail'})
       .state('gttype', {
            url: '/KBaseGwasData.GwasPopulationTrait/:ws/:id',
            templateUrl: 'views/objects/gttype.html',
            controller: 'GTTypeDetail'})
       .state('gvtype', {
            url: '/KBaseGwasData.GwasPopulationVariation/:ws/:id',
            templateUrl: 'views/objects/gvtype.html',
            controller: 'GVTypeDetail'})
       .state('ggltype', {
            url: '/KBaseGwasData.GwasGeneList/:ws/:id',
            templateUrl: 'views/objects/ggltype.html',
            controller: 'GGLTypeDetail'})
       .state('gpktype', {
            url: '/KBaseGwasData.GwasPopulationKinship/:ws/:id',
            templateUrl: 'views/objects/gpktype.html',
            controller: 'GGLTypeDetail'})
       .state('gtvtype', {
            url: '/KBaseGwasData.GwasTopVariations/:ws/:id',
            templateUrl: 'views/objects/gtvtype.html',
            controller: 'GTVTypeDetail'});


    $stateProvider
        .state('fbasbyws', {
                url:'/fbas/:ws',
                templateUrl: 'views/object-list.html',
                controller: 'WSObjects'})
        .state('fbabyid', {
                url: '/fbas/:ws/:id',
                templateUrl: 'views/objects/fba.html',
                controller: 'FBADetail'});

    $stateProvider
        .state('media',
            {url:'/media',
            templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('mediabyws',
            {url:'/media/:ws',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('mediabyid',
            {url:'/media/:ws/:id',
             templateUrl: 'views/objects/media.html',
             controller: 'MediaDetail'});

    // note: the previous handler for genomes/CDS/:id should simply be
    // handled by genomes/:ws/:id (treating CDS as the workspace name)
    $stateProvider
        .state('genomesbyws',
            {url: '/genomes/:ws',
             templateUrl: 'views/genomes/sortable-rows-landing-page.html',
             controller: 'WBLanding'})
        .state('genomesbyid',
            {url: '/genomes/:ws/:id',
      	     templateUrl: 'views/genomes/sortable-rows-landing-page.html',
             controller: 'WBLanding'})
        .state('kbgenomesbyws',
            {url: '/KBaseGenomes.Genome/:ws',
             templateUrl: 'views/genomes/sortable-rows-landing-page.html',
             controller: 'WBLanding'})
        .state('kbgenomesbyid',
            {url: '/KBaseGenomes.Genome/:ws/:id',
             templateUrl: 'views/genomes/sortable-rows-landing-page.html',
             controller: 'WBLanding'});


/*
OLD STYLE GENE LANDING PAGE WITH CARDS ARE NO LONGER USED...
    $stateProvider
        .state('genes',
            {url: '/genes/CDS/:fid',
             templateUrl: 'views/objects/gene.html',
             controller: 'GeneDetail'});

    $stateProvider
        .state('genesbycdsgenome',
            {url: '/genes/CDS/:gid/:fid',
             templateUrl: 'views/objects/gene.html',
             controller: 'GeneDetail'});

*/
/*
    $stateProvider
        .state('genesbyws',
            {url: '/genes/:ws/:fid',
             templateUrl: 'views/objects/gene.html',
             controller: 'GeneDetail'});

    $stateProvider
        .state('genesbywsgenome',
            {url: '/genes/:ws/:gid/:fid',
             templateUrl: 'views/objects/gene.html',
             controller: 'GeneDetail'});
*/

    $stateProvider
        .state('kbgenesbyws',
            {url: '/genes/:ws/:fid',
             templateUrl: 'views/genomes/sortable-rows-landing-page-genes.html',
             controller: 'WBGeneLanding'})
        .state('kbgenesbywsgenome',
            {url: '/genes/:ws/:gid/:fid',
             templateUrl: 'views/genomes/sortable-rows-landing-page-genes.html',
             controller: 'WBGeneLanding'})

    $stateProvider
        .state('meme',
            {url:'/meme',
             templateUrl: 'views/meme-list.html',
             controller: 'WSObjects'})
        .state('memebyws',
            {url: '/meme/:ws',
             templateUrl: 'views/meme-list.html',
             controller: 'WSObjects'})
        .state('memebyname',
            {url: '/meme/:ws/:id',
             templateUrl: 'views/objects/meme.html',
             controller: 'MemeDetail'});

    $stateProvider
        .state('cmonkeybyname',
            {url: '/cmonkey/:ws/:id',
             templateUrl: 'views/objects/cmonkey.html',
             controller: 'CmonkeyDetail'});

    $stateProvider
        .state('inferelator',
            {url: '/inferelator/:ws/:id',
             templateUrl: 'views/objects/inferelator.html',
             controller: 'InferelatorDetail'});

    $stateProvider
        .state('regprecise',
            {url: '/regprecise/:ws/:id',
             templateUrl: 'views/objects/regprecise.html',
             controller: 'RegpreciseDetail'});

    $stateProvider
        .state('mak',
            {url: '/mak/:ws/:id',
             // templateUrl: 'views/objects/mak.html',
			 templateUrl: 'views/genomes/sortable-rows-landing-page-bicluster.html',
             controller: 'MAKDetail'});

	$stateProvider
        .state('floatdatatable',
            {url: '/floatdatatable/:ws/:id',
             // templateUrl: 'views/objects/floatdatatable.html',
			 templateUrl: 'views/genomes/sortable-rows-landing-page-biclusterfloat.html',
             controller: 'FloatDataTable'});

    $stateProvider
        .state('spec',
            {url: '/spec/:kind/:id',
             templateUrl: 'views/objects/spec.html',
             controller: 'SpecDetail'});


    $stateProvider
        .state('wsref', {
          url: "/ref/:ws/:id",
          templateUrl: 'views/ws/ws-ref-list.html',
          controller: 'WsRefViewer'
        })
        .state('wsrefwithversion', {
          url: "/ref/:ws/:id/:version",
          templateUrl: 'views/ws/ws-ref-list.html',
          controller: 'WsRefViewer'
        })
        .state('wsrefusers', {
          url: "/refusers/:ws/:id",
          templateUrl: 'views/objects/ws-obj-ref-users.html',
          controller: 'WsRefUsersViewer'
        })
        .state('wsrefuserswithversion', {
          url: "/refusers/:ws/:id/:version",
          templateUrl: 'views/objects/ws-obj-ref-users.html',
          controller: 'WsRefUsersViewer'
        });


    $stateProvider
        .state('wsobjgraphview', {
          url: "/objgraphview/:ws",
          templateUrl: 'views/objects/ws-obj-graph-view.html',
          controller: 'WsObjGraphView'
        })
        .state('wsobjgraphcenteredview', {
          url: "/objgraphview/:ws/:id",
          templateUrl: 'views/objects/ws-obj-graph-centered-view.html',
          controller: 'WsObjGraphCenteredView'
        });

    $stateProvider
        .state('taxonomyoverview', {
          url: "/taxon/:taxonname",
          templateUrl: 'views/objects/taxonomy.html',
          controller: 'Taxonomy'
        })
        .state('taxonomyinws', {
          url: "/taxon/:taxonname/:ws",
          templateUrl: 'views/objects/taxonomy.html',
          controller: 'Taxonomy'
        });


    $stateProvider
        .state('bambibyid',
            {url: '/bambi/:ws/:id',
            templateUrl: 'views/objects/bambi.html',
             controller: 'BambiDetail'});

    $stateProvider
	.state('ppid',
	   {url: '/ppid/:ws/:id',
	    templateUrl: 'views/objects/ppid.html',
	    controller: 'PPIDetail'});

    $stateProvider
    	.state('tree',
    		{url: '/tree/:ws/:id',
    		templateUrl: 'views/objects/tree.html',
    		controller: 'TreeDetail'});

    $stateProvider
	.state('pangenome',
		{url: '/pangenome/:ws/:id',
		templateUrl: 'views/objects/pangenome.html',
		controller: 'PangenomeDetail'});

    $stateProvider
	.state('msa',
		{url: '/msa/:ws/:id',
		templateUrl: 'views/objects/msa.html',
		controller: 'MSADetail'});

    $stateProvider
	.state('kidledttype',
		{url: '/kidledt/:mod/:type',
		templateUrl: 'views/objects/kidledt.html',
		controller: 'KidlEdtDetail'});

    $stateProvider
	.state('kidledtmod',
		{url: '/kidledt/:mod',
		templateUrl: 'views/objects/kidledt.html',
		controller: 'KidlEdtDetail'});

    $urlRouterProvider.when('', '/login/')
                      .when('/', '/login/')
                      .when('#', '/login/');

    $urlRouterProvider.otherwise('/404/');

    $stateProvider.state("404",
            {url: '*path',
             templateUrl : 'views/404.html'});

}]);



app.service('userState', function userStateService() {
    var _userData = {"token": null,
                     "activeNarrative": null,
                     "lastNarrative": null,
                     "activeWorkspace": null,
                     "loggedIn": false,
                     "user_id": null
                    };

    if (!localStorage.hasOwnProperty("KBaseUserState")) {
        localStorage.setItem("KBaseUserState", JSON.stringify(_userData));
    }

    for (var p in _userData) {
        if (_userData.hasOwnProperty(p) && !localStorage.KBaseUserState.hasOwnProperty(p)) {
            localStorage.KBaseUserState[p] = _userData[p];
        }
    }

    return {
        userState : JSON.parse(localStorage.KBaseUserState),
        landingPages : JSON.parse("landing_pages.json"),

        reset : function() {
            this.userState = JSON.parse(localStorage.KBaseUserState);
        }
    };
});


//add the login widget as a module
var kbaseLogin = angular.module('kbaseLogin', []);
kbaseLogin.factory('kbaseLogin', function() {
  return $('#signin-button').kbaseLogin(); // assumes underscore has already been loaded on the page
});

//add the Google Feeds API as a module
/*
var Feed = angular.module('FeedLoad', ['ngResource'])
    .factory('FeedLoad', function ($resource) {
        return $resource('//ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
        });
    });
*/

configJSON = $.parseJSON( $.ajax({url: "config.json",
                             async: false,
                             dataType: 'json'}).responseText );




app.run(function ($rootScope, $state, $stateParams, $location) {

    //  Things that need to happen when a view changes.
    $rootScope.$on('$locationChangeStart', function(event) {
        var absUrl = $location.absUrl();
        var begin = absUrl.indexOf('/functional-site/');
        var offset = '/functional-site/'.length;

        if (absUrl.indexOf('/functional-site/#/') < 0 && begin > 0 && absUrl.length > begin + offset) {
            event.preventDefault();
            $state.go('404', null, {location: false});
        }
    });


    //  Things that need to happen when a view changes.
    $rootScope.$on('$stateChangeSuccess', function() {
        $('body').not('#project-table tr').unbind('click');
        $('.fixedHeader').remove();
        $('.popover').remove(); // remove any dangling pop overs
        removeCards();
    });


    var finish_login = function(result) {
        if (!result.success)
            return;

//        var c = $('#signin-button').kbaseLogin('get_kbase_cookie');
//        set_cookie(c);

        // If we're changing state from the login page, and we have a valid
        // session (i.e.: we're logging IN and not OUT), then forward us to
        // the /narrative/ state.
        //
        // Otherwise, just login in place and reload.
        // We need to reload to make sure the USER_ID and USER_TOKEN get set properly.
        if ($location.path() === '/login/') {
            var kbase_sessionid = $("#signin-button").kbaseLogin('session').kbase_sessionid;
            if (kbase_sessionid) {
                // USER_ID = $("#signin-button").kbaseLogin('session').user_id;
                // USER_TOKEN = $("#signin-button").kbaseLogin('session').token;
                $location.path('/narratives/featured');
            }
            $rootScope.$apply();
        }
        window.location.reload();
    };

    var finish_logout = function() {
        $location.path('/login/');
//        $rootScope.$apply();
        window.location.reload();
    };

    // sign in button
    $('#signin-button').kbaseLogin({login_callback: finish_login,
                                    logout_callback: finish_logout});
    $('#signin-button').css('padding', '0');

    // not under rootscope for kbase widgets
    USER_ID = $("#signin-button").kbaseLogin('session').user_id;
    USER_TOKEN = $("#signin-button").kbaseLogin('session').token;

    kb = new KBCacheClient(USER_TOKEN);

    $rootScope.USER_ID = (typeof USER_ID == 'undefined' ? false : USER_ID);
    $rootScope.USER_TOKEN = USER_TOKEN;

    // global state object to store state
    state = new State();

    // Critical: used for navigation urls and highlighting
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.kb = kb;
    $rootScope.Object = Object;

});


/*
 *   landing page app helper functions
 */
function get_selected_ws() {
    if (state.get('selected')) {
        return state.get('selected')[0];
    }
}


function removeCards() {
    if (cardManager)
        cardManager.closeAllCards();
}


// function set_cookie(c) {
//     var cookieName = 'kbase_session';
//     if (c.kbase_sessionid) {
//         var cookieString = 'un=' + c.user_id +
//                            '|kbase_sessionid=' + c.kbase_sessionid +
//                            '|user_id=' + c.user_id +
//                            '|token=' + c.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g, 'PIPESIGN');
//         $.cookie(cookieName, cookieString, { path: '/', domain: 'kbase.us', expires: 60 });
//         $.cookie(cookieName, cookieString, { path: '/', expires: 60 });
//     }
//     else {
//         $.removeCookie(cookieName, { path: '/', domain: 'kbase.us' });
//         $.removeCookie(cookieName, { path: '/' });
//     }
// };




/*
 *  Object to store state in local storage.  We should use this.
 */
function State() {
    // Adapted from here: http://diveintohtml5.info/storage.html
    var ls;
    try {
        ls = 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        ls = false;
    }

    //var user = (auth.isLoggedIn() ? auth.getUserData().user_id : 'public');

    this.get = function(key) {
        if (!ls) {
            return null;
        }

        //key = user + '.' + key;

        var val = localStorage.getItem(key);

        try {
            val = JSON.parse(val);
        } catch(e) {
            return null;
        };

        return val;
    };

    this.set = function(key, val) {
        if (!ls) {
            return null;
        }

        //key = user + '.' + key;

        try {
            val = JSON.stringify(val);
        } catch(e) {
            return null;
        }

        return localStorage.setItem(key, val);
    };
}



/*!
 * jQuery Browser Plugin v0.0.5
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2013 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 2013-07-29T17:23:27-07:00
 */
(function( jQuery, window, undefined ) {
"use strict";

var matched, browser;

jQuery.uaMatch = function( ua ) {
  ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
                /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

        var platform_match = /(ipad)/.exec( ua ) ||
                /(iphone)/.exec( ua ) ||
                /(android)/.exec( ua ) ||
                /(windows phone)/.exec(ua) ||
                /(win)/.exec( ua ) ||
                /(mac)/.exec( ua ) ||
                /(linux)/.exec( ua ) ||
                [];

        return {
                browser: match[ 3 ] || match[ 1 ] || "",
                version: match[ 2 ] || "0",
                platform: platform_match[0] || ""
        };
};

matched = jQuery.uaMatch( window.navigator.userAgent );
browser = {};

if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    browser.versionNumber = parseInt(matched.version);
}

if ( matched.platform ) {
        browser[ matched.platform ] = true;
}

// Chrome, Opera 15+ and Safari are webkit based browsers
if ( browser.chrome || browser.opr || browser.safari ) {
        browser.webkit = true;
}

// IE11 has a new token so we will assign it msie to avoid breaking changes
if ( browser.rv )
{
        var ie = 'msie';

        matched.browser = ie;
        browser[ie] = true;
}

// Opera 15+ are identified as opr
if ( browser.opr )
{
        var opera = 'opera';

        matched.browser = opera;
        browser[opera] = true;
}

// Stock Android browsers are marked as safari on Android.
if ( browser.safari && browser.android )
{
        var android = 'android';

        matched.browser = android;
        browser[android] = true;
}

// Assign the name and platform variable
browser.name = matched.browser;
browser.platform = matched.platform;


jQuery.browser = browser;

})( jQuery, window );

