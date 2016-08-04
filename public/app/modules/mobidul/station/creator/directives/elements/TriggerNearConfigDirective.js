(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('triggerNearConfig', IfNear);

IfNear.$inject = [
  '$log', '$translate',
  'RallyService'
];

function IfNear(
  $log, $translate,
  RallyService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<md-input-container>' +
        '<input type="number" placeholder="{{ \'RANGE_INPUT_PLACEHOLDER\' | translate }}" ng-model="range">' +
      '</md-input-container>' +
      '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="Success"></action-selector>' +
      '<md-input-container>' +
        '<input type="text" ng-model="fallback" placeholder="{{ \'FALLBACK\' | translate }}">' +
      '</md-input-container>' +
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