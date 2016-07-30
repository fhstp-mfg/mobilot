(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('editorTools', EditorPanel);

EditorPanel.$inject = [
  '$log', '$rootScope',
  'StateManager', 'MobidulService'
];

function EditorPanel(
  $log, $rootScope,
  StateManager, MobidulService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '<md-button data-ng-repeat="button in ctrl.editorConfig" data-ng-click="ctrl.addElement(button)" class="editor-add-button">{{button}}</md-button>' +
    '</div>',
    scope: {},
    link: function ($scope, $element, $attr, ctrl) {

    },
    controller: EditorPanelController,
    controllerAs: 'ctrl'
  };

  function EditorPanelController($scope, $element, $attrs) {
    var ctrl = this;


    var currentMobidulCode = StateManager.state.params.mobidulCode;

    MobidulService.getMobidulConfig(currentMobidulCode)
      .then(function(config){
        $log.info('config in editorpanel:');
        $log.debug(config);
        ctrl.editorConfig = config.elements;
      });


    ctrl.addElement = function(type){
      //$log.debug(type);
      $rootScope.$broadcast('add:editorElement', type);
    }

  }
}
})();