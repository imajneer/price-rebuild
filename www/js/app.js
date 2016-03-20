// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ionic.service.core', 'app.controllers', 'app.routes', 'app.services','app.directives','ngResource','LocalStorageModule','ionic.contrib.ui.hscrollcards','ngIOS9UIWebViewPatch','ngCordova','ti-segmented-control','rzModule','app.feedCtrl','app.filterCtrls','app.common'])

.run(function($ionicPlatform,$rootScope,localStorageService,$timeout,Util,$log,$window) {
    
    $log.log('running run  function in app');
  $ionicPlatform.ready(function() {
      $log.log('platform ready under app...');
      init();
  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  
  });
  
  function init() {
    if($window.cordova && $window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if($window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
     $log.log('got thru init function in app.run');
  }
})
.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
//   stripeProvider.setPublishableKey('pk_test_aKantRCo8oXwL3FxinYqdEyn');

}]);