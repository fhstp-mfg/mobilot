(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblSetTimeout', SetTimeout);

SetTimeout.$inject = [
  '$log', '$timeout', '$rootScope'
];

function SetTimeout(
  $log, $timeout, $rootScope
) {
  return {

    restrict: 'E',
    template: '<div>setTimeout</div>',
    scope: {
      delay: '@',
      action: '@'
    },
    link: function ($scope, $element, $attr, ctrl) {


      //preventing multiple timeouts when config is rendered
      //if( ! $rootScope.timeout){
      $timeout.cancel($rootScope.timeout);
      $log.info('timeout start', $scope.delay, $scope.action);
      $rootScope.timeout = $timeout(function () {
        $rootScope.$broadcast('action', $scope.action);
      }, parseInt($scope.delay) * 1000);
      //}

    },
    controller: SetTimeoutController,
    controllerAs: 'ctrl'
  };

  function SetTimeoutController($scope, $element, $attrs) {
    var ctrl = this;

  }
}

})();