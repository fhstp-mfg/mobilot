(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('freeTextInputConfig', FreeTextInputConfig);

FreeTextInputConfig.$inject = [
  '$log', '$stateParams', '$translate',
  'UtilityService', 'RallyService', 'AttachmentService'
];

function FreeTextInputConfig(
  $log, $stateParams, $translate,
  util, RallyService, AttachmentService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<md-input-container>' +
        '<input type="text" ng-model="question" placeholder="{{ \'QUESTION\' | translate }}">' +
      '</md-input-container>' +
      '<action-selector data-opts="ctrl.actionOpts" data-selection="success"></action-selector>' +
      '<md-button data-ng-click="ctrl.exportAnswers()">{{ \'DOWNLOAD_ANSWERS\' | translate }}</md-button>' +
    '</div>',
    scope: {
      question: '=',
      id: '=',
      success: '='
    },
    link: function ($scope, $element, $attr, ctrl) {

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

      AttachmentService.exportTextsFromComponent(mobidulCode, stationCode, $scope.id);

    };

    ctrl.actionOpts = RallyService.getActions();

  }
}
})();