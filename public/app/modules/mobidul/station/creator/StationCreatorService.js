angular
  .module('StationCreator')
  .factory('StationCreatorService', StationCreatorService);


StationCreatorService.$inject = [
  '$log', '$http'
];


function StationCreatorService (
  $log, $http
) {
  /// StationCreatorService
  var service = {
    /// constants
    BASIS_TAB_INDEX      : 0,
    PLACE_TAB_INDEX      : 1,
    CATEGORIES_TAB_INDEX : 2,
    SETTINGS_TAB_INDEX   : 3,

    STATION_CODE_EXAMPLE : 'station-code',

    /// vars
    marker : {
      coords : null
    },
    markersAll : [],

    /// functions
    loadCategories       : loadCategories,
    loadStation          : loadStation,
    addStation           : addStation,
    saveStation          : saveStation,
    deleteStation        : deleteStation,
    cloneMyStation       : cloneMyStation,
    updateStationContent : updateStationContent
  };


  /// services

  function loadCategories (mobidulCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/GetCategories');
  }


  function loadStation (mobidulCode, stationCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/GetForCode/' + stationCode);
  }


  function addStation (mobidulCode, stationData) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/AddStation', stationData);
  }


  function saveStation (mobidulCode, stationCode, stationData) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/SaveStation/' + stationCode, stationData);
  }

  function updateStationContent (mobidulCode, stationCode, content) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/UpdateContent/' + stationCode, { content: content });
  }

  function deleteStation (mobidulCode, stationCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/RemoveStationByCode/' + stationCode);
  }

  /**
   * This function calls the Server in order to clone the current Station.
   * It also contains the ID of the new station.
   *
   * @param mobidulCode Code of the Mobidul the station belongs to.
   * @param stationCode Code of the Station that will be duplicated.
   * @returns {*} Call of the Server
   */
  function cloneMyStation (mobidulCode, stationCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/cloneStation/' + stationCode)
      .success(function (response, status, headers, config) {
        return response;
      })
      .error(function (response, status, headers, config) {
        $log.error(response);
        $log.error(status);
      });
  }

  return service;
}
