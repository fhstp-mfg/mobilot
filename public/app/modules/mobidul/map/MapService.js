angular
  .module('Mobidul')
  .factory('MapService', MapService);


MapService.$inject = [
  '$log', '$interval', '$q',
  '$geolocation'
];


function MapService (
  $log, $interval, $q,
  $geolocation
) {
  var constants = {};

  constants._default_center = ( googleLoaded )
    ? new google.maps.LatLng(48.24935983096312, 15.759132385253922)
    : null;

  var service =
  {
    // constants
    DEFAULT_CENTER : constants._default_center,

    INFO_WINDOW_OPTIONS : {
      pixelOffset : {
        height : -35,
        width  : 0
      }
    },

    // vars
    myPosition  : null,
    hasPosition : false,

    firstLoad   : true,
    lastCenter  : null,
    lastZoom    : 8,

    watchPositionId : null,
    pollStationsIntervalPromise      : null,
    gatheringPositionIntervalPromise : null,

    circleColor : {
      color   : '#08B21F',
      opacity : 0.5
    },

    // geolocation error codes
    PERMISSION_DENIED    : 1,
    POSITION_UNAVAILABLE : 2,
    TIMEOUT              : 3,
    // geolocation messages
    EXPLAIN_GENERIC_GEO_PERMIT       : 'Mobilot benötigt die Berechtigung deine Position zu ermitteln.',
    EXPLAIN_NEAR_GEO_PERMIT  : 'Um Mobidule in deiner Nähe zu finden, benötigt Mobilot die Berechtigung deine Position zu ermitteln.',
    // geolocation error message
    UNKNOWN_ERROR_MSG        : 'Unbekannter Fehler. Bitte kontaktiere einen Administrator.',
    PERMISSION_DENIED_MSG    : 'Deine Position konnte nicht ermittelt werden. Bitte aktiviere in den Einstellungen die Berechtigung, um deine Position zu ermitteln.',
    POSITION_UNAVAILABLE_MSG : 'Leider konnte deine Position nicht ermittelt werden. Möchtest du es nochmal probieren?',
    TIMEOUT_MSG              : 'Leider hat es zu lange gedauert deine Position zu ermitteln. Möchtest du es nochmal probieren?',

    // functions
    reset : reset,

    getCurrentPosition   : getCurrentPosition,
    watchPosition        : watchPosition,
    resetWatchPositionId : resetWatchPositionId,
    clearWatch           : clearWatch,
    startPollStations    : startPollStations,
    stopPollStations     : stopPollStations,

    getDefaultCenterLat  : getDefaultCenterLat,
    getDefaultCenterLng  : getDefaultCenterLng,

    setPollStationsIntervalPromise      : setPollStationsIntervalPromise,
    setGatheringPositionIntervalPromise : setGatheringPositionIntervalPromise,
    cancelGatheringPositionInterval     : cancelGatheringPositionInterval
  };


  /// services

  function reset ()
  {
    service.firstLoad  = true;
    service.lastCenter = null;
    service.lastZoom   = 8;
  }


  function getCurrentPosition ()
  {
    // $log.debug('getting current position in MapService :');

    var currentPositionPromise =
      $geolocation
        .getCurrentPosition({
          timeout : 5000, // ms
        })
        .then(function (position)
        {
          //$log.debug('got my position');
          //$log.debug(position);

          service.hasPosition = true;
          service.myPosition  = position;

          return position;

        }, function (error)
        {
          // $log.error('got geolocation error :');
          // $log.error(error);

          return error;
        });

    return currentPositionPromise;
  }


  // NOTE @deprecated - uses _watchPosition in MapController instead
  function watchPosition ()
  {
    var defer = $q.defer();

    service.watchPositionId =
      navigator.geolocation.watchPosition(function (position)
      {
        // $log.debug('MapService watchPosition :');
        // $log.debug(position);

        service.myPosition = position;

        defer.resolve( position );
      },
      function (error)
      {
        $log.error('MapService watchPosition error :');
        $log.error(error);

        // defer.resolve();
      },
      {
          timeout           : 5000,  // ms
          maximumAge        : 10000, // ms
          enableHighAccuracy : true
      });

    return defer.promise;
  }


  function resetWatchPositionId ()
  {
    service.watchPositionId = null;
  }


  function clearWatch ()
  {
    // $log.debug('Clear watch with ID :');
    // $log.debug(service.watchPositionId);

    if ( service.watchPositionId )
    {
      navigator.geolocation.clearWatch( service.watchPositionId );

      service.resetWatchPositionId();
    }
  }


  function startPollStations ()
  {
    // $log.debug('startPollStations called');

    var defer = $q.defer();

    service
      .stopPollStations()
      .then(function ()
      {
        defer.resolve();
      });

    return defer.promise;
  }


  function stopPollStations ()
  {
    // TODO - check if this is overall necessary
    var defer = $q.defer();

    if ( service.pollStationsIntervalPromise )
    {
      var canceled = $interval.cancel( service.pollStationsIntervalPromise );

      if ( canceled )
        service.pollStationsIntervalPromise = null;
    }
    else
      // $log.debug('No poll station interval promise defined.');

    // TODO - check if this is the right time to resolve the defer
    defer.resolve();

    return defer.promise;
  }


  function getDefaultCenterLat ()
  {
    if ( service.lastCenter && service.lastCenter.latitude )

      return service.lastCenter.latitude;

    return service.DEFAULT_CENTER.lat();
  }


  function getDefaultCenterLng ()
  {
    if ( service.lastCenter && service.lastCenter.longitude )

      return service.lastCenter.longitude;

    return service.DEFAULT_CENTER.lng();
  }


  function setPollStationsIntervalPromise ( promise )
  {
    service.pollStationsIntervalPromise = promise;
  }


  function setGatheringPositionIntervalPromise ( promise )
  {
    service.gatheringPositionIntervalPromise = promise;
  }


  function cancelGatheringPositionInterval ()
  {
    if ( service.gatheringPositionIntervalPromise )
    {
      var canceled = $interval.cancel( service.gatheringPositionIntervalPromise );

      if ( canceled )
        service.gatheringPositionIntervalPromise = null;
    }
    else {
      $log.warn('No gathering position interval promise defined.');
    }
  }


  return service;
}
