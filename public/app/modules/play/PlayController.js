angular
  .module('Play')
  .controller('PlayController', PlayController);

PlayController.$inject = [
  '$log', '$rootScope', '$scope',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  'PlayService'
];

function PlayController (
  $log, $rootScope, $scope,
  $state, $stateParams, StateManager,
  $mdDialog,
  PlayService
) {
  /// PlayController
  var play = this;

  /// constrants
  // ...

  /// vars
  play.isCordova = isCordova;
  play.isCordovaIos = isCordova && isIos;

  play.code;

  /// functions
  play.join = join;
  play.scan = scan;


  /// construct

  _init();


  /// private functions

  function _init () {
    $log.debug('PlayController init');

    _initDefaultValues();
  }


  function _initDefaultValues () {
    play.code = '';
  }


  /// public functions

  function join () {
    PlayService.play(play.code)
    .success(function (response) {
      // console.warn('join mobidul play callback : ');
      // console.info(response);

      if (response) {
        if (response.success) {
          $state.go('mobidul.map', { mobidulCode: response.code });
        } else {
          var msg = 'Dieser Mitmach-Code ist ungültig. Bitte versuche es nochmal oder kontaktiere den Ersteller des Mobiduls.';

          var invalidPlayDialog =
            $mdDialog.alert()
            .parent( angular.element(document.body) )
            .title('Mitmachen nicht möglich')
            .textContent(msg)
            .ariaLabel('Anmeldung Fehler')
            .ok('Daten überarbeiten');

          $mdDialog.show(invalidPlayDialog);
        }
      }
    });
  }


  function scan () {
    if (isCordova) {
      cordova.plugins.barcodeScanner.scan(function (result) {
        alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
      }, function (error) {
        alert("Scanning failed: " + error);
      },
      {
        // NOTE: supported on iOS and Android
        "preferFrontCamera" : false,
        // NOTE: supported on iOS and Android
        "showFlipCameraButton" : true,
        // NOTE: supported on Android only
        // "prompt" : "Plaziere den QR-Code im Aufnahmebereich",
        // NOTE: default: all but PDF_417 and RSS_EXPANDED
        "formats" : "QR_CODE",
        // NOTE: supported on Android only (portrait|landscape),
        // default: unset so it rotates with the device
        // "orientation" : "portrait"
      });
    }
  }
}
