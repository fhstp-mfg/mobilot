(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editorpanel', EditorPanel);

  EditorPanel.$inject = [
    '$log', '$rootScope'
  ];

  function EditorPanel(
    $log, $rootScope
  ) {
    return {

      restrict: 'E',
      template: '<div>' +
      '<md-button data-ng-repeat="button in ctrl.editorConfig" data-ng-click="ctrl.addElement(button)">{{button}}</md-button>' +
      '</div>',
      scope: {},
      link: function ($scope, $element, $attr, ctrl) {

      },
      controller: EditorPanelController,
      controllerAs: 'ctrl'
    };

    function EditorPanelController($scope, $element, $attrs) {
      var ctrl = this;

      //Add Elements

      //Todo: get this information from a Service in order to support all kind of stationmodi
      ctrl.editorConfig = ['html', 'ifNear', 'inputCode', 'button'];

      ctrl.addElement = function(type){
        //$log.debug(type);
        $rootScope.$broadcast('add:editorElement', type);
      }

    }
  }
})();