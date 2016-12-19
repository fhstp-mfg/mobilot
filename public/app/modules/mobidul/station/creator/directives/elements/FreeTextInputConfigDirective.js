(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('freeTextInputConfig', FreeTextInputConfig);

FreeTextInputConfig.$inject = [
  '$log', '$stateParams', '$translate', '$mdDialog',
  'UtilityService', 'RallyService', 'AttachmentService'
];

function FreeTextInputConfig(
  $log, $stateParams, $translate, $mdDialog,
  util, RallyService, AttachmentService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<md-input-container>' +
        '<input type="text" ng-model="ctrl.question" placeholder="{{ \'QUESTION\' | translate }}">' +
      '</md-input-container>' +
      '<action-selector opts="ctrl.actionOpts" selection="ctrl.success" name="SUCCESS_ACTION"></action-selector>' +
      '<md-button class="md-primary" ng-click="ctrl.exportAnswers()">{{ \'DOWNLOAD_ANSWERS\' | translate }}</md-button>' +
    '</div>',
    scope: {
      success: '=',
      question: '=',
      id: '='
    },
    bindToController: true,
    link: function ($scope, $element, $attr, ctrl) {

      if( ctrl.question === undefined ) {
        ctrl.question = $translate.instant('FREE_TEXT_QUESTION');
      }
      if ( ! $scope.id ) {
        $scope.id = util.getGUID();
      }
    },
    controller: FreeTextInputConfigController,
    controllerAs: 'ctrl'
  };

  function FreeTextInputConfigController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.exportAnswers = function () {
      var stationCode = $stateParams.stationCode,
          mobidulCode = $stateParams.mobidulCode;
      var notImplementedYet =
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .title($translate.instant('NOT_IMPLEMENTED_DIALOG'))
        .textContent($translate.instant('NOT_IMPLEMENTED_TEXT'))
        .ariaLabel($translate.instant('NOT_IMPLEMENTED_DIALOG'))
        .ok($translate.instant('OK'));

      $mdDialog.show( notImplementedYet );
      AttachmentService.exportTextsFromComponent(mobidulCode, stationCode, $scope.id);
    };

    ctrl.actionOpts = RallyService.getActions();

  }
}
})();