'use strict';

app.controller('SearchCtrl', function ($scope) {
    $scope.startSearch = function() {
        console.log('searching for ' + $scope.searchquery);
    };
});