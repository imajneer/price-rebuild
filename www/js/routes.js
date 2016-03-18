angular.module('app.routes',[])

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
    .state('filter', {
      url: '/filter',
      templateUrl: 'templates/filter/menu.html'
    })
    
    
    .state('filter.price', {
      url: '/filter/price',
      templateUrl: 'templates/filter/price.html',
      controller: 'priceCtrl'
    })
    
      .state('filter.size', {
      url: '/filter/size',
      templateUrl: 'templates/filter/size.html',
      controller: 'sizeCtrl'
    })
    
      .state('filter.category', {
      url: '/filter/category',
      templateUrl: 'templates/filter/category.html',
      controller: 'catCtrl'
    })
    
      .state('filter.color', {
      url: '/filter/color',
      templateUrl: 'templates/filter/color.html',
      controller: 'colorCtrl'
    })
    
      .state('filter.condition', {
      url: '/filter/condition',
      templateUrl: 'templates/filter/condition.html',
      controller: 'condCtrl'
    })

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
