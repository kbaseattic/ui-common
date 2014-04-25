'use strict';

app.controller('SearchCtrl', function ($scope) {
    $scope.startSearch = function() {
        return 'searching for ' + $scope.searchquery;
    };
});