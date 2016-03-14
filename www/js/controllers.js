
angular.module('app.controllers', ['app.services','ngLodash','truncate','ngIOS9UIWebViewPatch','ngCordova'])
  
.controller('feedCtrl', function($scope,$rootScope,$stateParams,$location,$state,$ionicModal,$q,$filter,Favorites,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$anchorScroll,$ionicScrollDelegate,$http,localStorageService,nFavorites) {
    
    $scope.$on('$ionicView.afterEnter', function(){
        $scope.refresh();
    });
    $ionicPlatform.ready(function(){

    
  });
    

    $rootScope.products = [];
    $rootScope.currentGender = 'female';
    $rootScope.page_no = 1;
    $scope.refresh = function() {
        console.log('refresh products');
        $http( {
            method: 'GET',
            url: $rootScope.hostUrl + '/item/list/',
            params: {
                'price_min' : $rootScope.min_price,
                'price_max' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': $rootScope.page_no,
                'show_by': 10,
                'type' : $rootScope.currentGender //$rootScope.gender


            }
        }).then( function(data) {
            console.log(data);
            $rootScope.products = lodash.map(data.data[0].products,function(product) {
            product.fields.isFavorite = Favorites.contains(product.fields);
            return product.fields;
            });

            console.log($rootScope.products);
            $scope.$broadcast('scroll.refreshComplete');

            },
            function(e) {
                console.log(e)
            });
       
    }
    
    

    $scope.openProduct = function(product) {
        var productId = product.id ? product.id : product.pk;


        console.log('opening product with id: ' + productId);
        
        $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
            console.log('should get item data...');
            console.log(res);
            $rootScope.currentProduct = res.data;
            resetProductModal();
            $scope.modal.show(); 

        })
        
        
        PriceAPI.item.get({id: productId},function(data) {
            
        });

        $http.get($rootScope.hostUrl + '/item/similar-category/' + productId + '/').then(function(data) {
            $rootScope.currentSuggestions = data.data;
            console.log(data.data);
        },function(e) {
            console.log(e);
        });
        
        
/*
        PriceAPI.suggestions.get({id: product.id}, function(data) {
            console.log('suggestions...');
            console.log(data);            
        });
*/


    };
    
    
    
    if(localStorageService.get('accessToken')) {
        //user already logged in
    } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        $state.go('signin');
    }
    

    $scope.openFilters = function() {
        $ionicActionSheet.show({
        buttons: [
            {text: 'Above $300'},
            {text: '$100 - 300'},
            {text: 'Below $100'}
        ],
        buttonClicked: function(index) {
            console.log('clicked button');
            switch(index) {
                case 0: //above 300
                    console.log('should set max price');
                    $rootScope.min_price = '300';
                    $rootScope.max_price = '';
                    $scope.refresh();
                    return true;
                case 1 : // between 100-300
                    $rootScope.min_price = '100';
                    $rootScope.max_price = '300';
                    $scope.refresh();
                    return true;
                case 2 : // below 100
                    $rootScope.min_price = '';
                    $rootScope.max_price = '100';
                    $scope.refresh();
                    return true;
            }
        }

    })};
    
 /*
   $scope.addFavorite = function(product) {
        $http({
            method:'POST',
            url: $rootScope.hostUrl + 'favourites/add',
            data: {
                user:$rootScope.
            }            
        }
*/
    
    $scope.toggleFav = function(product) {
        if($rootScope.favs.indexOf(product) != -1) {
            Favorites.delete(product);
            idx = $rootScope.favs.indexOf(item);
$rootScope.favs.splice(idx, 1);
            product.isFavorite = false;
        } else {
            product.isFavorite = true;
            Favorites.add(product);
            $rootScope.favs.push(product);
        }
    };

    $ionicModal.fromTemplateUrl('templates/productDetails.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $ionicModal.fromTemplateUrl('templates/categories.html', function($ionicModal) {
        $scope.catModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    }); 
    
    $scope.openCategories = function() {
        console.log('should open categories');
        $scope.catModal.show();
        console.log($scope.categories);
    };
    $scope.setCategory = function(cat) {
        $scope.catModal.hide();
        $rootScope.currentCategory = cat;
        $scope.refresh();
    }
    
    $scope.$on('modal.shown', function(event) {
//         resetProductModal();
    });
    
    function resetProductModal() {
        $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
        $scope.activeSlide = 1;
        $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
    }
    
    $scope.categories = PriceAPI.categories;

})

.controller('favoritesCtrl', function($scope,Favorites) {
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

.controller('itemViewCtrl',['$stateParams',function($scope,$stateParams,stripe) {
    $scope.card = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '19'
    };

    $scope.buyNow = function() {
        console.log('buying now!');
    }
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
