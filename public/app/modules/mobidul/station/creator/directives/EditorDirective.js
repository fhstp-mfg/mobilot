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
      '<md-tabs id="editortabs" md-selected="editor.selectedIndex" ng-class="{ \'station-editor-tab-default-mobidul\': ! editor.showStationStates }">' +
        '<editortab tabconfig="tabconfig" tabname="tabname" ng-repeat="(tabname, tabconfig) in editor.config"></editortab>' +
      '</md-tabs>' +
    '</div>',

    scope: {
      config: '=',
      showStationStates: '='
    },
    controller: EditorController,
    controllerAs: 'editor',

    link: function ($scope, $element, $attrs, Editor) {
      Editor.showStationStates = $scope.showStationStates;

      $scope.$watch('config', function (config) {
        if (config) {
          Editor.config = config;
          $log.debug('MAHSHASUD: ', $attrs);
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
