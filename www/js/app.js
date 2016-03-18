// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ionic.service.core', 'app.controllers', 'app.routes', 'app.services','app.directives','ngResource','LocalStorageModule','ionic.contrib.ui.hscrollcards','ngIOS9UIWebViewPatch','ngCordova','ti-segmented-control','rzModule','app.feedCtrl','app.filterCtrls'])

.run(function($ionicPlatform,$rootScope,localStorageService,$timeout) {
    
    console.log('ran run function in app');
  $ionicPlatform.ready(function() {
      console.log('platform ready under app...');
      init();
  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  
  });
  
  function init() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    $rootScope.hostUrl = 'http://staging12.getpriceapp.com';
    $rootScope.user = {};

    if(localStorageService.keys()) {
        $rootScope.user.photoUrl = localStorageService.get('photoUrl');
        $rootScope.user.id = localStorageService.get('userId');
        $rootScope.user.accessToken = localStorageService.get('accessToken');
        $rootScope.user.fullName = localStorageService.get('fullName');
    }

  }
})
.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
//   stripeProvider.setPublishableKey('pk_test_aKantRCo8oXwL3FxinYqdEyn');

}])
.directive('prUtil',function($rootScope,$scope) {
    //insert common functions here
    return {
	 	openProduct: openProduct
    }
    function openProduct(product) {
	     $scope.loadTimeout = false;
    $ionicLoading.show();
    $rootScope.previousState = $state.current.name;
    $rootScope.prodId = product.itemID ? product.itemID : (product.id ? product.id : product.pk);
    console.log(product);
    console.log('opening product with id: ' + $rootScope.prodId);
    $scope.loadTimeout = false;

    setTimeout(function(){
      if(!$scope.itemLoaded){
        $scope.loadTimeout = true
      }
    }, 5000);
    $scope.itemLoaded = false
    $scope.loadTimeout = false
    $http.get($rootScope.hostUrl + '/item-details/' + $rootScope.prodId+'/').then(function(res) {
      console.log('should get item data...');
      console.log(res);
      // $rootScope.currentProduct = res.data;
      $rootScope.currentProduct = res.data;
      $rootScope.$broadcast('item.open');
      $state.go('item');
      $scope.itemLoaded = true
    });
    
  }
    }
    $rootScope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
    };

    $rootScope.products = [];

    $rootScope.currentGender = 'female';
    $rootScope.page_no = 1;
});
