(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editor', Editor);

  Editor.$inject = [
    '$log', '$rootScope'
  ];

  function Editor(
    $log, $rootScope
  ){

    return {
      restrict: 'E',
      template: '<div style="height:100%;">' +
      '<md-tabs id="editortabs" data-md-selected="ctrl.selectedIndex">' +
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

      //Todo: get this information from a Service in order to support all kind of stationmodi
      var statiMapping = ['activated', 'open', 'completed'];

      $rootScope.$on('add:editorElement', function(event, type){

        ctrl.config[statiMapping[ctrl.selectedIndex]].push({
          type: type
        });

      });
    }
  }


})();