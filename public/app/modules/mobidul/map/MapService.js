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
  /// MapService obj
  var service =
  {
    // vars
    myPosition  : null,
    hasPosition : false,

    watchPositionId : null,
    pollStationsIntervalPromise : null,

    circleColor : {
      color   : '#08B21F',
      opacity : 0.5
    },

    // functions
    getCurrentPosition   : getCurrentPosition,
    watchPosition        : watchPosition,
    resetWatchPositionId : resetWatchPositionId,
    clearWatch           : clearWatch,
    startPollStations    : startPollStations,
    stopPollStations     : stopPollStations,

    setPollStationsIntervalPromise : setPollStationsIntervalPromise
  };


  /// services

  function getCurrentPosition ()
  {
    $log.debug('getting current position');

    return $geolocation
              .getCurrentPosition({
                timeout : 5000, // ms
              })
              .then(function (position)
              {
                $log.debug('got my position');
                $log.debug(position);

                service.hasPosition = true;
                service.myPosition  = position;

                return position;
              });
  }


  function watchPosition ()
  {
    var defer = $q.defer();

    service.watchPositionId =
      navigator.geolocation.watchPosition(function (position)
      {
        // $log.debug('MapService watchPosition');
        // $log.debug(position);

        service.myPosition = position;

        defer.resolve( position );
      },
      function (error)
      {
        // $log.error(error);
      },
      {
        timeout            : 5000,  // ms
        maximumAge         : 10000, // ms
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
    $log.debug('Clear watch with ID :');
    $log.debug(service.watchPositionId);

    if ( service.watchPositionId )
    {
      navigator.geolocation.clearWatch( service.watchPositionId );

      service.resetWatchPositionId();
    }
  }


  function setPollStationsIntervalPromise ( promise )
  {
    service.pollStationsIntervalPromise = promise;
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
    var defer = $q.defer();

    if ( service.pollStationsIntervalPromise )
    {
      var canceled = $interval.cancel( service.pollStationsIntervalPromise );
      if ( canceled )
        service.pollStationsIntervalPromise = null;
    }
    else
      $log.debug('No poll station interval promise defined.');

    defer.resolve();

    return defer.promise;
  }


  return service;
}
