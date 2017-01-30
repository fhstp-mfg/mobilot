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
        '<div ng-if="ctrl.isConfirmed != true">' +
          '<span translate="SOCIAL_CODE_INPUT_DESCRIPTION"></span>' +
        '</div>' +
        '<div ng-if="ctrl.isConfirmed">' +
          '<span translate="SOCIAL_CODE_FEEDBACK"></span>' +
        '</div>' +
        '<md-button class="md-raised md-primary md-mobilot"' +
          ' ng-click="ctrl.openCode()">' +
          '{{ \'OPEN_CODE\' | translate }}' +
        '</md-button>' +
        '<md-button class="md-raised md-primary md-mobilot"' +
          ' ng-click="ctrl.startScan()" ng-if="ctrl.isCordova && !ctrl.isConfirmed">' +
          '{{ \'SCAN_CODE\' | translate }}' +
        '</md-button>' +
        '<md-button class="md-raised md-primary md-mobilot"' +
          ' ng-if="ctrl.isConfirmed" ng-click="ctrl.actionPerformed()">' +
          '{{ \'PERFORM_ACTION\' | translate }}' +
        '</md-button>' +
        '<md-divider id="station_creator_divider"></md-divider>' +
      '</div>',
      scope: {
        id: '@',
        success: '@',
        confirm: '@'
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

      if($scope.confirm === "false"){
        ctrl.isConfirmed = false;
      }else{
        ctrl.isConfirmed = true;
      }

      ctrl.code = null;
      ctrl.isCordova = isCordova;

      ctrl.openCode = function () {
        $log.debug('OPEN CODE');

        // generate code - mobidul&station&componentid
        var mobidulCode = StateManager.state.params.mobidulCode;
        var stationCode = StateManager.state.params.stationCode;
        var componentId = $attrs.id;

        $log.info('ConfirmSocialDirective::StateManagerParam::stationCode');
        $log.debug(stationCode);
        $log.info('ConfirmSocialDirective::ComponentId');
        $log.debug($attrs);
        $log.debug($attrs.id);

        MobidulService.getProgress(mobidulCode).
          then(function(progress){
              RallyService.getStatus(progress.progress)
              .then(function (status) {
                $log.info('ConfirmSocialDirective - RallyService.getStatus - status:');
                $log.debug(status);

              //  SocialService.getSocialCodes( mobidulCode, stationCode, status)
                SocialService.getSocialCodes( mobidulCode, stationCode, componentId)
                .success(function (codes, status, headers, config) {
                  $log.debug('getCodes success in SocialCodeController');
                  $log.debug(codes);
                  console.debug("CONFIRMSOCIAL::getProgress::$attrs");
                  console.debug($attrs);

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
                  $log.debug("socialCode");
                  $log.debug(socialCode);
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
        $log.info('ConfirmSocialDirective::ComponentId');
        $log.debug($attrs.id);

        SocialService.social( ctrl.code, $attrs.id )
        .success(function (response) {
          $log.debug('join mobidul play callback : ');
          $log.debug(response);

          if (response) {
            if (response.success) {
              $log.debug("SocialService success");
              $log.debug(response);

              ctrl.isConfirmed = true;
              //ctrl.actionPerformed();

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
