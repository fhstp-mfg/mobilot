(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblFreeTextInput', FreeTextInput);

FreeTextInput.$inject = [
  '$log',
  'ActivityService'
];

function FreeTextInput(
  $log,
  ActivityService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<h2>{{question}}</h2>' +
      '<textarea data-ng-model="ctrl.answer" cols="30" rows="10"></textarea>' +
      '<md-button data-ng-click="ctrl.sendAnswer()" ng-disabled="ctrl.disabled">Absenden</md-button>' +
    '</div>',
    scope: {
      question: '@',
      id: '@'
    },
    link: function ($scope, $element, $attr, ctrl) {

      ctrl.disabled = false;

    },
    controller: FreeTextInputController,
    controllerAs: 'ctrl'
  };

  function FreeTextInputController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.sendAnswer = function () {

      ActivityService.commitActivity({
        type: ActivityService.TYPES.USER_ACTION,
        name: ActivityService.USER_ACTIONS.FREE_TEXT_INPUT,
        payload: {
          answer: ctrl.answer,
          componentId: $scope.id
        }
      });

      ActivityService.pushActivity();

      ctrl.disabled = true;
    }

  }
}
})();