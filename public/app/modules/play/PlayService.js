angular
  .module('Play')
  .factory('PlayService', PlayService);


PlayService.$inject = [
  '$log', '$http'
];


function PlayService (
  $log, $http
) {
  /// PlayService
  var service =
  {
    // vars
    // ...

    // services
    play : play
  };


  /// services

  function play (code)
  {
    return $http.get(cordovaUrl + '/JoinMobidul/' + code)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      return response;
    });
  }


  return service;
}
