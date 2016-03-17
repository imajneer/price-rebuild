
angular.module('app.controllers', ['app.services','ngLodash','truncate','ngIOS9UIWebViewPatch','ngCordova','app.directives'])
.controller('feedCtrl', function($scope,$rootScope,$state,$ionicModal,$q,$filter,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$ionicScrollDelegate,$http,localStorageService,$timeout,$ionicLoading,Favs) {

    console.log('loaded feed controller...');

    $scope.$on('$ionicView.beforeEnter',function() {
        console.log('before enter...');
        
        if(localStorageService.get('accessToken')) {
            //user already logged in
        } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid())  {

            $state.go('signin'); //this is commented out to support web dev

/*            //set up some dummy data before for web dev
            $rootScope.user.fullName = "RJ Jain";
            $rootScope.user.photoUrl = 'https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xla1/t31.0-8/12747354_10154146476332018_18157417964440176_o.jpg';
*/

            $state.go('signin'); //this is commented out to support web dev
        }
    })

    $scope.$on('$ionicView.afterEnter', function(){

     });

    $ionicPlatform.ready(function(){
        console.log('platform ready...');
        $ionicLoading.show();
        $scope.canReload = true;
        $rootScope.products = [];
        $rootScope.currentGender = 'female';

           console.log('after enter...');
      Favs.getList();
      $scope.shouldRefresh = true;
      $rootScope.$watch('favs', function(newVal, oldVal){
        if (newVal !== oldVal) {
            if($scope.shouldRefresh){
                console.log('trying to refresh again');
              $scope.refresh();
              $scope.shouldRefresh = false;
            }
          }
      });
      loadModals();

  });


    $scope.refresh = function()  {

      $rootScope.page_no = 0;

      $scope.loadNextPage();
      $scope.canReload = false;
      $timeout(function() {
          $scope.canReload = true;
      },1000);

    };
    $scope.loadNextPage = function() {
        console.log('should load next page');
        $rootScope.page_no++;
        PriceAPI.items($rootScope.page_no).then(function(res) {
            console.log(res);
            if($rootScope.page_no == 1)
                $rootScope.products = [];
            $rootScope.products = lodash.concat($rootScope.products,res);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
        })
    }

    $scope.openProduct = function(product) {
        $ionicLoading.show();
        var productId = product.itemID ? product.itemID : product.id;

        console.log('opening product with id: ' + productId);

        $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
            console.log('should get item data...');
            console.log(res);
            // $rootScope.currentProduct = res.data;
            $scope.currentProduct = res.data;
            $scope.currentProduct.isFavorite = Favs.contains($scope.currentProduct.id);
            resetProductModal();
            $scope.modal.show();

        })


   /*
     PriceAPI.item.get({id: productId},function(data) {

        });
*/

        $http.get($rootScope.hostUrl + '/item/similar-category/' + productId + '/').then(function(data) {
            // $rootScope.currentSuggestions = data.data;
            $scope.currentSuggestions = data.data;
            console.log(data.data);
            $ionicLoading.hide();
        },function(e) {
            console.log(e);
        });

    };


    var filterButtons = [
        { text: 'Most Expensive', value: 'expensive' },
        { text: 'Least Expensive', value: 'inexpensive' },
        { text: 'Most Popular', value: 'popular' },
        { text: 'Biggest Savings', value: 'discount'},
        { text: 'Most Recent', value: ''}];

    $scope.openPriceFilters = function() { //this needs to be refactored 
        $ionicActionSheet.show({
        buttons: filterButtons,
        buttonClicked: function(index) { 
            console.log('clicked button');
            $rootScope.sortBy = filterButtons[index].value;
            $scope.refresh();
            return true;
        }
    })};

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
        $scope.filtersModal.hide();
        $rootScope.min_price = $scope.slider.min;
        $rootScope.max_price = $scope.slider.max;
        $scope.refresh();

    }

    $scope.cancelFilters = function() {
        $scope.slider.min = $rootScope.min_price;
        $scope.slider.max = $rootScope.max_price;
        $scope.filtersModal.hide();
    }

    function loadModals() {
        $ionicModal.fromTemplateUrl('templates/categories.html', function($ionicModal) {
            $scope.catModal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $ionicModal.fromTemplateUrl('templates/filters.html',function($ionicModal) {
            $scope.filtersModal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-down'
        });
        $scope.openFilters = function() {
            $scope.filtersModal.show();
        }

        $ionicModal.fromTemplateUrl('templates/share.html', function($ionicModal) {
            $scope.shareModal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    }

    $scope.openCategories = function() {
        console.log('should open categories');
        $scope.catModal.show();
        console.log($scope.categories);
    };
    $scope.setCategory = function(cat) {
        if(cat === 'all') cat = '';
        $rootScope.products = [];
        $scope.catModal.hide();
        $rootScope.currentCategory = cat;
        $ionicLoading.show();
        $scope.refresh();
    }
    $scope.selectedCategory = function(idx) {
        console.log('selected category: ' + $scope.catNames[idx].name);
        $scope.setCategory($scope.catNames[idx].name);
    }
    $scope.openSharing = function(product){
      console.log('Sharing.....');
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
    $scope.pintrestShare = function(product){
      window.plugins.socialsharing.shareViaPinterest(product.title, product.photo_set[0].url_large, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };

    $scope.categories = PriceAPI.categories;
    console.log($scope.categories);

    $scope.catNames = PriceAPI.categories[$rootScope.currentGender];    $scope.catNames.splice(0,0,{'name':'all','img':'img/test.png'});

})
.controller('heartCtrl',function($scope,$rootScope,Favs,lodash) {

     $scope.toggleFav = function(product) {
        console.log('should toggle fav');
        id = product.itemID ? product.itemID : product.id;
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

.controller('itemViewCtrl',['$stateParams',function($scope,$stateParams) {
    $scope.card = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '19'
    };

    $scope.buyNow = function() {
        console.log('buying now!');
    };
    console.log('loaded item view controller');
}])

.controller('WelcomeCtrl',function($rootScope,$scope,$state,localStorageService,$cordovaFacebook,$http) {
    console.log('loaded welcome controller!');

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
  $ionicModal.fromTemplateUrl('templates/productDetails.html', function($ionicModal) {
      $scope.modal = $ionicModal;
  }, {
      scope: $scope,
      animation: 'slide-in-up'
  });

  $scope.buyNow = function(product){
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

  $scope.openProduct = function(product) {
    $scope.loadTimeout = false

    $ionicLoading.show();
    var productId = product.itemID ? product.itemID : product.id;

    console.log('opening product with id: ' + productId);
    $scope.loadTimeout = false;

    setTimeout(function(){
      if(!$scope.itemLoaded){
        $scope.loadTimeout = true
      }
    }, 5000);
    $scope.itemLoaded = false
    $scope.loadTimeout = false
    $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
      console.log('should get item data...');
      console.log(res);
      // $rootScope.currentProduct = res.data;
      $scope.currentProduct = res.data;
      resetProductModal();
      $scope.modal.show();
      $scope.itemLoaded = true
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
})

.controller('shareCtrl',['$scope',function($scope) {

}])
