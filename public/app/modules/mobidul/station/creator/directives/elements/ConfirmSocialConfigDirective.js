(function () {
'use strict';

angular
.module('StationCreator')
.directive('confirmSocialConfig', ConfirmSocialConfig);

ConfirmSocialConfig.$inject = [
  '$log',
  'UtilityService', 'RallyService'
];

function ConfirmSocialConfig (
  $log,
  util, RallyService
) {
  return {
    restrict: 'E',
    template: '' +
    '<div>' +
      '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="SUCCESS_ACTION"></action-selector>' +
    '</div>',
    scope: {
      id: '=',
      success: '='
    },
    link: function ( $scope, $element, $attr, ctrl ) {

      if ( ! $scope.id ) {
        $scope.id = util.getGUID();
      }
    },
    controller: ConfirmSocialConfigController,
    controllerAs: 'ctrl'
  };

  function ConfirmSocialConfigController ( $scope, $element, $attrs ) {
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

  }
}
})();
