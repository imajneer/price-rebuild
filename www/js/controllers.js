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

.controller('itemViewCtrl',function($scope,$stateParams,$ionicLoading,$http,$rootScope,$state,Util,$ionicModal) {

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
      // $scope.shareModal.show();
      $ionicModal.fromTemplateUrl('templates/share.html').then(function($ionicModal) {
        $scope.shareModal = $ionicModal;
        $scope.shareModal.show();
      });
    };

    $scope.facebookShare = function(product){
      console.log('Sharing to fb...');
      console.log($rootScope.currentProduct);
      window.plugins.socialsharing.shareViaFacebook($rootScope.currentProduct.title, $rootScope.currentProduct.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.twitterShare = function(product){
      window.plugins.socialsharing.shareViaTwitter($rootScope.currentProduct.title, $rootScope.currentProduct.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.instagramShare = function(product){
      window.plugins.socialsharing.shareViaInstagram($rootScope.currentProduct.title, $rootScope.currentProduct.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.pinterestShare = function(product){
      window.plugins.socialsharing.shareViaPinterest($rootScope.currentProduct.title, $rootScope.currentProduct.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
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
  console.log('loaded feedItemCtrl...');
  $scope.loadTimeout = false;
  $scope.getItReady = false
	//load util singleton with openProduct and buyNow functions
	$scope.util = Util;

  // Ideally, it should be wrapped up inside a function in order to
  // have just one instance but single instance was not working flawlessly
  // with events inside directives

  $ionicModal.fromTemplateUrl('templates/productDetails.html', function($ionicModal) {
      $scope.productModal = $ionicModal;
  }, {
      scope: $scope,
      animation: 'slide-in-up'
  });

  // Bringing back the openProduct function from Util. As it has introduced a couple of issues due to
  // change in scope. i.e. $scope has been changed to $rootScope so
  //  events inside directives were not being caught.
  $scope.openProduct = function(product) {
    $ionicLoading.show();
    var productId =  product.itemID ? product.itemID : (product.id ? product.id : product.pk);
    console.log('opening product with id: ' + productId);
    $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
      console.log('should get item data...');
      console.log(res);
      // $rootScope.currentProduct = res.data;
      $scope.currentProduct = res.data;
      resetProductModal();
      $scope.productModal.show();
    })
    PriceAPI.item.get({id: productId},function(data) {
    });
    $http.get($rootScope.hostUrl + '/item/similar-category/' + productId + '/').then(function(data) {
        // $rootScope.currentSuggestions = data.data;
        $scope.currentSuggestions = data.data;
        console.log(data.data);
        $ionicLoading.hide();
    },function(e) {
        console.log(e);
    });
  }

  function resetProductModal() {
      $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
      $rootScope.activeSlide = 1;
      $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
  }
  $scope.openSharing = function(product){
    console.log('Sharing.....')
    $rootScope.shareModal.show();
  };

})

.controller('filtersCtrl',function($scope,$rootScope,$state) {


})

.controller('shareCtrl',['$scope',function($scope) {

}])
