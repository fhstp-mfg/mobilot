angular
  .module('Mobidul')
  .factory('MobidulService', MobidulService);


MobidulService.$inject = [
  '$log', '$rootScope', '$stateParams',
  '$http', '$q', '$timeout', '$translate',
  'LocalStorageService'
  /*'RallyService'*/
];


function MobidulService (
  $log, $rootScope, $stateParams,
  $http, $q, $timeout, $translate,
  LocalStorageService
  /*RallyService*/
)
{
  /// MobidulService
  var service = {
    // constants
    ALL_STATIONS    : 0,
    NEW_STATION     : 1,
    MOBIDUL_OPTIONS : 2,

    NEW_MOBIDUL_TITLE : $translate.instant('NEW_MOBIDUL_NAME'),

    MOBIDUL_MODE_RALLY : 'rally',
    MOBIDUL_MODE_DEFAULT : 'default',

    MOBIDUL_MODES : [
    {
      name: 'rally',
      // states: [
      //   RallyService.STATUS_ACTIVATED,
      //   RallyService.STATUS_OPEN,
      //   RallyService.STATUS_COMPLETED
      // ],
      states: [
        'HIDDEN', 'ACTIVATED', 'OPEN', 'COMPLETED'
      ],

      elements: ['html', 'ifNear', 'inputCode', 'button', 'photoUpload', 'setTimeout', 'freeText'],

      // defaultState: RallyService.STATUS_ACTIVATED,
      defaultState: 'ACTIVATED',

      hiddenStations: true
    }, {
      name: 'default',
      elements: [ 'html' ],

      // states: [ RallyService.STATUS_OPEN ],
      states: 'OPEN',

      // defaultState: RallyService.STATUS_OPEN,
      defaultState: 'OPEN',
      
      hiddenStations: false
    }],

    /// services
    menuReady         : menuReady,
    getConfig         : getConfig,
    fetchStations     : fetchStations,
    getStations       : getStations,
    isRally           : isRally,
    getMobidulMode    : getMobidulMode,
    getModes          : getModes,
    getMobidulConfig  : getMobidulConfig,
    initProgress      : initProgress,
    resetProgress     : resetProgress,
    getProgress       : getProgress,
    setProgress       : setProgress,
    cloneMobidul      : cloneMobidul,

    /// app config
    Config :
    {
      // TODO: these belong into a core ConfigService
      isMenuEnabled     : true,
      isHomeViewEnabled : true,

      // NOTE: these are directly tied to a Mobidul
      isGoToHomeEnabled  : true,
      isGoToAboutEnabled : true,
      isCloneMobidulEnabled : true
    },

    /// mobidul config
    Mobidul : {
      // background: '',
      // foreground: '',
      // font: '',
    },

    stations: [],

    progress: '',
    state: ''
  };


  /// services

  function menuReady ()
  {
    // $log.debug('menuReady in MobidulService');

    $rootScope.$emit('Menu::ready');
  }


  function getConfig (mobidulCode)
  {
    // $log.info('getConfig in MobidulService');
    // $log.debug(mobidulCode);

    return $http.get(cordovaUrl + '/' + mobidulCode + '/getConfig')
    .success(function (response, status, headers, config) {
      // $log.debug('Loaded Config for "' + mobidulCode + '" :');
      // $log.debug(response);

      if ( response )
        service.Mobidul = response;

      return response;
    })
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);
    });
  }

  function initProgress () {
    var mobidulCode = $stateParams.mobidulCode;

    service.getMobidulConfig(mobidulCode)
    .then(function (config) {
      $log.debug('initProgress - config');
      $log.debug(config);
      LocalStorageService.getProgress(mobidulCode, config.states)
      .then(function (progress) {
        service.progress = progress;
      });
    });
  }

  function resetProgress (mobidulCode) {
    service.getMobidulConfig(mobidulCode)
    .then(function (config) {
      // $log.info('initProgress - config');
      // $log.debug(config);
      LocalStorageService.resetProgress(mobidulCode, config.states)
      .then(function (progress) {
        service.progress = progress;
      });
    });
  }

  function getProgress () {
    var mobidulCode = $stateParams.mobidulCode;

    return $q(function (resolve, reject) {
      LocalStorageService.getProgress(mobidulCode)
      .then(function (progress) {
        resolve(progress);
      });
    });

  }

  /**
   * set new state and say if progress should increase
   *
   * @string newState
   * @bool increaseProgress
   * @returns {*}
   */
  function setProgress (newState, increaseProgress) {
    var mobidulCode = $stateParams.mobidulCode;

    return $q(function (resolve, reject) {
      service.getMobidulConfig(mobidulCode)
      .then(function(config){
        var indexOf = config.states.indexOf(newState);

        if (indexOf != -1) {
          service.getProgress()
          .then(function (progress) {

            var state = {
              state: newState,
              progress: (increaseProgress) ? ++progress.progress : progress.progress
            };

            LocalStorageService.setState(mobidulCode, newState)
              .then(function () {
                resolve(newState);
              });
          });
        } else {
          reject('state not known');
        }
      });
    });
  }

  function fetchStations (mobidulCode) {
    $http.get(cordovaUrl + '/' + mobidulCode + '/GetStations/All')
    .success(function(data){
      service.stations = data;
    });
  }

  function getStations (mobidulCode) {
    return $q(function (resolve, reject) {
      if (service.stations[0]) {
        $timeout(function () {
          resolve(service.stations);
        })
      } else {
        // Needs to make a call, if function is executed on initial page load
        $http.get(cordovaUrl + '/' + mobidulCode + '/GetStations/All')
        .success(function (data) {
          service.stations = data;
          // $log.info('getting station data new');
          // $log.debug(data);
          resolve(data);
        });
      }
    });
  }

  function getMobidulMode (mobidulCode) {
    return $q(function ( resolve, reject ) {
      $http.get(cordovaUrl + '/' + mobidulCode + '/getConfig')
      .success(function (response, status, headers, config) {
        resolve(response.mode);
      })
      .error(function (response, status, headers, config) {
        $log.error(response);
        $log.error(status);
        reject(response);
      })
    });
  }

  function getModes () {
    return service.MOBIDUL_MODES;
  }

  function getMobidulConfig (mobidulCode) {
    return service.getMobidulMode(mobidulCode)
    .then(function (mode) {
      var mobidulMode = service.MOBIDUL_MODES.filter(function (mobidulMode) {
        return mode == mobidulMode.name;
      })[0];

      return mobidulMode;
    });
  }

  function isRally (mobidulCode) {
    // only works if getConfig is already executed and finished (issue on page load execution)
    // return service.Mobidul.mode == service.MOBIDUL_MODE_RALLY;

    $log.warn('MobidulService.isRally is deprecated - use MobidulService.getMobidulMode instead!');

    // TODO: check if service.Mobidul exists to prevent redundant call
    return $http.get(cordovaUrl + '/' + mobidulCode + '/getConfig')
    .success(function (response, status, headers, config) {
      return response.mode == service.MOBIDUL_MODE_RALLY;
    })
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);
    });
  }

  /**
   * This function is used in order to clone the current Mobidul with all it's attributes.
   *
   * @param mobidul An object containing the new name and code of the mobidul
   * @return {*} Accessing the cloning function on the Server
   */
  function cloneMobidul (mobidul) {
    var mobidulData = JSON.stringify(mobidul);

    return $http.post(cordovaUrl + '/' + mobidul.code + '/clone', mobidulData)
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
