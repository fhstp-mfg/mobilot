(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editortab', EditorTab);

  EditorTab.$inject = [
    '$log', '$rootScope'
  ];

  function EditorTab(
    $log, $rootScope
  ){

    return {
      restrict: 'E',
      template: '<div><md-tab>' +
      '<md-tab-label>{{tabname}}</md-tab-label>' +
      '<md-tab-body>' +
      '<editor-tools></editor-tools>' +
      '<ul dnd-list="tabconfig">' +
        '<li ng-repeat="element in tabconfig"' +
          'dnd-draggable="element"' +
          'dnd-moved="tabconfig.splice($index, 1)"' +
          'dnd-effect-allowed="move"' +
          'dnd-selected="models.selected = element"' +
          'ng-class="{\'selected\': models.selected === element}"' +
        '><element-container element="element"></element-container></li>' +
      '</ul>' +
      '</md-tab-body>' +
      '</md-tab></div>',
      scope: {
        tabconfig: '=',
        tabname: '='
      },
      link: function($scope, $element, $attrs, ctrl){

        //$log.info('EditorTab - scope:');
        //$log.debug($scope.tabconfig);

      },
      controller: EditorTabController,
      controllerAs: 'ctrl'
    };

    function EditorTabController($scope, $element, $attrs){
      var ctrl = this;

      $rootScope.$on('delete:editorElement', function(event, id){

        var elementToDelete = $scope.tabconfig.filter(function(element){
          return element.$$hashKey == id;
        })[0];

        if(elementToDelete){
          var indexToDelete = $scope.tabconfig.indexOf(elementToDelete);
          $scope.tabconfig.splice(indexToDelete, 1);
        }
      });

    }

  }

})();