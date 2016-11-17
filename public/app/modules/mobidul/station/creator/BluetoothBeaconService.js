angular
  .module('StationCreator')
  .factory('BluetoothBeaconService', BluetoothBeaconService);


BluetoothBeaconService.$inject = [
  '$log', '$translate'
];


function BluetoothBeaconService (
  $log, $translate
) {
  /// BluetoothBeaconService
  var service =
  {
    // vars
    beacon      : {},
    isBeaconFound : false,

    // functions
    setBeaconFound   : setBeaconFound,
    setBeacon        : setBeacon,
    getBeacon        : getBeacon,
    checkBeaconFound : checkBeaconFound,
  };


  /// functions
  function setBeaconFound (bool) {
    service.isBeaconFound = bool;
  }

  function setBeacon (beacon) {
    if (! service.isBeaconFound) {
      service.isBeaconFound = true;
    }
    service.beacon = beacon;

    console.debug("BEACON SERVICE TRIGGERED::setBeacon::");
    console.debug(service.beacon);
  }

  function getBeacon () {
    return service.beacon;
  }

  function checkBeaconFound () {
    return service.isBeaconFound;
  }

  return service;
}
