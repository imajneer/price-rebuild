angular.module('app.filtersCtrl', ['app.services','ngLodash','truncate','ngCordova'])

.controller('filtersCtrl',function($scope,$state,$rootScope) {
    $rootScope.filter = []
    $scope.applyFilters = function() {
        $rootScope.min_price = 0 //$scope.slider.min;
        $rootScope.max_price = 500 //$scope.slider.max;
        $rootScope.colors = []
        console.log($rootScope.filter.colors )
        // Colors
        for(var color in $rootScope.filter.colors){
          if($rootScope.filter.colors[color])
            $rootScope.colors.push(color)
        }

        
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
            step: 5,
            translate: function(value) {
              return '$' + value;
            }
        }
    };
    $rootScope.min_price = 5;
    $rootScope.max_price = 1000;

})

.controller('colorCtrl',function($scope,$rootScope) {
  $rootScope.filter.colors = []
})

.controller('catCtrl',function($scope,$rootScope) {

})

.controller('sizeCtrl',function($scope,$rootScope) {

})

.controller('condCtrl',function($scope,$rootScope) {
  $rootScope.filter.condition = []
})
