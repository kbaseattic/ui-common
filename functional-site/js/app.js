
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

var modules = [
    'ui.router',
    'about', 'status'
];
var app = angular.module('landing-pages', modules)
    .config(function ($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider) {

            // enable CORS
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // with some configuration, we can change this in the future.
            $locationProvider.html5Mode(false);
            
            $urlRouterProvider
                .when('', '/about')
                .when('/', '/about')
                .when('#', '/about');

            $urlRouterProvider.otherwise('/404/');

            $stateProvider.state("404",
                {
                    url: '*path',
                    templateUrl: 'views/404.html'
                });

        });
    
// app.run();

