(function () {
  'use strict';

  angular
  .module('Mobidul')
  .directive('mblConfirmSocial', ConfirmSocial);

  ConfirmSocial.$inject = [
    '$log', '$translate', '$rootScope', 'StateManager',
    '$mdDialog'
  ];

  function ConfirmSocial (
    $log, $translate, $rootScope, StateManager,
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
        '<md-button class="md-raised md-primary" ng-if="ctrl.isConfirmed" ng-click="ctrl.actionPerformed()">' +
          '{{ \'PERFORM_ACTION\' | translate }}' +
        '</md-button>' +
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

      ctrl.actionPerformed = function () {
        $rootScope.$broadcast('action', $scope.success);
      };

    }
  }
})();