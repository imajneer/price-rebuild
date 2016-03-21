angular.module('app.filtersCtrl', ['app.services','ngLodash','truncate','ngCordova'])

.controller('filtersCtrl',function($scope,$state,$rootScope) {
    $rootScope.filter = angular.isDefined($rootScope.filter) ? $rootScope.filter : {
      colors: [],
      condition: []
    }
    $rootScope.filterGender = 'male'
    // $rootScope.filterGender = angular.isDefined($rootScope.filterGender) ? $rootScope.filterGender : $rootScope.currentGender

    console.log('filtersCtrl.....')
    $scope.applyFilters = function() {
      console.log('Applying filters....')
        $rootScope.min_price = 0 //$scope.slider.min;
        $rootScope.max_price = 500 //$scope.slider.max;
        $rootScope.colors = []
        console.log($rootScope.filter )
        console.log($rootScope.filterGender)
        // Colors
        for(var color in $rootScope.filter.colors){
          if($rootScope.filter.colors[color])
            $rootScope.colors.push(color)
        }

        // Condition
        $rootScope.condition = []
        for(var cond in $rootScope.filter.condition){
          if($rootScope.filter.condition[cond])
            $rootScope.condition.push(cond)
        }

        // currentGender
        $rootScope.currentGender = $rootScope.filterGender

        console.log('-=-=-=-=')
        console.log($rootScope.currentGender);

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
  // $rootScope.filter.colors = []
  console.log('colorCtrl');
  console.log($rootScope.filter)
})

.controller('catCtrl',function($scope,$rootScope) {

})

.controller('sizeCtrl',function($scope,$rootScope) {

})

.controller('condCtrl',function($scope,$rootScope) {
  // $rootScope.filter.condition = []
  console.log('condCtrl...');
  console.log($rootScope.filter)
})
.controller('genderCtrl',function($scope,$rootScope) {
  console.log('--0-0-0-0-00-0-0')
  // $rootScope.filter.filterGender = 'male'
  // $rootScope.filter.filterGender = angular.isDefined($rootScope.currentGender) ? $rootScope.currentGender : 'male'
})
