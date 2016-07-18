(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblInputCode', InputCode);

InputCode.$inject = [
  '$log', '$rootScope',
  'ActivityService'
];

function InputCode (
  $log, $rootScope,
  ActivityService
) {
  return {
    restrict: 'E',
    scope: {
      verifier: '@',
      success: '@',
      error: '@'
    },
    template: (
      '<div>' +
        '<form ng-submit="ctrl.submit()">' +
          '<md-input-container>' +
            '<input ' +
              'ng-model="ctrl.code" ' +
              'data-success="success" ' +
              'data-error="error">' +
            '</input>' +
          '</md-input-container>' +

          '<md-button ' +
            'type="submit" ' +
            'class="md-raised md-primary"' +
          '>Go</md-button>' +
        '</form>' +
      '</div>'
    ),

    link: function ($scope, $element, $attrs, ctrl) {
      // ...
    },

    controller: function ($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.submit = submit;

      function submit () {
        if (ctrl.code) {
          var code = ctrl.code.toLowerCase();
          var verifier = $scope.verifier.toLowerCase();

          var payload = {
            inputCodeId: 'unknown',
            code: code,
            verifier: verifier
          };

          // Check if the given code matches the verifier
          if ( code === verifier ) {
            ActivityService.commitActivity({
              type: ActivityService.TYPES.USER_ACTION,
              name: ActivityService.USER_ACTIONS.INPUTCODE_SUCCESS,
              payload: payload
            });

            $rootScope.$broadcast('action', $scope.success);
          }
          else {
            ActivityService.commitActivity({
              type: ActivityService.TYPES.USER_ACTION,
              name: ActivityService.USER_ACTIONS.INPUTCODE_ERROR,
              payload: payload
            });

            $rootScope.$broadcast('action', $scope.error);
          }

          // TODO: find a better place for pushing the activity
          // maybe $on('action', ...) ?
          ActivityService.pushActivity();
        }
      }
    },
    controllerAs: 'ctrl'
  }
}
})();
