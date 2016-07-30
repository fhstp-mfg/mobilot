(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblFreeTextInput', FreeTextInput);

FreeTextInput.$inject = [
  '$log', '$rootScope',
  'AttachmentService'
];

function FreeTextInput(
  $log, $rootScope,
  AttachmentService
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
      id: '@',
      success: '@'
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

      AttachmentService.saveTextInput(ctrl.answer, $attrs.id)
      .success(function(response, status, headers, config){
        $log.info('response form saving text:', response);
      })
      .error(function (response, status, headers, config) {
        $log.error('error while saving text:,', response);
      });

      ctrl.disabled = true;

      $rootScope.$broadcast('action', $attrs.success);

    }

  }
}
})();