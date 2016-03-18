angular.module('app.common', [])

.service('Util',function($rootScope,$http,$state,$ionicLoading) {
    //insert common functions here
    return {
	 	openProduct: openProduct,
	 	buyNow: buyNow
    }
    var loadTimeout = false,
    	itemLoaded = false;
    
    function openProduct(product) {
	    console.log('should open product');
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
  
  function buyNow(product){ //this should also be moved to a util singleton
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
  
});
