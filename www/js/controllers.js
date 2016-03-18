angular.module('app.controllers', ['app.services','ngLodash','truncate','ngCordova'])

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


.controller('accountCtrl', function($scope,$cordovaFacebook,$state,localStorageService,$rootScope) {

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

.controller('itemViewCtrl',function($scope,$stateParams,$ionicLoading,$http,$rootScope,$state) {
	
    $scope.card = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '19'
    };
	$scope.goBack = function() {
		$state.go($rootScope.previousState);
	}
    
    $scope.buyNow = function() {
        console.log('buying now!');
    };
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

.controller('WelcomeCtrl',function($rootScope,$scope,$state,localStorageService,$cordovaFacebook,$http,$ionicPlatform ) {
    console.log('loaded welcome controller!');
    $ionicPlatform.ready(function(){
      $rootScope.currentGender = 'male'
    })
    $scope.loginFacebook = function() {
        $cordovaFacebook.login(["public_profile", "email"])
    .then(function(success) {
        console.log('logged in!!!');
            console.log(success);
            localStorageService.set('accessToken',success.authResponse.accessToken);
            localStorageService.set('userId',success.authResponse.userID);
            $rootScope.user.id = localStorageService.get('userId');

        $cordovaFacebook.api("me", ["public_profile"])
        .then(function(success) {
            console.log(success);
            localStorageService.set('fullName',success.name);
            $rootScope.user.fullName = success.name;
            $rootScope.gender = success.gender;
            $state.go('tabs.feed');
        }, function (error) {
            // error
        });

        $http.get('https://graph.facebook.com/' + $rootScope.user.id + '/picture?redirect=false&width=500').then(function(res) {
            localStorageService.set('photoUrl',res.data.data.url);
            $rootScope.user.photoUrl = res.data.data.url;
              console.log('got photo!');
              console.log(res);
          },function(err) {
              console.log(err);
          });


        });
    }

})

.controller('LoginCtrl',function($rootScope,$scope,$state,$ionicLoading) {
    $scope.user = {};
    $scope.justRegistered = false;

$scope.login = function(provider) {
    console.log($scope.user);
    $ionicLoading.show({template: 'signing in...'});
    Ionic.Auth.login(authProvider, authSettings, $scope.user)
      .then(authSuccess, authFailure);
  };

  var authProvider = 'basic';
  var authSettings = { 'remember': $scope.remember };


  function authSuccess(user) {
      console.log(user);
        $ionicLoading.hide();

      $rootScope.user = user;
      $state.go('tabs.feed');
      if($scope.justRegistered) {
//         $state.go('shipping');
      } else {

        }
  };

  function authFailure(errors) {
        $ionicLoading.show({template: 'registering...'});
        Ionic.Auth.signup($scope.user).then(signupSuccess, signupFailure);
    };


  function signupSuccess(user) {
    $scope.justRegistered = true;
    console.log(user);
    $scope.login();
  }

  function signupFailure(response) {
      console.log('failed to sign up user');
      console.log(response);
  }

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

.controller('feedItemCtrl',function($rootScope,$scope,$state,$ionicLoading,$scope,$http,PriceAPI,$ionicModal,$ionicScrollDelegate, $cordovaInAppBrowser) {

  console.log('loaded feedItemCtrl...');
  $scope.loadTimeout = false;

  $scope.buyNow = function(product){ //this should also be moved to a util singleton
    console.log('Buying now...')
    backImg = 'img/back.png'
    if(ionic.Platform.isIOS())
      backImg = 'img/back-ios.png'

    var browserOptions = {
      // Inappbrowser options for customization
      toolbar: {
        height: 44,
        color: '#000000'
      },
      title: {
        color: '#ffffff',
        staticText: 'BACK TO BROWSING'
      },
      closeButton: {
        wwwImage: backImg,
        wwwImageDensity: 1,

        imagePressed: 'close_pressed',
        align: 'left',
        event: 'closePressed'
      },
      backButtonCanClose: true
    };
    var ref = cordova.ThemeableBrowser.open(product.purchase_url, '_blank', browserOptions);
    ref.addEventListener('loadstart', function(event) {
        //console.log("loadstart" + event.url);
    });
    ref.addEventListener('loadstop', function(event) {
      //console.log("loadstart" + event.url);
      if ((event.url).indexOf('http://www.amazon.com/gp/buy/thankyou') === 0) {
          setTimeout(function() {
              ref.close(); // close inappbrowser 3seconds after purchase
          }, 3000);

      }
    });
    ref.addEventListener('closePressed', function(event) {
        // Fix for back button in iOS
        ref.close();
    });

  }

  $scope.buyNow1 = function(product){
    console.log(product);

    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes',
      title: product.title
    };
    $cordovaInAppBrowser.open(product.purchase_url, '_blank', options)
    .then(function(event) {
      // success
    })
    .catch(function(event) {
      // error
    });

  }
  function resetProductModal() {
      $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
      $rootScope.activeSlide = 1;
      $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
  }

  $scope.openProduct = function(product) { //this needs to be moved to a util singleton object
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
})

.controller('filtersCtrl',function($scope,$rootScope,$state) {
        
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
