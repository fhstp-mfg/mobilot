(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblInputCode', InputCode);

InputCode.$inject = [
  '$log',
  '$rootScope'
];

function InputCode (
  $log,
  $rootScope
) {
  return {
    restrict: 'E',
    scope: {
      verifier: '@',
      success: '@',
      error: '@'
    },
    template: "<div><form ng-submit='ctrl.submit()'><md-input-container><input ng-model='ctrl.input' data-success='success' data-error='error'</input></md-input-container><md-button type='submit' class='md-raised md-primary'>Go</md-button></form></div>",

    link: function ($scope, $element, $attrs, ctrl) {
      // ...
    },

    controller: function ($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.submit = submit;

      function submit () {

        if (ctrl.input) {
          if (ctrl.input.toLowerCase() == $scope.verifier.toLowerCase()) {
            $rootScope.$broadcast('action', $scope.success);
          } else {
            $rootScope.$broadcast('action', $scope.error);
          }
        }
      }
    },
    controllerAs: 'ctrl'
  }
}
})();
