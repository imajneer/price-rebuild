angular.module('app.feedCtrl',['app.services','ngLodash','ngCordova'])
.controller('feedCtrl',function($scope,$rootScope,$state,$ionicModal,$q,$filter,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$ionicScrollDelegate,$http,localStorageService,$timeout,$ionicLoading,Favs) {
	
	 console.log('loaded feed controller...');

    $scope.$on('$ionicView.beforeEnter',function() {
        console.log('before enter...');
        if(localStorageService.get('accessToken')) {
	        //should already be signed in
        } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid())  {
//        $state.go('signin'); //this is commented out to support web dev

/*            //set up some dummy data before for web dev
            $rootScope.user.fullName = "RJ Jain";
            $rootScope.user.photoUrl = 'https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xla1/t31.0-8/12747354_10154146476332018_18157417964440176_o.jpg';
*/
        }
        
        $ionicLoading.show();
        $scope.canReload = true;
        $rootScope.products = [];
        $rootScope.currentGender = localStorageService.get('gender');
        $rootScope.page_no = 0;
		$scope.getCats();
        console.log('after enter...');
        Favs.getList();
        
//            $rootScope.refresh();

    /*
  $rootScope.$watch('favs', function(newVal, oldVal){
        if (newVal !== oldVal) {
            if($scope.shouldRefresh){
                console.log('trying to refresh again');
              $scope.shouldRefresh = false;
            }
          }
      });
*/
      $scope.loadModals();


    })
    $scope.getCats = function() {
// 		var gender = $rootScope.currentGender ? $rootScope.currentGender : $rootScope.user.gender ? $rootScope.user.gender : 'male'; //this line has an issue
    var gender = 'male';
		$scope.categories = PriceAPI.categories();
		$scope.catNames = $scope.categories[gender];
		$scope.catNames.splice(0,0,{'name':'all','img':'img/cats/all.svg'});
		//this line works
    }

    $rootScope.refresh = function()  {
	  if($scope.canReload) {
		  $rootScope.page_no = 0;
	      $scope.loadNextPage();
		  $scope.canReload = false;
		  $timeout(function() {
          	$scope.canReload = true;
		  },1000);
		}

    };
    
       $scope.loadNextPage = function() {
        console.log('should load next page');
            $rootScope.rightVal = 2;
            $rootScope.page_no = 1;
        if($rootScope.favs) {
            $scope.loadPage($rootScope.page_no);
        } else {
            $rootScope.rightVal = 3;
            $.ajax({
                   method:'GET',
                   url: 'http://staging12.getpriceapp.com' + '/favourites/list?user=76',
                   success: function(res) {

                        $rootScope.favs = angular.fromJson(res);
                        console.log($rootScope.favs);
                        for(var item in $rootScope.favs){
                            item.isFavorite = true; // ideally it can be set at server side
                        }
                        $rootScope.leftVal = 2;
                        $scope.loadPage($rootScope.page_no);

                   }
                   });
            $rootScope.rightVal = 4;
            }
        }    
    $scope.loadPage = function(page) {
        PriceAPI.loadPage(page);
    }

    var filterButtons = [
        { text: 'Most Expensive', value: 'expensive' },
        { text: 'Least Expensive', value: 'inexpensive' },
        { text: 'Most Popular', value: 'popular' },
        { text: 'Biggest Savings', value: 'discount'},
        { text: 'Most Recent', value: ''}];

    $scope.openSortActionSheet = function() { //this needs to be refactored
        $ionicActionSheet.show({
        buttons: filterButtons,
        buttonClicked: function(index) {
            console.log('clicked button');
            $rootScope.sortBy = filterButtons[index].value;
            $rootScope.refresh();
            return true;
        }
    })};

    $scope.openFilters = function() {
	    $rootScope.previousState = $state.current.name;
	    $state.go('filters');
    };

    $scope.loadModals = function() {
        $ionicModal.fromTemplateUrl('templates/share.html', function($ionicModal) {
            $scope.shareModal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    };

    $scope.setCategory = function(cat) {
        if(cat === 'all') cat = '';
        $rootScope.products = [];
        $rootScope.currentCategory = cat;
        $ionicLoading.show();
        $rootScope.refresh();
    };
    
    $scope.selectedCategory = function(idx) {
        console.log('selected category: ' + $scope.catNames[idx].name);
        $scope.setCategory($scope.catNames[idx].name);
    };



})