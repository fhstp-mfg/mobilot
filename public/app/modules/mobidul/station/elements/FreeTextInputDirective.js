(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblFreeTextInput', FreeTextInput);

FreeTextInput.$inject = [
  '$log', '$rootScope', '$stateParams',
  'AttachmentService'
];

function FreeTextInput(
  $log, $rootScope, $stateParams,
  AttachmentService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<h3>{{ctrl.question}}</h3>' +
      '<textarea style="max-width:100%; max-height: 100%" ' +
                'ng-model="ctrl.answer" ' +
                'cols="30" rows="8" ' +
                'ng-readonly="ctrl.disabled"></textarea>' +
      '<md-button class="md-raised md-primary" ng-click="ctrl.sendAnswer()" ng-disabled="ctrl.disabled">Absenden</md-button>' +
      '<md-divider id="station_creator_divider"></md-divider>' +
    '</div>',
    scope: {
      success: '@',
      question: '@',
      id: '@',
      answer : '='
    },
    link: function ($scope, $element, $attr, ctrl) {
      ctrl.disabled = false;
    },
    bindToController: true,
    controller: FreeTextInputController,
    controllerAs: 'ctrl'
  };

  function FreeTextInputController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.sendAnswer = function () {
      console.debug("FREETEXTINPUT::ctrl.answer");
      console.debug(ctrl.answer);
      console.debug("FREETEXTINPUT::ctrl.success");
      console.debug(ctrl.success);
      console.debug($attrs.success);

      var mobidulCode = $stateParams.mobidulCode,
          stationCode = $stateParams.stationCode;

      AttachmentService.saveTextInput(ctrl.answer, mobidulCode, stationCode , $attrs.id)
      .then(function (response) {
        $log.info('FREETEXTINPUT::response form saving text:', response);
      }, function (error) {
        $log.error('FREETEXTINPUT::error while saving text:,', error);
      });

      ctrl.disabled = true;

      $rootScope.$broadcast('action', $attrs.success);
    }
  }
}
})();