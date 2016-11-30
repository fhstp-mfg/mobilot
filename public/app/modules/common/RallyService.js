angular
  .module('Mobilot')
  .factory('RallyService', RallyService);


RallyService.$inject = [
  '$log', '$state', '$stateParams', '$translate',
  '$localStorage', '$timeout', '$q', '$mdDialog',
  'MobidulService', 'LocalStorageService', 'GeoLocationService'
];


function RallyService (
  $log, $state, $stateParams, $translate,
  $localStorage, $timeout, $q, $mdDialog,
  MobidulService, LocalStorageService, GeoLocationService
) {
  /// RallyService
  var service = {
    /// constants
    STATUS_HIDDEN    : 'HIDDEN',
    STATUS_ACTIVATED : 'ACTIVATED',
    STATUS_OPEN      : 'OPEN',
    STATUS_COMPLETED : 'COMPLETED',

    ACTIONS: {
      OPEN_THIS: {
        action: function () {
          return LocalStorageService.increaseScore($stateParams.mobidulCode, 10)
          .then(function (newScore) {
            return service.setStatusOpen().then(function () { return true });
          }, function (error) {
            $log.error('RallyService.ACTIONS.OPEN_THIS.action', error);
          });
        }
      },
      COMPLETE_THIS: {
        action: function () {
          return service.setStatusCompleted().then(function(){return true});
        }
      },
      COMPLETE_THIS_AND_SHOW_NEXT: {
        action: function () {
          return $q(function ( resolve, reject ) {

            // increase score...
            LocalStorageService.increaseScore($stateParams.mobidulCode, 10)
            .then(function (newScore) {

              service.activateNext()
              .then(function () {
                service.progressToNext();
                resolve(false);
              });
            }, function (error) {
              $log.error('RallyService.ACTIONS.COMPLETE_THIS_AND_SHOW_NEXT.action', error);
            });
          });
        }
      },
      SAY: {
        attr: true,
        action: function (attr) {
          return $q(function ( resolve, reject ) {
            var sayActionDialog = $mdDialog.alert()
            .parent( angular.element(document.body) )
            .clickOutsideToClose(true)
            .title($translate.instant('SAY_TITLE'))
            .textContent(attr)
            .ariaLabel($translate.instant('SAY_TITLE'))
            .ok($translate.instant('CLOSE'));

            $mdDialog.show(sayActionDialog);
            resolve(false);
          });
        }
      },
      GO_TO_CURRENT: {
        action: function () {
          return $q(function ( resolve, reject ) {
            service.goToCurrent();
            resolve(false);
          })
        }
      },
      SET_STATE: {
        attr: true,
        action: function (state) {
          return service.setStatus(state).then(function () {return true});
        }
      },
      VERIFY_IF_NEAR: {
        hidden: true,
        action: function (fallback) {
          GeoLocationService.stopPositionWatching();
          service.performAction(fallback);
        }
      }
    },

    /// vars
    localStorage       : $localStorage,
    // NOTE: the originStations are the passed stations to the filterStations
    //  function, before filtering and the filteredStations, after filtering.
    originStations     : [],
    // NOTE: currently obsolete and not used
    filteredStations   : [],

    /// services
    refresh            : refresh,
    reset              : reset,

    isEligible         : isEligible,

    filterStations     : filterStations,

    activateNext       : activateNext,
    progressToNext     : progressToNext,
    getProgress        : getProgress,
    goToCurrent        : goToCurrent,
    getRallyLength     : getRallyLength,
    getActions         : getActions,
    performAction      : performAction,

    setProgress        : setProgress,

    isStatusActivated  : isStatusActivated,
    isStatusOpen       : isStatusOpen,
    isStatusCompleted  : isStatusCompleted,

    getStatus          : getStatus,
    setStatus          : setStatus,
    setStatusOpen      : setStatusOpen,
    setStatusCompleted : setStatusCompleted,

    goToStation        : goToStation
  };


  /// XXX: temp services

  function setProgress (progress) {
    var mobidulCode = $stateParams.mobidulCode;

    return $q(function (resolve, reject) {
      MobidulService.getMobidulConfig(mobidulCode)
        .then(function (config) {
          LocalStorageService.setProgress(mobidulCode, progress)
            .then(function () {
              resolve();
            });
        });
    });
  }


  /// private helpers

  function _getNextStation (currentOrder) {
    return $q(function (resolve, reject) {
      if ( service.originStations[0] ) {
        var next = service.originStations.filter(function (station) {
          // don't increment currentOrder, because it's most likely already incremented...
          return station.order == currentOrder;
        })[0];

        if (next) {
          resolve(next);
        } else {
          reject();
        }
      } else {
        MobidulService.getStations($stateParams.mobidulCode)
          .then(function (data) {
            service.originStations = data;

            var next = service.originStations.filter(function (station) {
              return station.order == currentOrder;
            })[0];

            if (next) {
              resolve(next);
            } else {
              reject();
            }
          });
      }
    });
  }

  function _getOriginStations () {
    return $q(function (resolve, reject) {
      if ( service.originStations[0] ) {
        $timeout(function () {
          resolve(service.originStations);
        });
      } else {
        MobidulService.getStations($stateParams.mobidulCode)
          .then(function (stations) {
            service.originStations = stations;

            resolve(service.originStations);
          });
      }
    });
  }


  /// services

  function refresh () {
    // service.originStations = MobidulService.getStations();
    MobidulService.getStations($stateParams.mobidulCode)
      .then(function (data) {
        service.originStations = data;
        // $log.info('Stations from MobidulService:');
        // $log.debug(service.originStations);
      });

    service.localStorage = $localStorage.$default({
      RallyProgress : 0,
      RallyStatus : service.STATUS_ACTIVATED
    });
  }

  function reset () {
    MobidulService.resetProgress($stateParams.mobidulCode);
  }

  function isEligible (progressOrder) {
    var mobidulCode = $stateParams.mobidulCode;

    return $q(function (resolve, reject) {
      MobidulService.getMobidulConfig(mobidulCode)
        .then(function (config) {
          MobidulService.getProgress(mobidulCode)
            .then(function (progress) {
              if (
                ! config.hiddenStations ||
                progressOrder <= progress.progress
              ) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
        });
    });
  }

  function filterStations (stations) {
    service.originStations = stations;

    var defer = $q.defer(),
        mobidulCode = $stateParams.mobidulCode;

    MobidulService.getMobidulConfig(mobidulCode)
      .then(function (config) {
        if ( stations.length == 1 || ! config.hiddenStations ) {
          defer.resolve(service.originStations);
        } else {
          var filteredStations = [];

          MobidulService.getProgress(mobidulCode)
          .then(function (progress) {

            angular.forEach(service.originStations, function (station, key) {
              if ( station.order <= progress.progress ) {
                filteredStations.push(station);
              }
            });

            // NOTE XXX: currently obsolete and not used
            service.filteredStations = filteredStations;

            defer.resolve(filteredStations);
          });
        }
      });

    return defer.promise;
  }

  function getRallyLength () {
    return MobidulService.getStations($stateParams.mobidulCode)
      .then(function (data) {
        return data.length;
      });
  }

  function getActions () {

    var actions = [];

    for ( var k in service.ACTIONS ) {
      if(service.ACTIONS.hasOwnProperty(k)){
        var key = k;
        if ( service.ACTIONS[k].attr ) key += ':';
        if ( ! service.ACTIONS[k].hidden ) actions.push(key);
      }
    }

    return actions;
  }

  function performAction ( actionString ) {
    var action = actionString.split(':')[0];
    var attr = actionString.replace(action + ':', '');

    return service.ACTIONS[action].action(attr);

  }

  function activateNext () {
    return $q(function (resolve, reject) {
      MobidulService.getMobidulConfig($stateParams.mobidulCode)
        .then(function (config) {
          MobidulService.setProgress(config.states[0], true)
            .then(function (state) {
              resolve();
            });
        });
    });
  }

  // NOTE: only run after activateNext has been called !
  function progressToNext () {
    MobidulService.getProgress($stateParams.mobidulCode)
      .then(function (progress) {
        _getNextStation(progress.progress)
          .then(function (next) {
            $timeout(function () {
              $state.go('mobidul.station', { stationCode: next.code});
            });
          }, function () {
            alert('Das ist die letzte Station. Du hast das Rally erfolgreich abgeschlossen!');
          });
      });
  }

  function goToCurrent () {
    MobidulService.getProgress($stateParams.mobidulCode)
      .then(function (progress) {
        if ( service.originStations ) {
          MobidulService.getStations($stateParams.mobidulCode)
            .then(function (stations) {
              service.originStations = stations;

              var currentCode = service.originStations[ progress.progress ].code;

              $state.go('mobidul.station', { stationCode : currentCode });
            });
        } else {
          var currentCode = service.originStations[ progress.progress ].code;

          $state.go('mobidul.station', { stationCode : currentCode });
        }
      });
  }

  function getProgress () {
    return $q(function(resolve, reject){
      MobidulService.getProgress()
        .then(function(progress){
          resolve(progress);
        });
    });
  }

  function goToStation (order) {
    _getOriginStations()
      .then(function (stations) {
        var goTo = stations.filter(function (station) {
          return station.order == order;
        })[0];

        // TODO: What if goTo is undefined ?
        $state.go('mobidul.station', { stationCode: goTo.code });
      });
  }

  function isStatusActivated () {
    return service.localStorage.RallyStatus == service.STATUS_ACTIVATED;
  }

  function isStatusOpen () {
    return service.localStorage.RallyStatus == service.STATUS_OPEN;
  }

  function isStatusCompleted () {
    return service.localStorage.RallyStatus == service.STATUS_COMPLETED;
  }


  function getStatus (progressOrder) {
    var mobidulCode = $stateParams.mobidulCode;

    progressOrder = parseInt(progressOrder);

    return $q(function (resolve, reject) {
      MobidulService.getMobidulConfig(mobidulCode)
        .then(function (config) {
          MobidulService.getProgress(mobidulCode)
            .then(function (progress) {
              progress.progress = parseInt(progress.progress);
              if ( progressOrder < progress.progress ) {
                resolve( config.states[ config.states.length-1 ] );
              } else if ( progressOrder > progress.progress ) {
                if ( config.hiddenStations ) {
                  resolve( service.STATUS_HIDDEN );
                } else {
                  resolve( config.defaultState );
                }
              } else {
                resolve( progress.state );
              }
            });
        });
    });
  }

  function setStatus (newStatus, order) {
    return $q(function (resolve, reject) {
      MobidulService.setProgress(newStatus)
        .then(function (state) {
          resolve(state);
        }, function (error) {
          reject(error);
        });
    });
  }

  function setStatusOpen (order) {
    return setStatus(service.STATUS_OPEN, order);
  }

  function setStatusCompleted (order) {
    return setStatus(service.STATUS_COMPLETED, order);
  }

  /// events
  // ...

  return service;
}
