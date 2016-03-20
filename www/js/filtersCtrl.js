angular.module('app.filterCtrls', ['app.services','ngLodash','truncate','ngCordova'])

.controller('filterCtrl',function($scope,$state,$rootScope) {
    
    $scope.applyFilters = function() {
        $rootScope.min_price = $scope.slider.min;
        $rootScope.max_price = $scope.slider.max;
        $state.go($rootScope.previousState);
        $rootScope.refresh();
    }

    $scope.cancelFilters = function() {
        $scope.slider.min = $rootScope.min_price;
        $scope.slider.max = $rootScope.max_price;
        $state.go($rootScope.previousState);
    }


})

.controller('priceCtrl',function($scope,$rootScope) {
		    $scope.selectColor = function(color) {
    }
    $scope.slider = {
        min: 5,
        max: 1000,
        options: {
            floor: 5,
            ceil: 1000,
            step: 5
        }
    };
    $rootScope.min_price = 5;
    $rootScope.max_price = 1000;
    
})

.controller('colorCtrl',function($scope,$rootScope) {
		
})

.controller('catCtrl',function($scope,$rootScope) {
		
})

.controller('sizeCtrl',function($scope,$rootScope) {
		
})

.controller('condCtrl',function($scope,$rootScope) {
		
})
