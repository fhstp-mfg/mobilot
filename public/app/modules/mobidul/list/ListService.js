angular
  .module('Mobidul')
  .factory('ListService', ListService);


ListService.$inject = [
  '$log', '$rootScope', '$http', '$q', '$timeout',
  'UserService'
];


function ListService (
  $log, $rootScope, $http, $q, $timeout,
  UserService
) {
  /// ListService
  var service =
  {
    /// constants
    ALL_STATIONS : 'all',

    /// vars
    // ...

    /// services
    getStations         : getStations,
    hideAppLoader       : hideAppLoader,
    // refreshStationActions : refreshStationActions
  };

  ///private functions
  
  function _getPermissionByCat(cat){

    return $q(function(resolve, reject){

      if(cat === service.ALL_STATIONS){
        UserService.getRequestAllStationsPermit()
          .then(function(RequestAllStationsPermit){
            
            resolve(RequestAllStationsPermit);
          });
      }else{
        UserService.getRequestCategoryStationsPermit()
          .then(function(RequestCategoryStationsPermit){
            resolve(RequestCategoryStationsPermit);
          });
      }
    });
  }
  
  
  /// services

  function getStations (mobidulCode, cat)
  {
    //$log.info('> ListService getStations service');
    //$log.debug(cat);

    return $q(function(resolve, reject){
      _getPermissionByCat(cat)
        .then(function(hasPermission){

          if ( hasPermission ) {
            var url  = mobidulCode + '/';
                url += ( cat !== service.ALL_STATIONS )
                         ? 'GetForCategory/' + cat
                         : 'GetStations/All';

            $http.get( url )
              .success(function(data){

                resolve({
                  hasPermission: hasPermission,
                  stations: data
                });
                
              })
              .error(function(data, status){
                $log.error(data);
                $log.error(status);
              });
          }else{
            resolve({
              hasPermission: hasPermission,
              stations: null
            });
          }
        });
    });
  }


  function saveOrder (mobidulCode, stations)
  {
    var arr = [];
    stations.forEach(function (s)
    {
      arr.push({
        'id' : s.id,
        'order' : s.order
      });
    });

    var req =
    {
      method : 'PUT',
      url : mobidulCode + '/changeOrder',
      data : {
        stations: arr
      }
    };

    return $http(req);
  }


  function hideAppLoader ()
  {
    $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
  }


  // TODO
  // function refreshStationActions ()
  // {
  //   return $rootScope.$on('UserService::sessionUpdated'); // return promise
  // }


  return service;
};
