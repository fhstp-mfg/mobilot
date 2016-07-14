(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editor', Editor);

  Editor.$inject = [
    '$log', '$rootScope', '$stateParams',
    'MobidulService'
  ];

  function Editor(
    $log, $rootScope, $stateParams,
    MobidulService
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

      MobidulService.getMobidulConfig($stateParams.mobidulCode)
        .then(function(config){
          ctrl.stateMapping = config.states;
        });

      $rootScope.$on('add:editorElement', function(event, type){

        var stateConfig = ctrl.config[ctrl.stateMapping[ctrl.selectedIndex]];
        
        var selected = stateConfig.filter(function(elem){
          return elem.selected == true;
        })[0];

        var insertIndex = stateConfig.indexOf(selected) + 1;

        stateConfig.splice(insertIndex, 0, {type: type});

      });
    }
  }


})();