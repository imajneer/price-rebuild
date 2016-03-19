angular.module('app.directives', ['app.controllers'])

.directive('prProductView', function (productViewCtrl) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'         },
        templateUrl: 'productFeed.html',
        controller: productViewCtrl, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) {

        } //DOM manipulation
    }
})
.directive('prFeedItem', function(){
  return {
    restrict: 'E', //<feed-item></feed-item>
    link: function($scope, element, attrs){
      console.log('feed-item...')
    },
    scope: {
      product: '=item'
    },
    templateUrl: 'templates/feed-item.html',
    controller: 'feedItemCtrl'
  }
})
.directive('prNumerator', function () {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment
        link: function ($scope, element, attrs) {
          $scope.$watch('currentProduct.amount_saved', function(newVal, oldVal){
            if (newVal !== oldVal) {
                price = attrs.price
                options = {
      	          toValue: price,
                  fromValue: attrs.retail,
                  easing: 'linear',
                  duration: 2500,
                  delimiter: ',',
                  rounding: 2,
                  onComplete: function(){
                    $scope.getItReady = true;
                  },
                  onStart: function(){
                    $scope.getItReady = false;
                  }
                }
                $(element).numerator( options )
              }
          });

        } //DOM manipulation
    }
})
.directive('prFavHeart', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/fav-heart.html',
    replace: true,
    scope: {
      product: '=item'
    },
    link: function($scope, element, attrs){
    },
    controller: 'heartCtrl'
  }
})

.directive('prScrollSimilar', function(){
  return{
    restrict: 'A',
    link: function($scope, element, attrs) {
      $scope.$watch('currentProduct', function(newVal, oldVal){
        if (newVal !== oldVal) {
            $(element).scrollLeft(0);
        }
      });
    }
  }
})
.directive('prStoreNumerator', function () {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment
        link: function ($scope, element, attrs) {
          console.log('Store...')
          $scope.$watch('currentProduct', function(newVal, oldVal){
            if (newVal !== oldVal) {
              factor = 150;
              store_name = $scope.currentProduct.store_name;
              setTimeout(function() {
                $(element).text('Oodle.com');
              }, 1 * factor);
              setTimeout(function() {
                  $(element).text('Nordtroms.com')

              },  2 * factor);
              setTimeout(function() {
                  $(element).text('Cabelas.com')

              }, 3 * factor);
              setTimeout(function() {
                  $(element).text('Sportsauthority.com')

              }, 4  * factor);
              setTimeout(function() {
                  $(element).text('Ebay.com')
              }, 5  * factor);
              setTimeout(function() {
                  $(element).text('TheRealReal.com')

              }, 6 * factor);
              setTimeout(function() {
                  $(element).text('Etsy.com')

              }, 7 * factor);
              setTimeout(function() {
                  $(element).text('Overstock.com')

              }, 8 * factor);
              setTimeout(function() {
                $(element).text('Oodle.com');
              }, 9 * factor);
              setTimeout(function() {
                  $(element).text('Nordtroms.com')

              },  10 * factor);
              setTimeout(function() {
                  $(element).text('Cabelas.com')

              }, 11 * factor);
              setTimeout(function() {
                  $(element).text('Sportsauthority.com')

              }, 12  * factor);
              setTimeout(function() {
                  $(element).text('Ebay.com')
              }, 13  * factor);
              setTimeout(function() {
                  $(element).text('TheRealReal.com')

              }, 14 * factor);
              setTimeout(function() {
                  $(element).text('Etsy.com')

              }, 15 * factor);

              setTimeout(function() {
                  $scope.currentProduct.store_name = store_name
              }, 9 * factor);
            }
          });

        } //DOM manipulation
    }
})
.directive('prTopBar', function(){
  return {
    restrict: 'E', //<feed-item></feed-item>
    link: function($scope, element, attrs){
      console.log('prTopBar...')
    },
    scope: {
    },
    templateUrl: 'templates/filter/top-bar.html',
    controller: 'feedCtrl'
  }
});
