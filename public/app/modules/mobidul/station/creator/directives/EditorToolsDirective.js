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
      '<md-button data-ng-repeat="button in ctrl.editorConfig" data-ng-click="ctrl.addElement(button)" class="editor-add-button">' +
        '<md-icon>{{ctrl.iconMap[button]}}</md-icon>' +
      '</md-button>' +
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
      // $log.info('config in editorpanel:');
      // $log.debug(config);
      ctrl.editorConfig = config.elements;
    });

    ctrl.iconMap = {
      HTML    :       'text_format',
      IF_NEAR :       'my_location',
      INPUT_CODE :    'spellcheck',
      BUTTON :        'crop_square',
      PHOTO_UPLOAD :  'camera_alt',
      SET_TIMEOUT :   'alarm',
      FREE_TEXT :     'edit',
      CONFIRM_SOCIAL: 'people'
    };

    ctrl.addElement = function(type){
      //$log.debug(type);
      $rootScope.$broadcast('add:editorElement', type);
    }

  }
}
})();