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
          '<md-select data-ng-model="ctrl.successTemp">' +
            '<md-select-header>' +
              '<span>Success</span>' +
            '</md-select-header>' +
            '<md-option data-ng-value="opt" data-ng-repeat="opt in ctrl.actionOpts">' +
              '{{opt}}' +
            '</md-option>' +
          '</md-select>' +
          '<md-input-container data-ng-if="ctrl.successAttrNeeded">' +
            '<input type="text" data-ng-model="ctrl.successAttr" data-ng-change="ctrl.successChange()">' +
          '</md-input-container>' +
        '</md-input-container>' +
        '<md-input-container>' +
          '<md-select data-ng-model="ctrl.errorTemp">' +
            '<md-select-header>' +
              '<span>Error</span>' +
            '</md-select-header>' +
            '<md-option data-ng-value="opt" data-ng-repeat="opt in ctrl.actionOpts">' +
              '{{opt}}' +
            '</md-option>' +
          '</md-select>' +
          '<md-input-container data-ng-if="ctrl.errorAttrNeeded">' +
            '<input type="text" data-ng-model="ctrl.errorAttr">' +
          '</md-input-container>' +
        '</md-input-container>' +
      '</div>',
      scope: {
        verifier: '=',
        success: '=',
        error: '='
      },
      link: function($scope, $element, $attrs, ctrl){


        ctrl.successTemp = $scope.success;

        if(ctrl.successTemp.split(':').length > 1){
          ctrl.successAttr = ctrl.successTemp.split(':')[1];
          ctrl.successTemp = ctrl.successTemp.split(':')[0] + ':';
        }

        ctrl.errorTemp = $scope.error;

        if(ctrl.errorTemp.split(':').length > 1){
          ctrl.errorAttr = ctrl.errorTemp.split(':')[1];
          ctrl.errorTemp = ctrl.errorTemp.split(':')[0] + ':';
        }

        $scope.$watch('ctrl.successTemp', function(success){
          if(success && success == 'say:'){
            ctrl.successAttrNeeded = true;
            $scope.success = ctrl.successTemp + ctrl.successAttr;
          }else{
            ctrl.successAttrNeeded = false;
            $scope.success = success;
          }
        });

        $scope.$watch('ctrl.successAttr', function(successAttr){
          $scope.success = ctrl.successTemp + successAttr;
        });

        $scope.$watch('ctrl.errorTemp', function(error){
          if(error && error == 'say:'){
            ctrl.errorAttrNeeded = true;
            $scope.error = ctrl.errorTemp + ctrl.errorAttr;
          }else{
            ctrl.errorAttrNeeded = false;
            $scope.error = error;
          }
        });

        $scope.$watch('ctrl.errorAttr', function(errorAttr){
          $scope.error = ctrl.errorTemp + errorAttr;
        });

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