(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('actionselector', ActionSelector);

  ActionSelector.$inject = [
    '$log'
  ];

  function ActionSelector(
    $log
  ) {
    return {

      restrict: 'E',
      transclude: true,
      template: '<div>' +
        '<md-input-container>' +
          '<md-select data-ng-model="ctrl.selectionTemp">' +
            '<md-select-header>' +
          '<span>{{name}}</span>' +
          '</md-select-header>' +
            '<md-option data-ng-value="opt" data-ng-repeat="opt in opts">' +
              '{{opt}}' +
            '</md-option>' +
          '</md-select>' +
          '<md-input-container data-ng-if="ctrl.selectionAttrNeeded">' +
            '<input type="text" data-ng-model="ctrl.selectionAttr" data-ng-change="ctrl.selectionChange()">' +
          '</md-input-container>' +
        '</md-input-container>' +
      '</div>',
      scope:{
        opts: '=',
        selection: '=',
        name: '@'
      },
      link: function($scope, $element, $attr, ctrl){

        ctrl.selectionTemp = $scope.selection || '';

        if(ctrl.selectionTemp.split(':').length > 1){
          ctrl.selectionAttr = ctrl.selectionTemp.split(':')[1];
          ctrl.selectionTemp = ctrl.selectionTemp.split(':')[0] + ':';
        }
        
        $scope.$watch('ctrl.selectionTemp', function(selection){
          if(selection && selection == 'say:'){
            ctrl.selectionAttrNeeded = true;
            $scope.selection = ctrl.selectionTemp + ctrl.selectionAttr;
          }else{
            ctrl.selectionAttrNeeded = false;
            $scope.selection = selection;
          }
        });

        $scope.$watch('ctrl.selectionAttr', function(selectionAttr){
          $scope.selection = ctrl.selectionTemp + selectionAttr;
        });

      },
      controller: ActionSelectorController,
      controllerAs: 'ctrl'
    };

    function ActionSelectorController($scope, $element, $attrs) {
      var ctrl = this;

      //$log.info('ActionSelectorController');

    }
  }
})();