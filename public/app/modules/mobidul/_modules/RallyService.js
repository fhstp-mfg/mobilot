angular
  .module('Mobidul')
  .factory('RallyService', RallyService);


RallyService.$inject = [
  '$log', '$state', '$stateParams', '$localStorage', '$timeout',
  'MobidulService'
];


function RallyService (
  $log, $state, $stateParams, $localStorage, $timeout,
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

  function __setProgress (order)
  {
    service.localStorage.RallyProgress = order;
  }


  /// private helpers

  function _hasOriginStations () {
    return service.originStations && service.originStations.length > 0;
  }

  function _getNextStation ()
  {
    if ( _hasOriginStations() )
    {
      var progressOrder = service.localStorage.RallyProgress;
      var nextStation   = service.originStations[ progressOrder ];

      return ( nextStation ) ? nextStation : null;
    }
    else
      return false;
  }



  /// services

  function refresh ()
  {
    //service.originStations = MobidulService.getStations();
    MobidulService.getStations($stateParams.mobidulCode)
      .then(function(data){
        service.originStations = data.data;
        //$log.info('Stations from MobidulService:');
        //$log.debug(service.originStations);
      });
    
    service.localStorage = $localStorage.$default({
      RallyProgress : 0,
      RallyStatus   : service.STATUS_ACTIVATED
    });
  }

  function reset () {
    service.localStorage.RallyProgress = 0;
    service.localStorage.RallyStatus   = service.STATUS_ACTIVATED;
  }

  function isRallyMode () {
    $log.error('RallyService.isRallyeMode() (deprecated) got called - please use MobidulService.isRally()');
    return true;
  }


  function isEligible (progressOrder)
  {
    return getStatus( progressOrder ) !== service.STATUS_HIDDEN;
  }


  function filterStations (stations)
  {
    service.originStations = stations;

    if ( stations.length == 1 )
      return service.originStations;
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
  }

  function getRallyLength ()
  {

    return MobidulService.getStations($stateParams.mobidulCode)
      .then(function(data){
        return data.data.length;
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
    if ( isStatusCompleted() )
    {
      service.localStorage.RallyProgress++;
      service.localStorage.RallyStatus = service.STATUS_ACTIVATED;
    }
    else
      _onNotCompleted();
  }


  // NOTE only run after activateNext has been called !
  function progressToNext ()
  {
    if ( hasNext() )
    {
      var nextStation = _getNextStation();

      if ( $stateParams.stationCode == nextStation.code )
        alert('You have to complete this station first !');

      $timeout(function(){
        $state.go('mobidul.station', { stationCode : nextStation.code });
      }, 300);
    }
    else
      alert('There are no next stations ! (obsolete error)');
  }

  function goToCurrent ()
  {
    var currentCode = service.originStations[getProgress()].code;

    //$log.info('RallyService - goToCurrent - currentCode:');
    //$log.debug(currentCode);

    $state.go('mobidul.station', {stationCode : currentCode});
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


  // NOTE if progressOrder param is passed, then
  //  the status of that station (by order) will be returned,
  //  else it will return the status of the "activated" station
  function getStatus (progressOrder)
  {
    if ( typeof progressOrder === 'undefined' )
      return service.localStorage.RallyStatus;

    else
    {
      if ( progressOrder < service.localStorage.RallyProgress )
        return service.STATUS_COMPLETED;

      else if ( progressOrder > service.localStorage.RallyProgress )
        return service.STATUS_HIDDEN;

      else
        // NOTE here we don't explicitely return STATUS_ACTIVATED, since
        //  it might be that even the last station can be "completed",
        //  without having a successor
        return service.localStorage.RallyStatus;
    }
  }


  function setStatus (newStatus)
  {
    if ( newStatus === service.STATUS_ACTIVATED ||
         newStatus === service.STATUS_OPEN      ||
         newStatus === service.STATUS_COMPLETED )

      service.localStorage.RallyStatus = newStatus;
  }


  /// events

  function _onNotCompleted () {
    alert('The current "activated" station has to be "completed" first, before the next station can be "activated" !');
  }


  return service;
}
