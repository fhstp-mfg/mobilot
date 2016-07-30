(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('actionButtonConfig', EditorActionButton);

EditorActionButton.$inject = [
  '$log',
  'RallyService'
];

function EditorActionButton(
  $log,
  RallyService
){

  return {
    restrict: 'E',
    template:
    '<div>' +
      '<md-button class="md-raised md-primary">{{content}}</md-button><br/>' +
      '<div class="config-part">' +
        '<md-input-container>' +
          '<input type="text" ng-model="content" placeholder="Beschriftung">' +
        '</md-input-container>' +
        '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="Success"></action-selector>' +
      '</div>' +
    '</div>',
    scope:{
      success: '=',
      content: '='
    },
    link: function($scope, $element, $attrs, ctrl){

    },
    controller: EditorActionButtonController,
    controllerAs: 'ctrl'
  };

  function EditorActionButtonController($scope, $element, $attrs){
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

  }
}
})();