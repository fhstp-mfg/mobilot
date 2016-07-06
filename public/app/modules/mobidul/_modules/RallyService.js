angular
  .module('Mobidul')
  .factory('RallyService', RallyService);


RallyService.$inject = [
  '$log', '$state', '$stateParams', '$localStorage', '$timeout', '$q',
  'MobidulService'
];


function RallyService (
  $log, $state, $stateParams, $localStorage, $timeout, $q,
  MobidulService
) {
  /// RallyService
  var service =
  {
    /// constants
    STATUS_HIDDEN    : 'hidden',
    STATUS_ACTIVATED : 'activated',
    STATUS_OPEN      : 'open',
    STATUS_COMPLETED : 'completed',

    ACTIONS: ['openThis', 'completeThis', 'completeThisAndShowNext', 'say:', 'activateAndShowNext', 'goToCurrent'],

    /// vars
    localStorage     : $localStorage,
    // NOTE the originStations are the passed stations to the filterStations
    //  function, before filtering and the filteredStations, after filtering.
    originStations   : [],
    // NOTE currently obsolete and not used
    filteredStations : [],

    /// services
    refresh           : refresh,
    reset             : reset,

    isRallyMode       : isRallyMode,
    isEligible        : isEligible,

    filterStations    : filterStations,

    hasNext           : hasNext,
    activateNext      : activateNext,
    progressToNext    : progressToNext,
    getProgress       : getProgress,
    goToCurrent       : goToCurrent,
    getRallyLength    : getRallyLength,
    getActions        : getActions,

    /// XXX just for testing purposes, will be deprecated
    setProgress       : __setProgress,

    isStatusActivated : isStatusActivated,
    isStatusOpen      : isStatusOpen,
    isStatusCompleted : isStatusCompleted,

    getStatus         : getStatus,
    setStatus         : setStatus
  };


  /// XXX temp services

  function __setProgress (progress)
  {
    return $q(function(resolve, reject){
      MobidulService.getMobidulConfig($stateParams.mobidulCode)
        .then(function(config){
          MobidulService.adminSetProgress({
            progress: progress,
            state: config.states[0]
          })
            .then(function(){
              resolve();
            });
        });
    });
  }


  /// private helpers

  function _hasOriginStations () {
    return service.originStations && service.originStations.length > 0;
  }

  function _getNextStation (currentOrder)
  {

    return $q(function(resolve, reject){

      if(service.originStations[0]){
        var next = service.originStations.filter(function(station){
          //don't increment currentOrder, because it's most likely already incremented...
          return station.order == (currentOrder);
        })[0];

        if(next){
          resolve(next);
        }else{
          reject();
        }

      }else{
        MobidulService.getStations($stateParams.mobidulCode)
          .then(function(data){
            service.originStations = data;

            var next = service.originStations.filter(function(station){
              return station.order == (currentOrder);
            })[0];

            if(next){
              resolve(next);
            }else{
              reject()
            }

          })
      }
    });
  }



  /// services

  function refresh ()
  {
    //service.originStations = MobidulService.getStations();
    MobidulService.getStations($stateParams.mobidulCode)
      .then(function(data){
        service.originStations = data;
        //$log.info('Stations from MobidulService:');
        //$log.debug(service.originStations);
      });
    
    service.localStorage = $localStorage.$default({
      RallyProgress : 0,
      RallyStatus   : service.STATUS_ACTIVATED
    });
  }

  function reset () {
    //service.localStorage.RallyProgress = 0;
    //service.localStorage.RallyStatus   = service.STATUS_ACTIVATED;
    MobidulService.resetProgress($stateParams.mobidulCode);
  }

  function isRallyMode () {
    $log.error('RallyService.isRallyeMode() (deprecated) got called - please use MobidulService.isRally()');
    return true;
  }


  function isEligible (progressOrder)
  {

    var mobidulCode = $stateParams.mobidulCode;

    return $q(function(resolve, reject){

      MobidulService.getMobidulConfig(mobidulCode)
        .then(function(config){

          MobidulService.getProgress(mobidulCode)
            .then(function(progress){

              //$log.info('isEligible - progress');
              //$log.debug(progressOrder, progress, config);

              if(!config.hiddenStations || progressOrder <= progress.progress){
                resolve(true);
              }else{
                resolve(false);
              }
            });
        });
    });

  }


  function filterStations (stations)
  {
    service.originStations = stations;
    
    return MobidulService.getMobidulConfig($stateParams.mobidulCode)
      .then(function(config){
        if ( stations.length == 1 || !config.hiddenStations)
        {
          return service.originStations;
        }
        else
        {
          var filteredStations = [];

          angular.forEach( service.originStations, function (station, key)
          {
            // if ( station.order < service.localStorage.RallyProgress ||
            //      ( station.order == service.localStorage.RallyProgress &&
            //        service.localStorage.RallyStatus != service.STATUS_HIDDEN )
            if ( station.order <= service.localStorage.RallyProgress )
              filteredStations.push( station );
          });

          // NOTE XXX currently obsolete and not used
          service.filteredStations = filteredStations;

          return filteredStations;
        }
      });
  }

  function getRallyLength ()
  {
    return MobidulService.getStations($stateParams.mobidulCode)
      .then(function(data){
        //$log.info('getRallyLength - data:');
        //$log.debug(data);
        return data.length;
      });
  }

  function getActions ()
  {
    return service.ACTIONS;
  }

  function hasNext ()
  {
    var nextStation = _getNextStation();

    if ( nextStation === false )
    {
      alert('ERROR: You probably accessed the station directly ! Therefore there is no data about other stations and proceeding to the next station will not work! Please open a Station from StationList or MobidulMap ! (TODO can be fixed !)');

      return false;
    }
    else if ( nextStation === null )
    {
      alert('This is the last Station. You completed the Rally !');

      return false;
    }
    else
      return true;
  }


  function activateNext ()
  {
    return $q(function(resolve, reject){
      MobidulService.getMobidulConfig($stateParams.mobidulCode)
        .then(function(config){

          MobidulService.setProgress(config.states[0], true)
            .then(function(progress) {

              $log.info('RallyService - activateNext - progress:');
              $log.debug(progress);

              $timeout(function(){
                resolve();
              });

            });
        });
    });
  }


  // NOTE only run after activateNext has been called !
  function progressToNext ()
  {

    MobidulService.getProgress($stateParams.mobidulCode)
      .then(function(progress){

        _getNextStation(progress.progress)
          .then(function(next){

            $timeout(function(){
              $state.go('mobidul.station', { stationCode: next.code});
            });
          },function(){
            alert('This is the last Station. You completed the Mobidul !');
          });

      });
  }

  function goToCurrent ()
  {

    MobidulService.getProgress($stateParams.mobidulCode)
      .then(function(progress){

        if(service.originStations){

          MobidulService.getStations($stateParams.mobidulCode)
            .then(function(stations){
              service.originStations = stations;

              //$log.info('service.originStations:');
              //$log.debug(stations);

              var currentCode = service.originStations[progress.progress].code;

              $state.go('mobidul.station', {stationCode : currentCode});

            });
        }else{
          var currentCode = service.originStations[progress.progress].code;

          $state.go('mobidul.station', {stationCode : currentCode});
        }
      });
  }
  

  function getProgress () {
    return service.localStorage.RallyProgress;
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

  function getStatus (progressOrder)
  {

    var mobidulCode = $stateParams.mobidulCode;

    return $q(function(resolve, reject){
      MobidulService.getMobidulConfig(mobidulCode)
        .then(function(config){

          MobidulService.getProgress(mobidulCode)
            .then(function(progress){

              if(progressOrder < progress.progress){
                resolve(config.states[config.states.length -1 ]);
              }else if(progressOrder > progress.progress){
                if(config.hiddenStations){
                  resolve('hidden');
                }else{
                  resolve(config.defaultState);
                }
              }else{
                resolve(progress.state);
              }
            });
        });
    });
  }


  function setStatus (newStatus, order)
  {
    return $q(function(resolve, reject){
      MobidulService.setProgress(newStatus, false)
        .then(function(state){
          //$log.info('RallyService - setStatus:');
          //$log.debug(state);
          resolve(state);
        });
    });
  }


  /// events

  function _onNotCompleted () {
    alert('The current "activated" station has to be "completed" first, before the next station can be "activated" !');
  }


  return service;
}
