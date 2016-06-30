(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editortab', EditorTab);

  EditorTab.$inject = [
    '$log'
  ];

  function EditorTab(
    $log
  ){

    return {
      restrict: 'E',
      template: '<div><md-tab>' +
      '<md-tab-label>{{tabname}}</md-tab-label>' +
      '<md-tab-body>' +
      '<elementcontainer data-element="element" ng-repeat="element in tabconfig"></elementcontainer>' +
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




    }

  }

})();