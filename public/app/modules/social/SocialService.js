angular
  .module('Social')
  .factory('SocialService', SocialService);


SocialService.$inject = [
  '$log', '$http'
];


function SocialService (
  $log, $http
) {
  /// SocialService
  var service =
  {
    // vars
    // ...

    // services
    social : social,
    getSocialCodes : getSocialCodes
  };


  /// services

  function social (code)
  {
    return $http.get(cordovaUrl + '/SocialJoin/' + code)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      return response;
    });
  }

  function getSocialCodes (mobidulCode, stationCode, status)
  {
    return $http.get(cordovaUrl + '/SocialCodes/' + mobidulCode + '/' + stationCode + '/' + status)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  return service;
}
