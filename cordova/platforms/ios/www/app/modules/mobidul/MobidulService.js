angular
  .module('Mobidul')
  .factory('MobidulService', MobidulService);


MobidulService.$inject = [
  '$log', '$rootScope', '$http'
];


function MobidulService (
  $log, $rootScope, $http
)
{
  var service =
  {
    // constants
    ALL_STATIONS    : 0,
    NEW_STATION     : 1,
    MOBIDUL_OPTIONS : 2,

    NEW_MOBIDUL_TITLE   : 'Neues Mobidul',

    MOBIDUL_MODE_RALLY  : 'rally',
    MOBIDUL_MODE_DEFAULT: 'default',

    // services
    menuReady     : menuReady,
    getConfig     : getConfig,
    fetchStations : fetchStations,
    getStations   : getStations,
    isRally       : isRally,
    getMobidulMode: getMobidulMode,

    // app config
    Config :
    {
      // TODO - these belong into a core ConfigService
      isMenuEnabled     : true,
      isHomeViewEnabled : true,

      // NOTE - these are directly tied to a Mobidul
      isGoToHomeEnabled  : true,
      isGoToAboutEnabled : true
    },

    // mobidul config
    Mobidul : {
      // background: '',
      // foreground: '',
      // font: '',
    },

    stations: []
  };


  /// services

  function menuReady ()
  {
    // $log.debug('menuReady in MobidulService');

    $rootScope.$emit('Menu::ready');
  }


  function getConfig (mobidulCode)
  {
     //$log.info('getConfig in MobidulService');
     //$log.debug(mobidulCode);

    return $http
      .get( mobidulCode + '/getConfig' )
      .success(function (response, status, headers, config)
      {
        $log.debug('Loaded Config for "' + mobidulCode + '" :');
        $log.debug(response);

        if ( response )
          service.Mobidul = response;

        return response;
      })
      .error(function (response, status, headers, config)
      {
        $log.error(response);
        $log.error(status);
      });
  }

  function fetchStations(mobidulCode){
    var url  = mobidulCode + '/GetStations/All';

    $http.get( url )
      .success(function(data){
        service.stations = data;
      });
  }

  function getStations(mobidulCode){
    //only works after fetchStations is already called and finished
    //return service.stations;

    //Needs to make a call, if function is executed on initial page load
    var url  = mobidulCode + '/GetStations/All';

    return $http.get( url )
      .success(function(data){
        return data;
      });
  }

  function getMobidulMode(mobidulCode){
    return $http
      .get(mobidulCode + '/getConfig')
      .success(function (response, status, headers, config) {
        return response.mode;
      })
      .error(function (response, status, headers, config) {
        $log.error(response);
        $log.error(status);
      })
  }

  function isRally(mobidulCode){

    //only works if getConfig is already executed and finished (issue on page load execution)
    //return service.Mobidul.mode == service.MOBIDUL_MODE_RALLY;

    $log.warn('MobidulService.isRally is deprecated - use MobidulService.getMobidulMode instead!');

    //TODO: check if service.Mobidul exists to prevent redundant call
    return $http
      .get( mobidulCode + '/getConfig' )
      .success(function (response, status, headers, config)
      {
        return response.mode == service.MOBIDUL_MODE_RALLY;
      })
      .error(function (response, status, headers, config)
      {
        $log.error(response);
        $log.error(status);
      });

  }


  return service;
}
