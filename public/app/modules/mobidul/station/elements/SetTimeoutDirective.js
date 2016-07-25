(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblSetTimeout', SetTimeout);

SetTimeout.$inject = [
  '$log', '$timeout', '$interval', '$rootScope'
];

function SetTimeout(
  $log, $timeout, $interval, $rootScope
) {
  return {

    restrict: 'E',
    template: '<div data-ng-if="ctrl.show"><span>{{ctrl.countdown}}</span></div>',
    scope: {
      delay: '@',
      action: '@',
      show: '@'
    },
    link: function ($scope, $element, $attr, ctrl) {

      ctrl.countdown = parseInt($scope.delay);
      ctrl.show = $scope.show == 'true';

      if(ctrl.show){
        $rootScope.countdown = $interval(function(){
          ctrl.countdown--;
        }, 1000);
      }

      //preventing multiple timeouts when config is rendered
      //if( ! $rootScope.timeout){
      $timeout.cancel($rootScope.timeout);
      $log.info('timeout start', $scope.delay, $scope.action);
      $rootScope.timeout = $timeout(function () {
        $interval.cancel($rootScope.countdown);
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