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
        '<div ng-if="bluetooth.inaccurate">' +
          '<span translate="BLUETOOTH_INACCURATE_FALLBACK"></span>' +
          '<mbl-input-code ' +
            'data-verifier="{{ fallback }}" ' +
            'data-success="VERIFY_IF_NEAR:{{ success }}" ' +
            'data-error={{bluetooth.errorAction}}' +
          '></mbl-input-code>' +
          '<md-divider id="station_creator_divider"></md-divider>'+
        '</div>' +

        '<div ng-if=" ! bluetooth.inaccurate">' +
          '<md-icon ng-if="bluetooth.trigger">bluetooth_connected</md-icon>' +
          '<div ng-if=" ! bluetooth.trigger">' +
            '<span>{{ bluetooth.default }}</span>' +
            '<md-icon class="search-anim" style="margin-right: 1em; margin-bottom: 0.5em">bluetooth_searching</md-icon>' +
            '<span ng-if="bluetooth.distance" translate="BLUETOOTH_FEEDBACK" translate-values="{distance: bluetooth.distance}"></span>' +
          '</div>' +
          '<md-divider id="station_creator_divider"></md-divider>' +
        '</div>' +
      '</div>'
    ,
    scope: {
      beaconname: '@',
      beaconkey: '@',
      fallback: '@',
      success: '@',
    },
    bindToController: true,

    //TODO: Bluetooth Scan Button for Scanning and Rescan the bluetooth. If not found show the fallback field with the code.


    link: function ($scope, $element, $attrs, BlueTooth) {
      // NOTE: Add .broadcast('inaccurateBluetooth') signal in the BluetoothService if the beacon is not in proximity
      // "near" at least or "immediate", in order to distinguish between beacons.
      console.debug("BLUE::BlueToothDirective::link::Beacon Data");
      console.debug($scope.beaconname);
      console.debug($scope.beaconkey);
      console.debug($scope.success);
      console.debug($scope.fallback);


      $scope.$on('inaccurateBluetooth', function (event, inaccurate) {
        if (inaccurate) {
          BlueTooth.inaccurate = true;
        }
      });

      // NOTE: Maybe not needed as inaccurate should be enough
      $scope.$on('distanceBluetooth', function (event, msg) {
        if (msg) {
          BlueTooth.default = null;
          BlueTooth.inaccurate = false;
          BlueTooth.distance = 452;
          BlueTooth.accuracy = 3;

          BlueTooth.range = BlueTooth.distance + BlueTooth.accuracy;

          ActivityService.commitActivity({
            type: ActivityService.TYPES.APP_EVENT,
            name: ActivityService.APP_EVENTS.USER_POSITION,
            payload: {
              distance: BlueTooth.distance,
              accuracy: BlueTooth.accuracy,
              range: BlueTooth.range,
              inaccurate: false
            }
          });

          if ( BlueTooth.distance <= BlueTooth.range ) {
            // NOTE: Here the services which are fetching for bluetooth signal should be stopped. This means the
            // beacon is found and triggered. Than the action can be performed. For the beacon with the respective
            // id which is in the database.
            BlueTooth.trigger = true;

            $rootScope.$broadcast('action', $attrs.success);
          }
        }
      });
    },

    controller: BlueToothController,
    controllerAs: 'bluetooth'
  };



  function BlueToothController (
    $scope, $element, $attrs
  ) {
    var bluetooth = this;
    console.debug("BLUE::BlueToothDirective::link::Beacon Data MORE");
    console.debug(bluetooth.beaconkey);
    console.debug(bluetooth.beaconname);
    console.debug(bluetooth.success);
    console.debug(bluetooth.fallback);

    bluetooth.errorAction = 'SAY:' + $translate.instant('INPUT_CODE_DEFAULT_ERROR_MSG');
    bluetooth.default = $translate.instant('BLUETOOTH_FETCHING');
    bluetooth.inaccurate = false;
    bluetooth.trigger = false;
  }
}

})();
