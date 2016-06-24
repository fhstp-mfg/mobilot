angular
  .module('Mobidul')
  .factory('LocalStorageService', LocalStorageService);


LocalStorageService.$inject = [
  '$log', '$localStorage'
];


function LocalStorageService (
  $log, $localStorage
) {
  /// LocalStorageService
  var service =
  {
    /// constants
    // ...

    /// vars
    localStorage : $localStorage,

    /// functions
    init : init,
    explainGenericGeoPermit : explainGenericGeoPermit,
    shouldExplainGenericGeoPermit : shouldExplainGenericGeoPermit,
    explainNearGeoPermit : explainNearGeoPermit,
    shouldExplainNearGeoPermit : shouldExplainNearGeoPermit
  };


  /// private helpers
  // ...


  /// services

  function init ()
  {
    service.localStorage = $localStorage.$default({
      EXPLAIN_GENERIC_GEO_PERMIT : true,
      EXPLAIN_NEAR_GEO_PERMIT : true
    });
  }


  // Generic Geo Permit

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


  /// events
  // ...


  return service;
}
