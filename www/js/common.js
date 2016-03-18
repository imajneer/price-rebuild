angular.module('app.common', [])

.service('Util',function($rootScope,$http,$state) {
    //insert common functions here
    return {
	 	openProduct: openProduct
    }
    var loadTimeout = false,
    	itemLoaded = false;
    
    function openProduct(product) {
	     loadTimeout = false;
		 $ionicLoading.show();
		 $rootScope.previousState = $state.current.name;
		 $rootScope.prodId = product.itemID ? product.itemID : (product.id ? product.id : product.pk);
		 console.log(product);
		 console.log('opening product with id: ' + $rootScope.prodId);
		 loadTimeout = false;

    setTimeout(function(){
      if(!itemLoaded){
        loadTimeout = true
      }
    }, 5000);
    itemLoaded = false
    loadTimeout = false
    $http.get($rootScope.hostUrl + '/item-details/' + $rootScope.prodId+'/').then(function(res) {
      console.log('should get item data...');
      console.log(res);
      // $rootScope.currentProduct = res.data;
      $rootScope.currentProduct = res.data;
      $rootScope.$broadcast('item.open');
      $state.go('item');
      itemLoaded = true
    });
    
  }
  
});
