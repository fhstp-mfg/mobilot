(function () {
  'use strict';
  
  angular.module('Mobidul')
    .factory('GeoLocationService', GeoLocationService);
  
  GeoLocationService.$inject = [
    '$rootScope', '$log', '$q', '$interval', '$geolocation'
  ];
  
  function GeoLocationService(
    $rootScope, $log, $q, $interval, $geolocation
  ) {
    var service = {

      /// constants
      WATCH_INTERVAL        : 5000, //ms
      MAX_ACCURACY          : 20, //m

      /// vars
      interval              : null,

      /// services
      startPositionWatching : startPositionWatching,
      stopPositionWatching  : stopPositionWatching

    };

    ///////////////////

    function startPositionWatching (station)
    {
      $log.info('start position watching for:');
      $log.debug(station);

      service.interval = $interval(function() {
        $log.debug('watch position');
        _checkPosition(station)
          .then(function (d) {

            $log.info("GeoLocationService - startPositionWatching - service.interval - checkPosition:");
            $log.debug(d);

            var distance = d.d,
              accuracy = d.a;

            if(d.error || accuracy > service.MAX_ACCURACY){
              $rootScope.$broadcast('inaccurate', true);
            }else{
              $rootScope.$broadcast('distance', d);
              
            }
            
          }, function (err) {
            //$log.info("Error: Checking Position");
            //$log.error(err);
            $rootScope.$broadcast('inaccurate', true);
          });
      }, service.WATCH_INTERVAL);
    }

    function stopPositionWatching ()
    {
      //$log.info('stop position watching');
      if(service.interval){
        $interval.cancel(service.interval);
        service.interval = null;
      }
    }

    /**
     * Checks Position and returns distance to Station
     *
     * @param station
     * @returns {*}
     * @private
     */
    function _checkPosition (station){

      return $geolocation
        .getCurrentPosition({
          timeout: service.WATCH_INTERVAL,
          //maximumAge: 200,
          enableHighAccuracy: true
        })
        .then(function (position) {

          var e;

          //$log.info('GeoLocationService - _checkPosition - position:');
          //$log.debug(position);

          if(position.error){
            e = position.error;
          }

          var accuracy = position.coords.accuracy;

          position = {
            'lat': position.coords.latitude,
            'lon': position.coords.longitude
          };

          var d = _calcDistance(position, station);

          return {d: d, a: accuracy, error: e};

        }, function (error) {
          return error;

        });
    }

    /**
     * Calculates Distance between two positions
     *
     * @param pos1 {lat: x, lon: y}
     * @param pos2
     * @returns {number}
     * @private
     */
    function _calcDistance (pos1, pos2)
    {
      var lat1 = pos1.lat,
          lat2 = pos2.lat,
          lon1 = pos1.lon,
          lon2 = pos2.lon;

      //calc distance between user and station
      var R = 6371000; // metres
      var phi1 = _toRad(lat1);
      var phi2 = _toRad(lat2);
      var deltaPhi = _toRad(lat2-lat1);
      var deltaLambda = _toRad(lon2-lon1);

      var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;

      return d;

    }

    /**
     * Little Helper to calculate Radians
     *
     * @param x
     * @returns {number}
     * @private
     */
    function _toRad (x)
    {
      return x * Math.PI / 180;
    }

    
    return service;
  }
  
})();