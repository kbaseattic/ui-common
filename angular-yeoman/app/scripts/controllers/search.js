'use strict';

app.controller('SearchCtrl', function ($scope) {
    $scope.startSearch = function() {
        console.log($scope.searchquery);
        return 'searching for ' + $scope.searchquery;
    };
});