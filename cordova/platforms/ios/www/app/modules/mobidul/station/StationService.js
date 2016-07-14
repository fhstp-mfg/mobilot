angular
  .module('Mobidul')
  .factory('StationService', StationService);


StationService.$inject = [
  '$log', '$http'
];


function StationService (
  $log, $http
) {
  /// StationService
  var service =
  {
    getStation       : getStation,
    getName          : getName,
    setName          : setName,
    requestValidCode : requestValidCode,
    getMapStations   : getMapStations,

    currentStation :
    {
      name : ''
    }
  };


  /// services

  function getStation (mobidulCode, stationCode)
  {
    var serviceUrl = cordovaUrl + '/';

    // TODO - check if the following regex is correct
    if ( /^\d+$/.test(stationCode) )
      serviceUrl += 'GetContent/';
    else
      serviceUrl += 'GetContentForCode/' + mobidulCode + '/';

    serviceUrl += stationCode + '/';

    return $http.get(serviceUrl);
  }


  function getName () {
    return service.currentStation.name;
  }

  function setName (stationName) {
    service.currentStation.name = stationName;
  }


  function requestValidCode (code)
  {
    var stationCode = code.replace(/[^a-z0-9]/g, '');
    var serviceUrl  = cordovaUrl + '/RequestValidCode/' + stationCode;

    return $http.get(serviceUrl)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);
    });
  }


  function getMapStations (mobidulCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/GetStations');
  }


  return service;
}
