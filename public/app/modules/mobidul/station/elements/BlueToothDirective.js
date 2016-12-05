(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblBlueTooth', BlueTooth);


BlueTooth.$inject = [
  '$log', '$translate', '$rootScope', 'ActivityService', 'BluetoothBeaconService'
];


function BlueTooth (
  $log, $translate, $rootScope, ActivityService, BluetoothBeaconService
) {
  return {
    restrict: 'E',
    template: '' +
      '<div>' +
        '<div layout="row" layout-align="center center">' +
        '<md-button class="md-raised md-primary" ' +
                    'ng-click="bluetooth.startScanningProcess()">{{ \'BLUETOOTH_FIND_BTN\' | translate }} ' +
        '<md-icon>bluetooth_searching</md-icon></md-button>' +
        '</div>' +
        '<md-divider ng-if="!bluetooth.showScanText" id="station_creator_divider"></md-divider>' +

        '<div ng-if="bluetooth.showScanText">' +
        '<br /><table class="mobilotInvisibleTable">' +
          '<tr>' +
            '<td><md-progress-circular ng-if="!bluetooth.lockedBeacon" ' +
                                      'md-mode="indeterminate" ' +
                                      'md-diameter="30">' +
            '</md-progress-circular></td>' +
            '<td>&nbsp;</td>' +
            '<td><span style="word-break:break-all;" ng-show="bluetooth.showScanText" ng-bind="bluetooth.scanningText"></span></td>' +
          '</tr>' +
        '</table>' +
        '<md-divider id="station_creator_divider"></md-divider>' +
        '</div>' +

        '<div ng-if="bluetooth.failedScan">' +
          '<br />' +
          '<span translate="BLUETOOTH_INACCURATE_FALLBACK"></span>' +
          '<mbl-input-code ' +
            'verifier="{{ bluetooth.fallback }}" ' +
            'success="{{ bluetooth.success }}" ' +
            'error={{bluetooth.errorAction}}' +
          '></mbl-input-code>' +
        '</div>' +
      '</div>'
    ,
    scope: {
      beaconname: '@',
      beaconkey: '@',
      fallback: '@',
      success: '@',
      selectedrange: '@',
    },
    bindToController: true,
    link: function ($scope, $element, $attrs, BlueTooth) {

    },
    controller: BlueToothController,
    controllerAs: 'bluetooth'
  };



  function BlueToothController (
    $scope, $element, $attrs, $cordovaBeacon, $timeout, $rootScope
  ) {
    var bluetooth = this;

    // constants
    // NOTE: The manufacturer name could be delivered with the station component (atm. random string)
    bluetooth.manufacturer = "TheChosenOne";
    bluetooth.stoppingTime = 180000;

    // vars
    bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_SEARCH');
    bluetooth.errorAction = 'SAY:' + $translate.instant('INPUT_CODE_DEFAULT_ERROR_MSG');
    bluetooth.default = $translate.instant('BLUETOOTH_FETCHING');
    bluetooth.countingHits = 0;
    bluetooth.countingFails = 0;
    bluetooth.lockedBeacon = false;
    bluetooth.showScanText = false;
    bluetooth.failedScan = false;
    bluetooth.triggered = false;

    // private vars
    bluetooth._beaconKey = null;
    bluetooth._beaconName = null;
    bluetooth._beaconUUID = null;
    bluetooth._success = null;
    bluetooth._fallback = null;
    bluetooth._countingHitsTarget = 1;
    bluetooth._countingFailsTarget = 70;

    // functions
    bluetooth.startScanningProcess = function () {
      _storeComponentData();

      bluetooth.showScanText = true;
      bluetooth.triggered = false;
      bluetooth.lockedBeacon = false;
      bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_SEARCH');

      _performBeaconSearch();

      //NOTE: Timeout to maximal search
      $timeout(function () {
        if ( !bluetooth.lockedBeacon ) {
          _didNotFoundBeacon();
        }
      }, bluetooth.stoppingTime);
    };

    // private functions
    function _storeComponentData() {
      // NOTE: Split the string by the delimiter ":" in order to get UUID, Major, Minor
      var beaconStringSplit = bluetooth.beaconkey.split(/:/);
      // console.debug("UUID" + beaconStringSplit[0]);
      // console.debug("MAJOR" + beaconStringSplit[1]);
      // console.debug("MINOR" + beaconStringSplit[2]);

      bluetooth._beaconKey = bluetooth.beaconkey;
      bluetooth._beaconName = bluetooth.beaconname;
      bluetooth._beaconUUID = beaconStringSplit[0];
      bluetooth._success = bluetooth.success;
      bluetooth._fallback = bluetooth.fallback;
    }

    function _performBeaconSearch () {
      $cordovaBeacon.requestWhenInUseAuthorization();

      $rootScope.$on('$cordovaBeacon:didRangeBeaconsInRegion', function (event, pluginResult) {
        // console.debug("HEREREHERHEHRHEHRHERHEHRHE");
        for (var i = 0; i < pluginResult.beacons.length; i++) {
          var currentBeacon = pluginResult.beacons[i];
          var uniqueBeaconKey = (
            currentBeacon.uuid + ":" +
            currentBeacon.major + ":" +
            currentBeacon.minor
          );

          if ( uniqueBeaconKey === bluetooth._beaconKey ) {
            // console.debug("IF IFIFIFIFI IFIFIFIFIF IFIFIF");
            switch (currentBeacon.proximity) {
              case "ProximityFar":
                  // console.debug("INSIDE SWITCH::FAR");
                  $scope.$apply(function() {
                    bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_FAR');
                  });
                break;
              case "ProximityNear":
                  // console.debug("INSIDE SWITCH::NEAR");
                  $scope.$apply(function () {
                    bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_NEAR');
                  });
                  if ( bluetooth.selectedrange === "Near" ) {
                    bluetooth.countingHits++;
                  }
                break;
              case "ProximityImmediate":
                // console.debug("INSIDE SWITCH::IMMEDIATE");
                $scope.$apply(function () {
                  bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_IMMEDIATE');
                });
                if ( bluetooth.selectedrange === "Immediate" || bluetooth.selectedrange === "Near" ) {
                  bluetooth.countingHits++;
                }
                break;
              default:
                // console.debug("INSIDE SWITCH::NOTHING");
                $scope.$apply(function () {
                  bluetooth.scanningText = "BLUE::PROXIMITY::NO BEACON FOUND";
                });
                break;
            }
          } else {
            $scope.$apply(function () {
              bluetooth.scanningText = "BLUE::PROXIMITY::NO BEACON FOUND";
            });
            bluetooth.countingFails++;
          }
        }

        if ( bluetooth.countingHits >= bluetooth._countingHitsTarget) {
          _foundBeaconAndStop();
          if ( ! bluetooth.triggered ) {
            bluetooth.triggered = true;
            $rootScope.$broadcast('action', $attrs.success);
          }
        }

        if ( bluetooth.countingFails >= bluetooth._countingFailsTarget) {
          _didNotFoundBeacon();
        }
      });

      bluetooth.beaconRegionRef = $cordovaBeacon.createBeaconRegion(
        bluetooth.manufacturer,
        bluetooth._beaconUUID
      );

      $cordovaBeacon.startRangingBeaconsInRegion(bluetooth.beaconRegionRef);
    }

    function _stopRangingBeacons() {
      $cordovaBeacon.stopRangingBeaconsInRegion(bluetooth.beaconRegionRef);
    }

    function _foundBeaconAndStop() {
      _stopRangingBeacons();
      bluetooth.countingHits = 0;

      $scope.$apply(function () {
        bluetooth.scanningText = $translate.instant('BLUETOOTH_INFO_2_FOUND');
        bluetooth.lockedBeacon = true;
      });
    }

    function _didNotFoundBeacon () {
      _stopRangingBeacons();
      bluetooth.countingFails = 0;

      $scope.$apply(function() {
        bluetooth.failedScan = true;
        bluetooth.showScanText = false;
      });
    }
    // console.debug("BLUE::BlueToothDirective::controller::Beacon Data");
    // console.debug(bluetooth.beaconkey);
    // console.debug(bluetooth.beaconname);
    // console.debug(bluetooth.success);
    // console.debug(bluetooth.fallback);
  }
}

})();
