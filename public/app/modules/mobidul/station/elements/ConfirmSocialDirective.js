(function () {
  'use strict';

  angular
  .module('Mobidul')
  .directive('mblConfirmSocial', ConfirmSocial);

  ConfirmSocial.$inject = [
    '$log', '$translate',
    '$mdDialog'
  ];

  function ConfirmSocial (
    $log, $translate,
    $mdDialog
  ) {
    return {

      restrict: 'E',
      template: '' +
      '<div>' +
        '<md-button class="md-raised md-primary"' +
          'ng-click="ctrl.openCode()">' +
          '{{ \'OPEN_CODE\' | translate }}' +
        '</md-button>' +
        '<md-button class="md-raised md-primary"' +
          'ng-click="ctrl.startScan()">' +
          '{{ \'SCAN_CODE\' | translate }}' +
        '</md-button>' +
      '</div>',
      scope: {
        id: '@',
        success: '@'
      },
      link: function ( $scope, $element, $attr, ctrl ) {

      },
      controller: ConfirmSocialController,
      controllerAs: 'ctrl'
    };

    function ConfirmSocialController ( $scope, $element, $attrs ) {
      var ctrl = this;

      ctrl.openCode = function () {
        $log.debug('OPEN CODE');

        $mdDialog.show({
          locals      : { code : 'tho3do' },
          controller  : QRDialogController,
          templateUrl : 'app/modules/creator/CreatorQRCodeTemplate.html',
          parent      : angular.element(document.body),
          clickOutsideToClose : true
        })

      };

      ctrl.startScan = function () {
        $log.debug('START SCAN');
      };

    }
  }
})();