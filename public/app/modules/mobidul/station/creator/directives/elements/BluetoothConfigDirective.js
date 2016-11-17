(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('blueToothConfig', Bluetooth)
  .controller('BluetoothScanDialogController', BluetoothScanDialogController);

  Bluetooth.$inject = [
  '$log', '$translate', '$rootScope',
  'RallyService', '$mdDialog', 'BluetoothBeaconService'
];

function Bluetooth(
  $log, $translate, $rootScope,
  RallyService, $mdDialog, BluetoothBeaconService
) {
  return {
    restrict: 'E',
    template:
    '<div>' +
    '<md-button class="md-raised md-primary" ng-click="ctrl.openBeaconDialog()">Scan Beacon' +
    '<md-icon>bluetooth_searching</md-icon></md-button><br/>' +
      '<div ng-show="ctrl.beaconFoundCheck" class="config-part">' +
        '<br/><span translate="BLUETOOTH_SUCCESS"></span>' +
        '<hr />'+
        '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="SUCCESS_ACTION"></action-selector>' +
        '<md-input-container>' +
          '<input type="text" ng-model="fallback" placeholder="{{ \'FALLBACK\' | translate }}">' +
        '</md-input-container>' +
        '<hr />'+
        '<md-input-container>' +
          '<input type="text" ng-model="beaconName" placeholder="{{ \'BLUETOOTH_NAME_BEACON\' | translate }}">' +
        '</md-input-container>' +
        '<span ng-bind="ctrl.beaconKey"></span>' +
      '</div>' +
    '</div>',
    scope: {
      beaconKey: '=',
      beaconName: '=',
      fallback: '=',
      success: '='
    },
    link: function ($scope, $element, $attr, ctrl) {

    },
    controller: BluetoothController,
    controllerAs: 'ctrl'
  };

  function BluetoothController(
    $scope, $element, $attrs, $rootScope
  ) {
    var ctrl = this;

    // vars
    ctrl.beaconKey = null;
    ctrl.beaconFoundCheck = null;
    ctrl.actionOpts = RallyService.getActions();

    // functions
    ctrl.openBeaconDialog = function () {
      var scanBluetoothDialog = {
        parent       : angular.element(document.body),
        title        : $translate.instant('BLUETOOTH_TITLE_SCAN'),
        templateUrl  : 'app/modules/mobidul/menu/dialog/BluetoothScanDialog.html',
        controller   : BluetoothScanDialogController,
        controllerAs : 'bluetoothDialog',

        clickOutsideToClose: true
      };

      $mdDialog.show(scanBluetoothDialog);
    };


    ctrl.foundImmediateBeaconListener = $rootScope.$on('rootScope:foundImmediateBeacon', function(event, data) {
      $scope.$apply(function () {
        ctrl.beaconKey = data.uniqueKey;
        ctrl.beaconFoundCheck = true;
      });

      console.debug("BEAcON");
      console.debug(BluetoothBeaconService.isBeaconFound);
      console.debug(data);
      console.debug(data.uniqueKey);
      console.debug("BEAcON_SERVICe");
      console.debug(BluetoothBeaconService.getBeacon());

      //NOTE: REMOVE this if not working
      event.stopPropagation();
    });

    $scope.$on('$destroy', ctrl.foundImmediateBeaconListener);
  }
}



  // NOTE: Here starts the controller Section for the Dialog, which is included in the directive.
  //---------------------------------------------------------------------------------------------

  BluetoothScanDialogController.$inject = [
    '$log', '$scope', '$rootScope', '$mdDialog', '$translate',
    '$cordovaBeacon', '$timeout',
    'MobidulService', 'CreatorService', 'BluetoothBeaconService',
    'UtilityService'
  ];

  function BluetoothScanDialogController (
    $log, $scope, $rootScope, $mdDialog, $translate,
    $cordovaBeacon, $timeout,
    MobidulService, CreatorService, BluetoothBeaconService,
    UtilityService
  ) {
    /// BluetoothScanDialogController
    var bluetoothDialog = this;

    // constants
    bluetoothDialog._confirmRegions = 3;
    // NOTE: Add here all the manufacturers with their regions available
    bluetoothDialog._availbaleRegions = [
      { id: 1, manufacturer: "Estimote", region: "B9407F30-F5F8-466E-AFF9-25556B57FE6D" },
      { id: 2, manufacturer: "Florian" , region: "B9407F30-F5F8-466E-AFF9-25556B57FE6B" },
      { id: 3, manufacturer: "Anderer Hersteller", region: "custom" }
    ];

    // vars
    bluetoothDialog.lockedBeacon = false;
    bluetoothDialog.showRegion = false;
    bluetoothDialog.customRegion = null;
    bluetoothDialog.selectedRegion = null;
    bluetoothDialog.selectedManufacturer = null;
    bluetoothDialog.beaconRegionRef = null;
    bluetoothDialog.beacons = [];
    bluetoothDialog.foundImmediateBeacon = null;
    bluetoothDialog.confirmedImmediateBeacon = 0;
    bluetoothDialog.scanningText = null;


    // functions
    bluetoothDialog.close        = close;
    bluetoothDialog.selectRegion = selectRegion;


    // constructor
    _init();


    /// private functions

    function _init () {
      _initDefaultValues();

      _searchForBeacons();
    }

    function _initDefaultValues() {
      bluetoothDialog.selectedManufacturer = bluetoothDialog._availbaleRegions[0];
      bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_SEARCH');
    }

    function _searchForBeacons() {
      $cordovaBeacon.requestWhenInUseAuthorization();

      $rootScope.$on('$cordovaBeacon:didRangeBeaconsInRegion', function (event, pluginResult) {

        bluetoothDialog.beacons = [];
        for (var i = 0; i < pluginResult.beacons.length; i++) {
          var currentBeacon = pluginResult.beacons[i];
          var uniqueBeaconKey = (
            currentBeacon.uuid + ":" +
            currentBeacon.major + ":" +
            currentBeacon.minor
          );

          if ( currentBeacon.proximity === 'ProximityImmediate' ) {
            $scope.$apply(function () {
              bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND');
            });

            currentBeacon.uniqueKey = uniqueBeaconKey;
            bluetoothDialog.beacons.push(currentBeacon);
          }
        }

        if ( bluetoothDialog.beacons.length === 1 ) {
          $scope.$apply(function ()  {
            bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND');
          });

          if ( bluetoothDialog.foundImmediateBeacon === null ) {
            bluetoothDialog.foundImmediateBeacon = bluetoothDialog.beacons[0];
          } else if ( bluetoothDialog.foundImmediateBeacon.uniqueKey === bluetoothDialog.beacons[0].uniqueKey ) {
              $scope.$apply(function () {
                bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND_ONE');
              });
              bluetoothDialog.confirmedImmediateBeacon++;

              if ( bluetoothDialog.confirmedImmediateBeacon >= bluetoothDialog._confirmRegions ) {
                $scope.$apply(function () {
                  bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_LOCKED');
                });
                bluetoothDialog.lockedBeacon = true;

                $rootScope.$emit('rootScope:foundImmediateBeacon', bluetoothDialog.foundImmediateBeacon);
                BluetoothBeaconService.setBeaconFound(bluetoothDialog.foundImmediateBeacon);
                $timeout(function () {
                  close();
                }, 1000);
              }
          } else {
            bluetoothDialog.foundImmediateBeacon = null;
            bluetoothDialog.confirmedImmediateBeacon = 0
          }
        }
      });

      bluetoothDialog.selectedRegion = ! _isOtherManufacturerSelected()
        ? bluetoothDialog.selectedManufacturer.region
        : bluetoothDialog.customRegion;

      bluetoothDialog.beaconRegionRef = $cordovaBeacon.createBeaconRegion(
        bluetoothDialog.selectedManufacturer.manufacturer,
        bluetoothDialog.selectedRegion
      );
      $cordovaBeacon.startRangingBeaconsInRegion(bluetoothDialog.beaconRegionRef);
    }

    function _isOtherManufacturerSelected() {
      return bluetoothDialog.selectedManufacturer.id === 3
    }

    function _stopRangingBeacons() {
      $cordovaBeacon.stopRangingBeaconsInRegion(bluetoothDialog.beaconRegionRef);
    }


    /// public functions

    function close() {
      _stopRangingBeacons();

      bluetoothDialog.foundImmediateBeacon = null;
      bluetoothDialog.confirmedImmediateBeacon = 0;

      $mdDialog.hide();
    }

    function selectRegion () {
      bluetoothDialog.showRegion = !!_isOtherManufacturerSelected();
    }
  }
})();
