(function () {
'use strict';

angular
  .module('StationCreator')
  .directive('editor', Editor);

Editor.$inject = [
  '$log', '$rootScope', '$stateParams',
  'MobidulService'
];

function Editor (
  $log, $rootScope, $stateParams,
  MobidulService
) {
  return {
    restrict: 'E',
    template:
    '<div style="height: 100%">' +
      '<md-tabs id="editortabs" data-md-selected="editor.selectedIndex" ng-class="{\'station-editor-tab-default-mobidul\': $scope.isDefaultMobidul}">' +
        '<editortab data-tabconfig="tabconfig" data-tabname="tabname" ng-repeat="(tabname, tabconfig) in editor.config"></editortab>' +
      '</md-tabs>' +
    '</div>',
    scope: {
      config: '='
    },
    controller: EditorController,
    controllerAs: 'editor',

    link: function ($scope, $element, $attrs, Editor) {
      $scope.$watch('config', function (config) {
        if (config) {
          Editor.config = config;
          // $log.info('config editor:');
          // $log.debug(Editor.config);
        }
      });
    }
  };


  function EditorController ($scope, $element, $attrs) {
    var editor = this;

    MobidulService.getMobidulConfig($stateParams.mobidulCode)
    .then(function (config) {
      editor.stateMapping = config.states;
    });

    var editorEvent = $rootScope.$on('add:editorElement', function (event, type) {
      var stateConfig = editor.config[ editor.stateMapping[ editor.selectedIndex ] ];
      var selected = stateConfig.filter(function (elem) {
        return elem.selected == true
      })[0];
      var insertIndex = stateConfig.indexOf(selected) + 1;

      stateConfig.splice(insertIndex, 0, { type: type });
    });

    $scope.$on("$destroy", editorEvent);
  }

} })();
