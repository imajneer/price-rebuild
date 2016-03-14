angular.module('app.services', ['ngResource','LocalStorageModule'])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function($http){

}])
.factory('PriceAPI',function($resource,$rootScope,$http) {
    var hostUrl = $rootScope.hostUrl;
    $rootScope.currentGender = 'female';
     var catImg = [];
    for(i = 1; i < 6; i++)
        catImg.push('img/cats/' + $rootScope.currentGender + '/img' + (i+1).toString() + '.svg');
    return {
        item: $resource(hostUrl + '/item-details/:id/'),
        items: $resource(hostUrl + '/item/list/'),
        suggestions: $resource(hostUrl + '/item/similar-category/:id/'),
        suggestionstoo: function(id) { $http.get(hostUrl + '/item/similar-category/' + id + '/')
        },
        itemList: function() { $http( {
            method: 'GET',
            url: hostUrl + '/item/list/',
            params: {
                'min_price' : $rootScope.min_price,
                'max_price' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': $rootScope.page_no,
                'show_by': 10,
                'type' : 'female' //$rootScope.gender

            }
        })},
        categories: {
            female: [
                {
                    name: 'sunglasses',
                    img: catImg[0]
                },{
                    name: 'watches',
                    img: catImg[1]
                },{
                    name: 'clothing',
                    img: catImg[2]
                },{
                    name: 'jewelry',
                    img: catImg[3]
                },{
                    name: 'bags',
                    img: catImg[4]
                },{
                    name: 'shoes',
                    img: catImg[5]
                }],
            male: [
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
                }]
        }
    }
})
.factory('Favorites',function(localStorageService, $resource, $rootScope) {
    var hostUrl = $rootScope.hostUrl;

   return {
        get: function() {
          console.log('Fetching favorites...');
          return $resource(hostUrl + '/favourites/list/',
          {user: $rootScope.user.id})
          .query();
        },
        add: function(item) {
            return $resource(hostUrl + '/favourites/add',
            {item: '@item',user: $rootScope.user.id})
            .post({item : item});
        },
        delete: function(item) {
            console.log('deleting favorite...');
            return $resource(hostUrl + '/favourites/delete',
            {item:'@item',user: $rootScope.user.id})
            .post({item:item});
        },
        contains: function(item) {
            console.log('trying to get favorites!');
            var favs = localStorageService.get('favs');
            return favs.indexOf(item) != -1;
        }
       }
});
