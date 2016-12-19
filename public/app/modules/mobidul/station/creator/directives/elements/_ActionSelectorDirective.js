(function () {
'use strict';

angular
  .module('StationCreator')
  .directive('actionSelector', ActionSelector);


ActionSelector.$inject = [
  '$log', '$translate'
];

function ActionSelector(
  $log, $translate
) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,

    template: (
      '<md-input-container>' +
        '<md-select ' +
          'ng-model="ctrl.selectionTemp" ' +
          'placeholder="{{ name | translate }}"' +
        '>' +
          '<md-optgroup>' +
            '<label>{{ name | translate }}</label>' +
            '<md-option ng-value="opt" ng-repeat="opt in opts">' +
              '{{ opt | translate }}' +
            '</md-option>' +
          '</md-optgroup>' +
        '</md-select>' +
        '<md-input-container ng-if="ctrl.selectionAttrNeeded">' +
          '<input type="text" ' +
            'ng-model="ctrl.selectionAttr" ' +
            'ng-change="ctrl.selectionChange()" ' +
          '/>' +
        '</md-input-container>' +
      '</md-input-container>'
    ),

    scope: {
      opts: '=',
      selection: '=',
      name: '@'
    },

    link: function ($scope, $element, $attr, ctrl) {
      ctrl.selectionTemp = $scope.selection || '';

      if ( ctrl.selectionTemp.split(':').length > 1 ) {
        ctrl.selectionAttr = ctrl.selectionTemp.split(':')[1];
        ctrl.selectionTemp = ctrl.selectionTemp.split(':')[0] + ':';
      }

      $scope.$watch('ctrl.selectionTemp', function (selection) {
        if ( selection && selection.split(':').length > 1 ) {
          ctrl.selectionAttrNeeded = true;
          $scope.selection = ctrl.selectionTemp + ctrl.selectionAttr;
        } else {
          ctrl.selectionAttrNeeded = false;
          $scope.selection = selection;
        }
      });

      $scope.$watch('ctrl.selectionAttr', function (selectionAttr) {
        if (selectionAttr) {
          $scope.selection = ctrl.selectionTemp + selectionAttr;
        }
      });
    },

    controller: ActionSelectorController,
    controllerAs: 'ctrl'
  };

  function ActionSelectorController ($scope, $element, $attrs) {
    var ctrl = this;

    // $log.info('ActionSelectorController');
    // ...
  }
}

})();
