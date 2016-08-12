(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('inputCodeConfig', InputCodeEditor);

InputCodeEditor.$inject = [
  '$log', '$translate',
  'RallyService', 'UtilityService'
];

function InputCodeEditor(
  $log, $translate,
  RallyService, util
){
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<mbl-input-code data-verifier="{{verifier}}" data-success="say:{{success}}" data-error="say:{{error}}"></mbl-input-code>' +
      '<div class="config-part">' +
        '<md-input-container>' +
          '<input type="text" data-ng-model="verifier" placeholder="{{ \'VERIFIER\' | translate}}">' +
        '</md-input-container>' +
        '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="SUCCESS_ACTION"></action-selector>' +
        '<action-selector data-opts="ctrl.actionOpts" data-selection="error" data-name="ERROR_ACTION"></action-selector>' +
      '</div>' +
    '</div>',
    scope: {
      verifier: '=',
      success: '=',
      error: '=',
      id: '='
    },
    link: function($scope, $element, $attrs, ctrl){
      if ( ! $scope.id ) {
        $scope.id = util.getGUID();
      }
    },
    controller: InputCodeEditorController,
    controllerAs: 'ctrl'
  };

  function InputCodeEditorController($scope, $element, $attrs){
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

  }
}

})();