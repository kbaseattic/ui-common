/* global app:true */
'use strict';

var app = angular.module('kbaseStrawmanApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
  ]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.constant('AUTH_URL', 'https://kbase.us/services/authorization/Sessions/Login');
