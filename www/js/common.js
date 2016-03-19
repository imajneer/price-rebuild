angular.module('app.common', [])

.service('Util',function($rootScope,$http,$state,$ionicLoading) {
    //insert common functions here
    return {
	 	buyNow: buyNow
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
