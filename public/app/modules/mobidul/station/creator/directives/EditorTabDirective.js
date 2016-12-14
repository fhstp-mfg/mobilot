(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('editortab', EditorTab);

EditorTab.$inject = [
  '$log', '$translate', '$rootScope'
];

function EditorTab(
  $log, $translate, $rootScope
){

  return {
    restrict: 'E',
    template: '' +
    '<div>' +
      '<md-tab>' +
        '<md-tab-label>{{ ctrl.tabname | translate }}</md-tab-label>' +
        '<md-tab-body>' +
          '<editor-tools></editor-tools>' +
          '<ul dnd-list="ctrl.tabconfig">' +
            '<li ng-repeat="element in ctrl.tabconfig"' +
              'dnd-draggable="element"' +
              'dnd-moved="ctrl.tabconfig.splice($index, 1)"' +
              'dnd-effect-allowed="move">' +
            '<element-container element="element">' +
              '<md-button class="editor-element-opt" ng-click="ctrl.moveUp($index)" ng-show="!$first">' +
                '<md-icon class="material-icons">arrow_upward</md-icon>' +
              '</md-button>' +
            '</element-container>' +
            '</li>' +
          '</ul>' +
          '{{selected}}' +
        '</md-tab-body>' +
      '</md-tab>' +
    '</div>',
    scope: {
      tabconfig: '=',
      tabname: '='
    },
    bindToController: true,
    link: function($scope, $element, $attrs, ctrl){

      //$log.info('EditorTab - scope:');
      //$log.debug($scope.tabconfig);

      ctrl.selected = null;

      $rootScope.$on('selected:editorElement', function ( event, msg ) {
        //$log.debug(event, msg);
        //$log.debug($scope.tabconfig);

        ctrl.tabconfig.map(function(elem){
          return elem.selected = false;
        });

        var selectedElement = ctrl.tabconfig.filter(function(elem){
          return elem['$$hashKey'] == msg;
        })[0];

        if ( selectedElement ) selectedElement.selected = true;
      });


    },
    controller: EditorTabController,
    controllerAs: 'ctrl'
  };

  function EditorTabController($scope, $element, $attrs){
    var ctrl = this;

    ctrl.moveItem = function(origin, destination) {
      var temp = ctrl.tabconfig[destination];
      ctrl.tabconfig[destination] = ctrl.tabconfig[origin];
      ctrl.tabconfig[origin] = temp;
    };

    ctrl.moveUp = function(itemIndex) {
      ctrl.moveItem(itemIndex, itemIndex - 1);
    };

    $rootScope.$on('delete:editorElement', function(event, id){

      var elementToDelete = ctrl.tabconfig.filter(function(element){
        return element.$$hashKey == id;
      })[0];

      if(elementToDelete){
        var indexToDelete = ctrl.tabconfig.indexOf(elementToDelete);
        ctrl.tabconfig.splice(indexToDelete, 1);
      }
    });

  }

}

})();