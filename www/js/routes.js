angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signin', {
      url: 'signin',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
    })

    .state('login', {
      url: 'login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('shipping', {
      url: '/shipping',
      templateUrl: 'templates/shipping.html',
      controller: 'ShippingCtrl'

    })
    
/*
      .state('filterprice', {
      url: '/filterprice',
      templateUrl: 'templates/filter-price.html',
      controller: 'fPriceCtrl'
    })
    
      .state('filtersize', {
      url: '/filtersize',
      templateUrl: 'templates/filter-size.html',
      controller: 'fSizeCtrl'
    })
    
      .state('filtercategory', {
      url: '/filtercategory',
      templateUrl: 'templates/filter-category.html',
      controller: 'fCatCtrl'
    })
    
      .state('filtercolor', {
      url: '/filtercolor',
      templateUrl: 'templates/filter-color.html',
      controller: 'fColorCtrl'
    })
    
      .state('filtercondition', {
      url: '/filtercondition',
      templateUrl: 'templates/filter-condition.html',
      controller: 'fCondCtrl'
    })
*/

  .state('tabs', {
    url: '/',
    templateUrl: 'templates/price.html',
    abstract:true
  })

  .state('tabs.feed', {
    url: 'feed',
    views: {
      'tab5': {
        templateUrl: 'templates/feed.html',
        controller: 'feedCtrl'
      }
    }
  })

  .state('tabs.favorites', {
    url: 'favorites',
    views: {
      'tab2': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })

  .state('tabs.account', {
    url: 'account',
    views: {
      'tab3': {
        templateUrl: 'templates/account.html',
        controller: 'accountCtrl'
      }
    }
  })

  .state('item', {
      url: 'item',
      templateUrl: 'templates/productDetails.html',
      controller: 'itemViewCtrl'
    })

	.state('filters', {
		url: 'filters',
		templateUrl: 'templates/filters.html',
		controller: 'filtersCtrl'
	})


$urlRouterProvider.otherwise('feed')



});
