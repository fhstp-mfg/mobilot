(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblSetTimeout', SetTimeout);


SetTimeout.$inject = [
  '$log', '$timeout', '$interval', '$rootScope'
];


function SetTimeout (
  $log, $timeout, $interval, $rootScope
) {
  return {
    restrict: 'E',
    template: '' +
      '<div data-ng-if="setTimeout.show">' +
        '<span translate="COUNTDOWN_INFO"></span>' +
        '<span>{{ setTimeout.countdown }}</span>' +
        '<br/><md-divider style="margin-bottom: 1em; margin-top: 0.5em"></md-divider>' +
      '</div>'
    ,

    scope: {
      delay: '@',
      action: '@',
      show: '@'
    },

    link: function ($scope, $element, $attr, SetTimeout) {
      SetTimeout.countdown = parseInt($scope.delay);
      SetTimeout.show = $scope.show == 'true';

      if ( SetTimeout.show ) {
        $rootScope.countdown = $interval(function () {
          SetTimeout.countdown--;
        }, 1000);
      }

      // Preventing multiple timeouts when config is rendered
      // if( ! $rootScope.timeout ) {
      $timeout.cancel($rootScope.timeout);

      $rootScope.timeout = $timeout(function () {
        $interval.cancel($rootScope.countdown);
        $rootScope.$broadcast('action', $scope.action);
      }, parseInt($scope.delay) * 1000);
    },
    controller: SetTimeoutController,
    controllerAs: 'setTimeout'
  };



  function SetTimeoutController (
    $scope, $element, $attrs
  ) {
    var setTimeout = this;
    
    // ...
  }
}

})();
