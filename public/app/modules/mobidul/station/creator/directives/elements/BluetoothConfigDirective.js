(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('blueToothConfig', Bluetooth);

  Bluetooth.$inject = [
  '$log', '$translate',
  'RallyService'
];

function Bluetooth(
  $log, $translate,
  RallyService
) {
  return {
    restrict: 'E',
    template:
    '<div>' +
    '<md-button class="md-raised md-primary" ng-click="ctrl.showSimpleToast()">Scan Beacon' +
    '<md-icon>bluetooth_searching</md-icon></md-button><br/>' +
      '<div class="config-part">' +
        '<br/><span translate="BLUETOOTH_SUCCESS"></span>' +
        '<hr />'+
        '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="SUCCESS_ACTION"></action-selector>' +
        '<md-input-container>' +
          '<input type="text" ng-model="fallback" placeholder="{{ \'FALLBACK\' | translate }}">' +
        '</md-input-container>' +
      '</div>' +
    '</div>',
    scope: {
      range: '=',
      fallback: '=',
      success: '='
    },
    link: function ($scope, $element, $attr, ctrl) {
      console.debug("BLUE-->$attr");
      console.debug($scope);
    },
    controller: BluetoothController,
    controllerAs: 'ctrl'
  };

  function BluetoothController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

    ctrl.showSimpleToast = function () {
      console.debug("BLAUZAHN DIALOG........");
      $scope.range = 2;
    }
  }
}
})();