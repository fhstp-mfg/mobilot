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
    '<md-button class="md-raised md-primary" ng-click="ctrl.openBeaconDialog()">{{ \'BLUETOOTH_SCAN_BTN\' | translate }}' +
    '<md-icon>bluetooth_searching</md-icon></md-button>' +
    '<span ng-if="ctrl.beaconfoundcheck && ctrl.beaconname" translate="BLUETOOTH_FIX_INFO" translate-values="{value: ctrl.beaconname}"></span><br />' +
      '<div ng-show="ctrl.beaconfoundcheck" class="config-part">' +
        '<br />' +
        '<span translate="BLUETOOTH_SUCCESS"></span>' +
        '<hr />'+
        '<action-selector data-opts="ctrl.actionOpts" data-selection="ctrl.success" data-name="SUCCESS_ACTION"></action-selector>' +
        '<md-input-container>' +
          '<input type="text" ng-model="ctrl.fallback" placeholder="{{ \'FALLBACK\' | translate }}">' +
        '</md-input-container>' +
        '<md-input-container>' +
          '<input type="text" ng-model="ctrl.beaconname" placeholder="{{ \'BLUETOOTH_NAME_BEACON\' | translate }}">' +
        '</md-input-container>' +
        '<hr />' +
        '<span translate="BLUETOOTH_CHECKBOXES"></span>' +
        '<br /><br />' +
        '<md-radio-group ng-model="ctrl.selectedrange" layout="row"> ' +
          '<md-radio-button value="Immediate" class="md-accent">{{ \'BLUETOOTH_CHECKBOX_IMMEDIATE\' | translate }}</md-radio-button>' +
          '<md-radio-button value="Near" class="md-accent">{{ \'BLUETOOTH_CHECKBOX_NEAR\' | translate }}</md-radio-button>' +
        '</md-radio-group>' +
        '<md-input-container style="display: none">' +
          '<input type="text" ng-model="ctrl.beaconkey">' +
        '</md-input-container>' +
      '</div>' +
    '</div>',
    scope: {
      beaconname: '=',
      beaconkey: '=',
      fallback: '=',
      success: '=',
      beaconfoundcheck: '=',
      selectedrange: '=',
    },
    bindToController: true,
    link: function ($scope, $element, $attr, ctrl) {
      if (ctrl.selectedrange === undefined) {
        ctrl.selectedrange = "Immediate";
      }
    },
    controller: BluetoothController,
    controllerAs: 'ctrl'
  };

  function BluetoothController(
    $scope, $element, $attrs, $rootScope
  ) {
    var ctrl = this;
    ctrl.beaconfoundcheck = true;
    // vars
    ctrl.beaconKey = $scope.beaconkey;
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
        ctrl.beaconkey = data.uniqueKey;
        ctrl.beaconfoundcheck = true;
      });

      // console.debug("BEAcON");
      // console.debug(BluetoothBeaconService.isBeaconFound);
      // console.debug(data);
      // console.debug(data.uniqueKey);
      // console.debug("BEAcON_SERVICe");
      // var beacon = BluetoothBeaconService.getBeacon();
      // console.debug(beacon.uniqueKey);

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
      { id: 2, manufacturer: "Estimote - B" , region: "B9407F30-F5F8-466E-AFF9-25556B57FE6B" },
      { id: 999, manufacturer: "Anderer Hersteller", region: "custom" }
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
    bluetoothDialog.validateUUID = validateUUID;

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
        // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::ON WAS TRIGGERED");
        bluetoothDialog.beacons = [];
        for (var i = 0; i < pluginResult.beacons.length; i++) {
          var currentBeacon = pluginResult.beacons[i];
          var uniqueBeaconKey = (
            currentBeacon.uuid + ":" +
            currentBeacon.major + ":" +
            currentBeacon.minor
          );

          if ( currentBeacon.proximity === 'ProximityImmediate' ) {
            // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::CURRENT BEACON IMMEDIATE");
            $scope.$apply(function () {
              bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND');
            });

            currentBeacon.uniqueKey = uniqueBeaconKey;
            bluetoothDialog.beacons.push(currentBeacon);
          } else {
            $scope.$apply(function () {
              bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_SEARCH');
            });
          }
        }

        if ( bluetoothDialog.beacons.length === 1 ) {
          // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::ONLY ONE IMMEDIATE");
          $scope.$apply(function ()  {
            bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND');
          });

          if ( bluetoothDialog.foundImmediateBeacon === null ) {
            bluetoothDialog.foundImmediateBeacon = bluetoothDialog.beacons[0];
          } else if ( bluetoothDialog.foundImmediateBeacon.uniqueKey === bluetoothDialog.beacons[0].uniqueKey ) {
            // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::COMPARING BEACON");
              $scope.$apply(function () {
                bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_FOUND_ONE');
              });
              bluetoothDialog.confirmedImmediateBeacon++;

              if ( bluetoothDialog.confirmedImmediateBeacon >= bluetoothDialog._confirmRegions ) {
                // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::SAVE FOUND BEACON");
                $scope.$apply(function () {
                  bluetoothDialog.scanningText = $translate.instant('BLUETOOTH_INFO_LOCKED');
                });
                bluetoothDialog.lockedBeacon = true;

                $rootScope.$emit('rootScope:foundImmediateBeacon', bluetoothDialog.foundImmediateBeacon);
                // BluetoothBeaconService.setBeacon(bluetoothDialog.foundImmediateBeacon);
                $timeout(function () {
                  close();
                }, 1000);
              }
          } else {
            // console.debug("BLUE::BluetoothConfigDirective::_searchForBeacons::LOST BEACON");
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
      return bluetoothDialog.selectedManufacturer.id === 999;
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

    function validateUUID(uuid) {
      //NOTE: Checks the entered UUID for specific format ignoring upper and lower case
      //00000000-0000-0000-0000-000000000000
      return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(uuid);
    }
  }
})();
