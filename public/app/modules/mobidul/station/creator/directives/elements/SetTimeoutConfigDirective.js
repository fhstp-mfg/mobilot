(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('setTimeoutConfig', SetTimeoutConfig);

SetTimeoutConfig.$inject = [
  '$log',
  'RallyService'
];

function SetTimeoutConfig(
  $log,
  RallyService
) {
  return {

    restrict: 'E',
    template: '<div>' +
    '<md-input-container><input type="number" data-ng-model="ctrl.minutes" name="minutes"> <label for="minutes">Minuten</label></md-input-container>' +
    '<md-input-container><input type="number" data-ng-model="ctrl.seconds" name="seconds"><label for="seconds">Sekunden</label> </md-input-container>' +
    '' +
    '<action-selector data-opts="ctrl.actionOpts" data-selection="action" data-name="Aktion"></action-selector>' +
    '</div>',
    scope: {
      delay: '=',
      action: '='
    },
    link: function ($scope, $element, $attr, ctrl) {

      $scope.delay = parseInt($scope.delay);

      ctrl.minutes = Math.floor($scope.delay/60);
      ctrl.seconds = $scope.delay % 60;

      $scope.$watch('ctrl.minutes', function(value){
        if(value < 0){
          ctrl.minutes = 0;
        }
        $scope.delay = value * 60 + ctrl.seconds;
      });

      $scope.$watch('ctrl.seconds', function(value){
        if(value >= 60){
          ctrl.seconds = 0;
          ctrl.minutes++;
        } else if (value < 0){
          ctrl.minutes--;

          if ( ctrl.minutes <= 0 ) ctrl.seconds = 0;
          else ctrl.seconds = 59;
        }
        $scope.delay = ctrl.minutes * 60 + value;
      });

    },
    controller: SetTimeoutConfigController,
    controllerAs: 'ctrl'
  };

  function SetTimeoutConfigController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

  }
}

})();