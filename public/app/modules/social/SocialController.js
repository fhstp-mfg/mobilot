// Currently not in use

angular
  .module('Social')
  .controller('SocialController', SocialController);


SocialController.$inject = [
  '$log', '$rootScope', '$scope', '$translate',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog', 'SocialService', 'RallyService'
];


function SocialController (
  $log, $rootScope, $scope, $translate,
  $state, $stateParams, StateManager,
  $mdDialog, SocialService, RallyService
) {
  /// SocialController
  var social = this;

  /// constrants
  // ...

  /// vars
  social.isCordova = isCordova;
  social.isCordovaIos = isCordova && isIos;

  social.code;

  /// functions
  social.join = join;
  social.scan = scan;


  /// construct

  _init();


  /// private functions

  function _init () {
    $log.debug('SocialController init');

    _initDefaultValues();
    _checkSocialCode();
  }


  function _initDefaultValues () {
    social.code = '';
  }


  /**
   * Check if social code is correct
   */
  function _checkSocialCode () {

    // TODO Check, if stationcode is correct -> fits StationID & Status

    var socialCode = StateManager.getParams().socialCode;


    if (
      socialCode
    ) {
      console.log("Code");
      // set station to right status

      // show station

    }
  }


  /// public functions

  function join () {
    SocialService.social( social.code )
    .success(function (response) {
      // console.warn('join mobidul social callback : ');
      // console.info(response);

      if (response) {
        if (response.success) {
          $state.go('mobidul.map', { mobidulCode: response.code });
        } else {
          var msg = $translate.instant('SOCIAL_CODE_INVALID_EXPLANATION');

          var invalidSocialDialog =
            $mdDialog.alert()
            .parent( angular.element(document.body) )
            .title( $translate.instant('SOCIAL_NOT_POSSIBLE') )
            .textContent(msg)
            .ariaLabel( $translate.instant('LOGIN_ERROR') )
            .ok( $translate.instant('EDIT_CREDENTIALS') );

          $mdDialog.show(invalidSocialDialog);
        }
      }
    });
  }


  function scan () {
    if (isCordova) {
      cordova.plugins.barcodeScanner.scan(function (result) {
        if (
          result.text &&
          ! result.cancelled &&
          result.format === 'QR_CODE'
        ) {
          var socialRegexPattern = /.+\/Social\/([A-Za-z0-9]+)/;
          var socialRegexMatch = result.text.match(playRegexPattern);
          var socialCode = socialRegexMatch[1];

          if (socialCode) {
            social.code = socialCode;
            join();
          } else {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('QR_INFO'))
              .textContent($translate.instant('QR_NO_CODE'))
              .ariaLabel($translate.instant('OK'))
              .ok($translate.instant('OK'))
            );
          }
        } else {
          if ( result.format !== 'QR_CODE' ) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('QR_INFO'))
              .textContent($translate.instant('QR_NOT_A_CODE'))
              .ariaLabel($translate.instant('OK'))
              .ok($translate.instant('OK'))
            );
          } else {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('QR_INFO'))
              .textContent($translate.instant('QR_NOT_VALID'))
              .ariaLabel($translate.instant('OK'))
              .ok($translate.instant('OK'))
            );
          }
        }
      }, function (error) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title($translate.instant('QR_INFO'))
            .textContent($translate.instant('QR_SCAN_FAILED') + error)
            .ariaLabel($translate.instant('OK'))
            .ok($translate.instant('OK'))
          );
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

  // ...
}
