(function () {
  'use strict';

  angular
  .module('Mobidul')
  .directive('mblConfirmSocial', ConfirmSocial);

  ConfirmSocial.$inject = [
    '$log', '$translate', '$rootScope', 'StateManager',
    '$mdDialog', 'SocialService', 'RallyService', 'MobidulService'
  ];

  function ConfirmSocial (
    $log, $translate, $rootScope, StateManager,
    $mdDialog, SocialService, RallyService, MobidulService
  ) {
    return {

      restrict: 'E',
      template: '' +
      '<div>' +
        '<md-button class="md-raised md-primary md-mobilot"' +
          ' ng-click="ctrl.openCode()">' +
          '{{ \'OPEN_CODE\' | translate }}' +
        '</md-button>' +
        '<md-button class="md-raised md-primary md-mobilot"' +
          ' ng-click="ctrl.startScan()" ng-if="ctrl.isCordova">' +
          '{{ \'SCAN_CODE\' | translate }}' +
        '</md-button>' +
        // '<md-button class="md-raised md-primary md-mobilot"' +
        //   ' ng-if="ctrl.isConfirmed" ng-click="ctrl.actionPerformed()">' +
        //   '{{ \'PERFORM_ACTION\' | translate }}' +
        // '</md-button>' +
        '<md-divider id="station_creator_divider"></md-divider>' +
      '</div>',
      scope: {
        id: '@',
        success: '@'
      },
      link: function ( $scope, $element, $attr, ctrl ) {

        if ( StateManager.state.params.verifier && StateManager.state.params.verifier === $scope.id ) {
          ctrl.isConfirmed = true;
        }

      },
      controller: ConfirmSocialController,
      controllerAs: 'ctrl'
    };

    function ConfirmSocialController ( $scope, $element, $attrs ) {
      var ctrl = this;

      ctrl.isConfirmed = false;
      ctrl.code = null;
      ctrl.isCordova = isCordova;

      ctrl.openCode = function () {
        $log.debug('OPEN CODE');

        // TODO: generate code - mobidul&station&state
        var mobidulCode = StateManager.state.params.mobidulCode;
        var stationCode = StateManager.state.params.stationCode;
        $log.info('ConfirmSocialDirective::StateManagerParam::stationCode');
        $log.debug(stationCode);

//station.order
        MobidulService.getProgress(mobidulCode).
          then(function(progress){
              RallyService.getStatus(progress.progress)
              .then(function (status) {
                $log.info('ConfirmSocialDirective - RallyService.getStatus - status:');
                $log.debug(status);

                SocialService.getSocialCodes( mobidulCode, stationCode, status)
                .success(function (codes, status, headers, config) {
                  $log.debug('getCodes success in SocialCodeController');
                  $log.debug(codes);
                  console.debug("CONFIRMSOCIAL::getProgress::$attrs");
                  console.debug($attrs);

                  /*if ( codes ) {
                    angular.forEach( codes, function (code, cIx) {
                      $log.debug(code.locked);
                      $log.debug(typeof code.locked);

                      code.locked = code.locked == 1 ? 1 : 0;
                    });

                    return codes;
                  }*/

                  $mdDialog.show({
                    locals      : { code : codes },
                    controller  : QRSocialDialogController,
                    templateUrl : 'app/modules/creator/CreatorQRCodeTemplate.html',
                    parent      : angular.element(document.body),
                    clickOutsideToClose : true
                  });
                });
              });
        });



      };

      ctrl.startScan = function () {
        $log.debug('START SCAN');

          if (isCordova) {
            cordova.plugins.barcodeScanner.scan(function (result) {
              if (
                result.text &&
                ! result.cancelled &&
                result.format === 'QR_CODE'
              ) {
                var socialRegexPattern = /.+\/Social\/([A-Za-z0-9]+)/;
                var socialRegexMatch = result.text.match(socialRegexPattern);
                var socialCode = socialRegexMatch[1];

                if (socialCode) {
                  ctrl.code = socialCode;
                  ctrl.join();
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


      };

      ctrl.actionPerformed = function () {
        $rootScope.$broadcast('action', $scope.success);
      };

      ctrl.join = function () {
        SocialService.social( ctrl.code )
        .success(function (response) {
          // console.warn('join mobidul play callback : ');
          // console.info(response);

          if (response) {
            if (response.success) {
              //$state.go('mobidul.map', { mobidulCode: response.code });
              console.log("SocialService success");
              console.log(response);
              //TODO trigger success action
            } else {
              var msg = $translate.instant('SOCIAL_CODE_INVALID_EXPLANATION');

              var invalidPlayDialog =
                $mdDialog.alert()
                .parent( angular.element(document.body) )
                .title( $translate.instant('SOCIAL_NOT_POSSIBLE') )
                .textContent(msg)
                .ariaLabel( $translate.instant('LOGIN_ERROR') )
                .ok( $translate.instant('EDIT_CREDENTIALS') );

              $mdDialog.show(invalidPlayDialog);
            }
          }
        });
      };

    }


  }
})();
