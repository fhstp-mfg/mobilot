(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editorifnear', IfNear);

  IfNear.$inject = [
    'RallyService'
  ];

  function IfNear(
    RallyService
  ) {
    return {

      restrict: 'E',
      template: '<div>' +
      '<md-input-container><input type="number" placeholder="Range (meters)" ng-model="range"></md-input-container>' +
      '<actionselector data-opts="ctrl.actionOpts" data-selection="success" data-name="Success"></actionselector>' +
      '<md-input-container><input type="text" ng-model="fallback" placeholder="Fallback"></md-input-container>' +
      '</div>',
      scope: {
        range: '=',
        fallback: '=',
        success: '='
      },
      link: function ($scope, $element, $attr, ctrl) {
        
      },
      controller: IfNearController,
      controllerAs: 'ctrl'
    };

    function IfNearController($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.actionOpts = RallyService.getActions();

    }
  }
})();