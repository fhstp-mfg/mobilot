angular
  .module('Mobidul')
  .factory('LocalStorageService', LocalStorageService);


LocalStorageService.$inject = [
  '$log', '$localStorage', '$timeout', '$q'
];


function LocalStorageService (
  $log, $localStorage, $timeout, $q
) {
  /// LocalStorageService
  var service =
  {
    /// constants
    // ...

    /// vars
    localStorage : $localStorage,

    /// functions
    setValue: setValue,
    getValue: getValue,

    // GeoPermit functions
    init : init,
    explainGenericGeoPermit : explainGenericGeoPermit,
    shouldExplainGenericGeoPermit : shouldExplainGenericGeoPermit,
    explainNearGeoPermit : explainNearGeoPermit,
    shouldExplainNearGeoPermit : shouldExplainNearGeoPermit,

    // Rally progress functions
    getProgress   : getProgress,
    setProgress   : setProgress,
    setState      : setState,
    resetProgress : resetProgress,
    increaseScore : increaseScore,
    getScore      : getScore
  };

  /// private helpers
  // ...


  /// services

  function setValue (key, value) {
    var defer = $q.defer();

    $timeout(function () {
      service.localStorage[key] = value;
      defer.resolve(service.localStorage[key]);
    });

    return defer.promise;
  }
  
  function getValue (key) {
    var defer = $q.defer();

    $timeout(function () {
      defer.resolve(service.localStorage[key]);
    });

    return defer.promise;
  }

  // Generic Geo Permit

  function init ()
  {
    service.localStorage = $localStorage.$default({
      EXPLAIN_GENERIC_GEO_PERMIT : true,
      EXPLAIN_NEAR_GEO_PERMIT : true
    });
  }
  
  function explainGenericGeoPermit (explain) {
    // NOTE take care of digest cycles,
    //  just because a field is set here,
    //  doesn't actually mean it's already retrievable
    // NOTE check out docs, (use $timeout in your controller)
    service.localStorage.EXPLAIN_GENERIC_GEO_PERMIT = explain;
  }

  function shouldExplainGenericGeoPermit () {
    return service.localStorage.EXPLAIN_GENERIC_GEO_PERMIT;
  }


  // Near Geo Permit

  function explainNearGeoPermit (explain) {
    // NOTE take care of digest cycles,
    //  just because a field is set here,
    //  doesn't actually mean it's already retrievable
    // NOTE check out docs, (use $timeout in your controller)
    service.localStorage.EXPLAIN_NEAR_GEO_PERMIT = explain;
  }

  function shouldExplainNearGeoPermit () {
    return service.localStorage.EXPLAIN_NEAR_GEO_PERMIT;
  }


  function setProgress(mobidulCode, progress){

    //$log.info('LocalStorageService - setProgress:');
    //$log.debug(mobidulCode, progress);

    return $q(function(resolve, reject){
      //service.localStorage.progressStorage[mobidulCode] = progress;

      service.localStorage.progressStorage[mobidulCode]['progress'] = progress;

      $timeout(function(){
        resolve();
      });
    });

  }

  function setState(mobidulCode, state){
    return $q(function(resolve, reject) {
      service.localStorage.progressStorage[mobidulCode]['state'] = state;
      $timeout(function(){
        resolve();
      });
    });
  }

  /**
   * Returns progress entry from mobidul
   * Can't inject MobidulService therefore you have to pass the mobidul states
   *
   * @param mobidulCode
   * @param states
   * @returns {*}
   */
  function getProgress(mobidulCode, states){

    if(!service.localStorage.progressStorage){
      service.localStorage.progressStorage = {};
    }

    return $q(function(resolve, reject){
      if(! service.localStorage.progressStorage[mobidulCode]){

        if(! states[0]){
          $log.warn('You are trying to create a rally progress notation without passing the states of the this mobidulMode');
        }

        service.localStorage.progressStorage[mobidulCode] = {
          progress: 0,
          state: states[0],
          score: 0
        };
      }
      $timeout(function(){
        //$log.info('LocalStorageService - getProgress - $timeout - service.localStorage:');
        //$log.debug(service.localStorage);
        resolve( service.localStorage.progressStorage[mobidulCode] );
      });
    });
  }

  function resetProgress(mobidulCode, states){

    return $q(function(resolve, reject){

      var progress = service.localStorage.progressStorage[mobidulCode] = {
        progress: 0,
        state: states[0],
        score: 0
      };

      $timeout(function(){
        return resolve(progress);
      });
    });
  }

  function increaseScore (mobidulCode, score) {
    var deferred = $q.defer();

    if ( ! isNaN(service.localStorage.progressStorage[mobidulCode].score)) {
      var newScore = service.localStorage.progressStorage[mobidulCode].score += score;
      $timeout(function () {
        deferred.resolve(newScore);
      });
    } else {
      $timeout(function () {
        deferred.reject({msg: 'No entry in progress storage'});
      });
    }
    return deferred.promise;
  }

  function getScore (mobidulCode) {
    var deferred = $q.defer();

    $timeout(function () {
      deferred.resolve(service.localStorage.progressStorage[mobidulCode] && service.localStorage.progressStorage[mobidulCode].score);
    });

    return deferred.promise;
  }

  /// events
  // ...


  return service;
}
