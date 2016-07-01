(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editor', Editor);

  Editor.$inject = [
    '$log'
  ];

  function Editor(
    $log
  ){

    return {
      restrict: 'E',
      template: '<div style="height:100%;">' +
      '<md-tabs id="editortabs">' +
      '<editortab data-tabconfig="tabconfig" data-tabname="tabname" ng-repeat="(tabname, tabconfig) in ctrl.config"></editortab>' +
      '</md-tabs>' +
      '</div>',
      scope:{
        config: '='
      },
      controller: EditorController,
      controllerAs: 'ctrl',
      link: function($scope, $element, $attrs, ctrl){

        $scope.$watch('config', function(config){
          if(config){
            ctrl.config = config;
            //$log.info('config editor:');
            //$log.debug(ctrl.config);
          }
        });
      }
    };

    function EditorController($scope, $element, $attrs){
      var ctrl = this;




    }
  }


})();