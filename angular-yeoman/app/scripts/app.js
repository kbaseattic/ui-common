/* global app:true */
'use strict';

var app = angular.module('kbaseStrawmanApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.router'
]);

app.config(function ($urlRouterProvider, $stateProvider) {
    $stateProvider
    .state('/', {
        url: '',
        templateUrl: '/views/loginMain.html',
        controller: 'AuthCtrl'
    })
    .state('/#/', {
        url: '/',
        templateUrl: '/views/loginMain.html',
        controller: 'AuthCtrl'
    })
    .state('login', {
        url: '/login/',
        templateUrl: '/views/loginMain.html',
        controller: 'AuthCtrl'
    })
    .state('newsfeed', {
        url: '/newsfeed/',
        templateUrl: '/views/newsfeed.html',
        controller: 'NewsfeedCtrl'
    });

    $urlRouterProvider.otherwise('/');
})
.constant('AUTH_URL', 'https://kbase.us/services/authorization/Sessions/Login');
