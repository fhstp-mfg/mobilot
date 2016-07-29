(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('freeTextInputConfig', FreeTextInputConfig);

FreeTextInputConfig.$inject = [
  '$log',
  'UtilityService', 'RallyService'
];

function FreeTextInputConfig(
  $log,
  util, RallyService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<md-input-container>' +
        '<input type="text" ng-model="question" placeholder="Frage">' +
      '</md-input-container>' +
      '<action-selector data-opts="ctrl.actionOpts" data-selection="success"></action-selector>' +
      '<md-button data-ng-click="ctrl.exportAnswers()">Antworten runterladen</md-button>' +
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
      $log.debug('Exporting Answers for:', $scope.id);
    };

    ctrl.actionOpts = RallyService.getActions();

  }
}
})();