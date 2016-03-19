angular.module('app.controllers', ['app.services','ngLodash','truncate','ngCordova','app.common'])

.controller('heartCtrl',function($scope,$rootScope,Favs,lodash) {

     $scope.toggleFav = function(product) {
        console.log('should toggle fav');
        id = product.itemID ? product.itemID : (product.id ? product.id : product.pk);
        var foundIt = Favs.contains(id);
        if(!foundIt) { //favorite not found; add it
            Favs.add(id);
        } else { //favorite found; delete it
            Favs.remove(id);
        }
        product.isFavorite = !foundIt;

    };

})

.controller('favoritesCtrl', function($scope, Favs) {
    $scope.$on('$ionicView.beforeEnter', function(){
        console.log('shoud get favs...');
        Favs.getList();
    });
    console.log('loaded fav controller!');
})


.controller('accountCtrl', function($scope,$cordovaFacebook,$state,localStorageService,$rootScope,Util) {
	$scope.util = Util;
    $scope.numFavs = $rootScope.favs.length;

    $scope.logout = function() {
        console.log('should logout...');
        $cordovaFacebook.logout().then(function(success) {
            localStorageService.remove('accessToken');
            localStorageService.remove('userId');
            localStorageService.remove('fullName');
            console.log(success);
            $state.go('signin');

        },function(error) {
           console.log('error logging out');
           console.log(error);
        });
    }
})

.controller('itemViewCtrl',function($scope,$stateParams,$ionicLoading,$http,$rootScope,$state,Util) {
	
	$scope.util = Util;
    $scope.card = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '19'
    };
	$scope.goBack = function() {
		$state.go($rootScope.previousState);
	}
    
    console.log('loaded item view controller');
    
    $scope.$on('$ionicView.beforeEnter',function() {
		$http.get($rootScope.hostUrl + '/item/similar-category/' + $rootScope.prodId + '/').then(function(data) {
            // $rootScope.currentSuggestions = data.data;
            $scope.currentSuggestions = data.data;
            console.log(data.data);
            $ionicLoading.hide();
        },function(e) {
            console.log(e);
        });
	});
	
	    $scope.openSharing = function(product){
      console.log('Sharing.....')
      $scope.shareModal.show();
    };

    $scope.facebookShare = function(product){
      console.log('Sharing to fb...');
      window.plugins.socialsharing.shareViaFacebook(product.title, product.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.twitterShare = function(product){
      window.plugins.socialsharing.shareViaTwitter(product.title, product.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.instagramShare = function(product){
      window.plugins.socialsharing.shareViaInstagram(product.title, product.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.pinterestShare = function(product){
      window.plugins.socialsharing.shareViaPinterest(product.title, product.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };

})

.controller('WelcomeCtrl',function($rootScope,$scope,$state,localStorageService,$cordovaFacebook,$http,$ionicPlatform,PriceAPI,$window) {
    console.log('loaded welcome controller!');

    $scope.loginFacebook = function() {
    	$cordovaFacebook.login(["public_profile", "email"])
		.then(function(success) {
	        console.log('logged in!!!');
            console.log(success);
            localStorageService.set('accessToken',success.authResponse.accessToken);
            $scope.accessToken = success.authResponse.accessToken;
            localStorageService.set('userId',success.authResponse.userID);
            $rootScope.user.id = localStorageService.get('userId');
            

            
			$cordovaFacebook.api('/me?fields=email,gender,name,age_range,location&access_token='+success.authResponse.accessToken).then(
            function(response) {
	            
	           localStorageService.set('fullName',response.name);
			   $rootScope.user.fullName = response.name;

			   localStorageService.set('email',response.email);
			   $rootScope.user.email = response.email;

			   localStorageService.set('gender',response.gender);
			   $rootScope.user.gender = response.gender;

			   localStorageService.set('location',response.location.name);
			   $rootScope.user.location = response.location;
			   //auth call to get user id
			   //this doesn't work yet
	/*
		   PriceAPI.auth( {
	           access_token: $scope.access_token,
	           backend: 'facebook',
	           name: response.name,
	           user_id: $rootScope.user.id,
	           email: response.email
           });
*/
			   
			},
            function(error) {
                console.log(error);
				$window.alert('Error logging in');
          	});

        });
            
        $state.go('tabs.feed');

        $http.get('https://graph.facebook.com/' + $rootScope.user.id + '/picture?redirect=false&width=500').then(function(res) {
            localStorageService.set('photoUrl',res.data.data.url);
            $rootScope.user.photoUrl = res.data.data.url;
              console.log('got photo!');
              console.log(res);
          },function(err) {
              console.log(err);
          });


        };

})

.controller('ShippingCtrl',function($rootScope,$scope,$state) {

    $scope.saveInfo = function() {
        $rootScope.user.save().then(function() {
            console.log('saved user');
            $state.go('tabs.feed');
        },function(error) {
            console.log('error saving user');
        });
    }

})

.controller('feedItemCtrl',function($rootScope,$state,$ionicLoading,$scope,$http,PriceAPI,$ionicModal,$ionicScrollDelegate, $cordovaInAppBrowser,Util) {
	
	//load util singleton with openProduct and buyNow functions
	$scope.util = Util;
	
  console.log('loaded feedItemCtrl...');
  $scope.loadTimeout = false;

  

  function resetProductModal() {
      $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
      $rootScope.activeSlide = 1;
      $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
  }


})

.controller('filtersCtrl',function($scope,$rootScope,$state) {

   
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

.controller('shareCtrl',['$scope',function($scope) {

}])
