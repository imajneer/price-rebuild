angular.module('app.feedCtrl',['app.services','ngLodash','ngCordova','app.directives'])
.controller('feedCtrl',function($scope,$rootScope,$state,$ionicModal,$q,$filter,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$ionicScrollDelegate,$http,localStorageService,$timeout,$ionicLoading,Favs) {
	
	 console.log('loaded feed controller...');

    $scope.$on('$ionicView.beforeEnter',function() {
        console.log('before enter...');

        if(localStorageService.get('accessToken')) {
            //user already logged in
        } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid())  {

            // $state.go('signin'); //this is commented out to support web dev

/*            //set up some dummy data before for web dev
            $rootScope.user.fullName = "RJ Jain";
            $rootScope.user.photoUrl = 'https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xla1/t31.0-8/12747354_10154146476332018_18157417964440176_o.jpg';
*/

            // $state.go('signin'); //this is commented out to support web dev
        }
    })

    $scope.$on('$ionicView.afterEnter', function(){

     });

    $ionicPlatform.ready(function(){
        console.log('platform ready...');
        $ionicLoading.show();
        $scope.canReload = true;
        $rootScope.products = [];
        $rootScope.currentGender = 'male';
        $rootScope.page_no = 0;

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
        var productId = product.itemID ? product.itemID : (product.id ? product.id : product.pk);

        console.log('opening product with id: ' + productId);

        $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
            console.log('should get item data...');
            console.log(res);
            $rootScope.currentProduct = res.data;
            $rootScope.currentProduct.isFavorite = Favs.contains($scope.currentProduct.id);
            resetProductModal();
            $state.go('item');
//             $scope.modal.show();

        })


   /*
     PriceAPI.item.get({id: productId},function(data) {

        });
*/



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


    $scope.categories = PriceAPI.categories;
    console.log($scope.categories);

    $scope.catNames = PriceAPI.categories[$rootScope.currentGender];    $scope.catNames.splice(0,0,{'name':'all','img':'img/cats/all.svg'});

})