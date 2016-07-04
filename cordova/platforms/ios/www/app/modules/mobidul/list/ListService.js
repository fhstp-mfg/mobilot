angular
  .module('Mobidul')
  .factory('ListService', ListService);


ListService.$inject = [
  '$log', '$rootScope', '$http',
  'UserService'
];


function ListService (
  $log, $rootScope, $http,
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


  /// services

  function getStations (mobidulCode, cat)
  {
    $log.debug('> ListService getStations service');
    // $log.debug(cat);

    var hasPermission = ( cat === service.ALL_STATIONS )
                          ? UserService.getRequestAllStationsPermit()
                          : UserService.getRequestCategoryStationsPermit();

    $log.debug(hasPermission);

    if ( hasPermission )
    {
      var url  = mobidulCode + '/';
          url += ( cat !== service.ALL_STATIONS )
                   ? 'GetForCategory/' + cat
                   : 'GetStations/All';

      return $http.get( url );
    }else{
      return 'no-permission';
    }
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
