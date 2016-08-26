(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblInputCode', InputCode);


InputCode.$inject = [
  '$log', '$translate', '$rootScope',
  'ActivityService'
];


function InputCode (
  $log, $translate, $rootScope,
  ActivityService
) {
  return {
    restrict: 'E',
    scope: {
      verifier: '@',
      success: '@',
      error: '@',
      id: '@'
    },
    template: '' +
      '<div>' +
        '<form ng-submit="inputCode.submit()">' +
          '<md-input-container>' +
            '<input ' +
              'ng-model="inputCode.code"/>' +
          '</md-input-container>' +

          '<md-button ' +
            'type="submit" ' +
            'class="md-raised md-primary" ' +
          '>{{ \'GO\' | translate }}</md-button>' +
        '</form>' +
      '</div>'
    ,

    link: function ($scope, $element, $attrs, InputCode) {
      // ...
    },

    controller: InputCodeController,
    controllerAs: 'inputCode'
  }



  function InputCodeController (
    $scope, $element, $attrs
  ) {
    var inputCode = this;

    inputCode.submit = submit;

    function submit () {
      if ( inputCode.code ) {
        var code = inputCode.code.toLowerCase();
        var verifier = $scope.verifier.toLowerCase();

        var payload = {
          inputCodeId: $scope.id,
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
        } else {
          ActivityService.commitActivity({
            type: ActivityService.TYPES.USER_ACTION,
            name: ActivityService.USER_ACTIONS.INPUTCODE_ERROR,
            payload: payload
          });

          $rootScope.$broadcast('action', $scope.error);
        }
        
        ActivityService.pushActivity();
      }
    }
  }
}

})();
