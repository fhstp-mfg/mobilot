(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editorinputcode', InputCodeEditor);

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
        '<md-input-container>' +
          '<input type="text" data-ng-model="verifier" placeholder="Verifier">' +
        '</md-input-container>' +
        '<actionselector data-opts="ctrl.actionOpts" data-selection="success" data-name="Success"></actionselector>' +
        '<actionselector data-opts="ctrl.actionOpts" data-selection="error" data-name="Error"></actionselector>' +
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