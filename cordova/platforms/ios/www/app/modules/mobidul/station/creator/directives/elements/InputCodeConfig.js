(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('inputCodeConfig', InputCodeEditor);

  InputCodeEditor.$inject = [
    '$log',
    'RallyService'
  ];

  function InputCodeEditor(
    $log,
    RallyService
  ){
    return {

      restrict: 'E',
      template: '<div>' +
        '<mbl-input-code data-verifier="{{verifier}}" data-success="say:{{success}}" data-error="say:{{error}}"></mbl-input-code>' +
        '<div class="config-part">' +
          '<md-input-container>' +
            '<input type="text" data-ng-model="verifier" placeholder="Verifier">' +
          '</md-input-container>' +
          '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="Success"></action-selector>' +
          '<action-selector data-opts="ctrl.actionOpts" data-selection="error" data-name="Error"></action-selector>' +
        '</div>' +
      '</div>',
      scope: {
        verifier: '=',
        success: '=',
        error: '='
      },
      link: function($scope, $element, $attrs, ctrl){

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