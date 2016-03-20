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

    
    .state('filters', {
		url: '/filters',
		templateUrl: 'templates/filters.html',
		controller: 'filtersCtrl',
		abstract:true
	})
	
	.state('filters.menu', {
      url: '/filters/menu',
      templateUrl: 'templates/filters.html',
      controller: 'filterCtrl'
    })

    
    .state('filters.price', {
      url: '',
      views: {
        'menuContent' :{
	      templateUrl: 'templates/filter/price.html',
	      controller: 'priceCtrl'
      	}
      }
    })
    
      .state('filters.size', {
      url: '',
      views: {
        'menuContent' :{
	      templateUrl: 'templates/filter/size.html',
	      controller: 'sizeCtrl'
      	}
      }
    })
    
      .state('filters.category', {
      url: '',
      views: {
        'menuContent' :{
	      templateUrl: 'templates/filter/category.html',
	      controller: 'catCtrl'
      	}
      }
    })
    
      .state('filters.color', {
      url: '',
      views: {
        'menuContent' :{
	      templateUrl: 'templates/filter/color.html',
	      controller: 'colorCtrl'
      	}
      }
    })
    
      .state('filters.condition', {
      url: '',
      views: {
        'menuContent' :{
	      templateUrl: 'templates/filter/condition.html',
	      controller: 'condCtrl'
      	}
      }
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



$urlRouterProvider.otherwise('feed')



});
