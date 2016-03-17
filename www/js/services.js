angular.module('app.services', ['ngResource','LocalStorageModule','ngLodash'])


.factory('PriceAPI',function($resource,$rootScope,$http,lodash,Favs) {

    $rootScope.currentGender = 'male';

    $rootScope.gender = $rootScope.gender ? $rootScope.gender : 'male' 
     var catImg = [];
    for(i = 0; i < 6; i++)
        catImg.push('img/cats/' + $rootScope.gender + '/img' + (i+1).toString() + '.svg');
    return {
        item: $resource('http://staging12.getpriceapp.com' + '/item-details/:id/'),
        items: items,
        suggestions: $resource('http://staging12.getpriceapp.com' + '/item/similar-category/:id/'),
        suggestionstoo: function(id) { $http.get('http://staging12.getpriceapp.com' + '/item/similar-category/' + id + '/')
        },
        itemList: function() { $http( {
            method: 'GET',
            url: 'http://staging12.getpriceapp.com' + '/item/list/',
            params: {
                'min_price' : $rootScope.min_price,
                'max_price' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': $rootScope.page_no,
                'show_by': 16,
                'type' : $rootScope.gender

            }
        })},
        categories: {
            female: [
                {
                    name: 'bags',
                    img: catImg[0]
                },{
                    name: 'clothing',
                    img: catImg[1]
                },{
                    name: 'watches',
                    img: catImg[2]
                },{
                    name: 'shoes',
                    img: catImg[3]
                },{
                    name: 'jewelry',
                    img: catImg[4]
                },{
                    name: 'sunglasses',
                    img: catImg[5]
                }],
            male: [
                {
                    name: 'gadgets',
                    img: catImg[0]
                },{
                    name: 'clothing',
                    img: catImg[1]
                },{
                    name: 'watches',
                    img: catImg[2]
                },{
                    name: 'shoes',
                    img: catImg[3]
                },{
                    name: 'outdoor',
                    img: catImg[4]
                },{
                    name: 'sunglasses',
                    img: catImg[5]
                }]
        }
    }
    function items(page) {
        console.log('refresh products');
        var request = $http( {
            method: 'GET',
            url: 'http://staging12.getpriceapp.com' + '/item/list/',
            params: {
                'price_min' : $rootScope.min_price ? $rootScope.min_price : 0,
                'price_max' : $rootScope.max_price ? $rootScope.max_price : '',
                'category' : $rootScope.currentCategory ? $rootScope.currentCategory : '', //$rootScope.category
                'page': $rootScope.page_no ? $rootScope.page_no : 1,
                'show_by': '20',
                'type' : $rootScope.gender,
                'sort' : $rootScope.sortBy ? $rootScope.sortBy : ''
                 //defaults to recently added

            }
        });
        return request.then( function(data) {
            console.log('got list data...');
            console.log(data);
            return lodash.map(data.data[0].products,function(product) {
                product.fields.isFavorite = Favs.contains(product.fields.itemID);        
                return product.fields; // hardcoded to remove the first element to prevent bug
            });

            console.log($rootScope.products);
            $rootScope.$broadcast('scroll.refreshComplete');

            },
            function(e) {
                return e;
                console.log('error getting items...');
                console.log(e);
            });

    }
})
.service('Favs', function($http,$rootScope,lodash) {
    return {
      add: add,
      list: list,
      remove: remove,
      getList: getList,
      contains:contains
    }
    
    function contains(item_id) {
        return lodash.some($rootScope.favs,function(fav) {
            return fav.itemID == item_id;
        });
    }

    function add(item_id) {
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      }
      var data = $.param({
        user: '76',
        item: item_id
      });
      var request = $http.post('http://staging12.getpriceapp.com' + '/favourites/add', data, config);
      return (request.then(function(res) {
        console.log(res);
        getList();
        return res.data;
      }, function(err) {
        return err;
      }));

    }

    function getList() {
      $http.get('http://staging12.getpriceapp.com' + '/favourites/list?user=76').then(function(res) {
          console.log('got favs...');
          
          $rootScope.favs = res.data;
          for(item in $rootScope.favs){
            item.isFavorite = true; // ideally it can be set at server side
          }
      },function(err) {
          console.log(err);
      });
    }
    
    function list() {
      var request = $http.get('http://staging12.getpriceapp.com' + '/favourites/list?user=76');
      return (request.then(function(res) {
          console.log('fetched favs...');
        console.log(res);
        return res.data;
      }, function(err) {
        return err;
      }));

    }
    
    function remove(item_id) {
        $.ajax({
            url: "http://staging12.getpriceapp.com/favourites/delete/",
            data: {
                'user': 76,
                'id': item_id
            },
            type: "POST",
            dataType: "json",
            success: function(data){
                console.log(data);
                getList();
                },
            error: function(data){
                console.log(data)
                }
        })
    }
});