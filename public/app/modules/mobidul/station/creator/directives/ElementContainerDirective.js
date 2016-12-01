(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('elementContainer', ElementContainer);

ElementContainer.$inject = [
  '$log', '$compile', '$rootScope', '$translate',
  '$mdDialog', '$stateParams',
  'MobidulService'
];

function ElementContainer(
  $log, $compile, $rootScope, $translate,
  $mdDialog, $stateParams,
  MobidulService
) {
  return {
    restrict: 'E',
    template: (
      '<div class="editor-element-opt-container">' +
      '<md-button class="editor-element-opt" ng-click="ctrl.showInfo()">' +
      '<md-icon style="color: #2E9FDE">{{ ctrl.icon }}</md-icon>' +
      '<span>{{ ctrl.type }}</span>'+
      // '<md-icon style="color: #2E9FDE">info</md-icon>' +
      '</md-button>' +
        '<md-button class="editor-element-opt" ng-click="ctrl.delete()">' +
          '<md-icon style="color: #EF4A53">delete</md-icon>' +
        '</md-button>' +
        '<md-button class="editor-element-opt" ng-click="ctrl.collapse()">' +
          '<md-icon style="color: #106391">edit</md-icon>' +
        '</md-button>' +
      '</div>'
    ),

    scope: {
      element: '='
    },

    link: function ($scope, $element, $attrs, ctrl) {
      // $log.info('ElementContainer - element:');
      // $log.debug($scope.element);

      ctrl.element = $scope.element;
      var type = ctrl.element.type;

      switch (type) {
        case 'HTML':
          $element.append($compile('<html-container-config data-content="ctrl.element.content"></html-container-config>')($scope));
          break;

        case 'BUTTON':
          $element.append($compile('<action-button-config data-success="ctrl.element.success" data-content="ctrl.element.content"></action-button-config>')($scope));
          break;

        case 'IF_NEAR':
          $element.append($compile('<trigger-near-config data-range="ctrl.element.range" fallback="ctrl.element.fallback" data-success="ctrl.element.success"></trigger-near-config>')($scope));
          break;

        case 'BLUETOOTH':
          if ( isCordova ) {
            $element.append($compile('<blue-tooth-config beaconname="ctrl.element.beaconname" ' +
                                                        'beaconkey="ctrl.element.beaconkey" ' +
                                                        'fallback="ctrl.element.fallback" ' +
                                                        'success="ctrl.element.success" ' +
                                                        'beaconfoundcheck="ctrl.element.beaconfoundcheck" ' +
                                                        'selectedrange="ctrl.element.selectedrange">' +
                                    '</blue-tooth-config>')($scope));
            // console.debug("BLUE-->ctrl.element");
            // console.debug(ctrl.element);
            // console.debug("BLUE-->$scope");
            // console.debug($scope);
            // console.debug("BLUE-->ctrl");
            // console.debug(ctrl);
            // console.debug("BLUE-->type");
            // console.debug(ctrl.element.type);
          }

          break;

        case 'INPUT_CODE':
          $element.append($compile('<input-code-config data-id="ctrl.element.id" data-verifier="ctrl.element.verifier" data-success="ctrl.element.success" error="ctrl.element.error"></input-code-config>')($scope));
          break;

        // case 'PHOTO_UPLOAD':
        //   $element.append($compile('<photo-upload-config data-success="ctrl.element.success" data-id="ctrl.element.id" data-content="ctrl.element.content"></photo-upload-config>')($scope));
        //   break;

        case 'SET_TIMEOUT':
          $element.append($compile('<set-timeout-config data-action="ctrl.element.action" data-delay="ctrl.element.delay" data-show="ctrl.element.show"></set-timeout-config>')($scope));
          break;

        case 'FREE_TEXT':
          $element.append($compile('<free-text-input-config success="ctrl.element.success" question="ctrl.element.question" id="ctrl.element.id"></free-text-input-config>')($scope));
          break;

        // case 'CONFIRM_SOCIAL':
        //   $element.append($compile('<confirm-social-config data-id="ctrl.element.id" data-success="ctrl.element.success"></confirm-social-config>')($scope));
        //   break;

        case 'SHOW_SCORE':
          $element.append($compile('<show-score-config data-content="ctrl.element.content"></show-score-config>')($scope));
          break;

        default:
          $log.error('couldn\'t render element with type: ' + type);
      }

      $rootScope.$on('selected:editorElement', function (event, msg) {
        if ( msg != ctrl.element.$$hashKey ) {
          $element.removeClass('selected');
        }
      });

      // Retrieving Icon
      // TODO: can be simplified if element config is not bound to mode but global
      MobidulService.getMobidulConfig($stateParams.mobidulCode)
      .then(function (config) {
        for ( var element in config.elements ) {
          if ( config.elements.hasOwnProperty(element) ) {
            if ( element == ctrl.element.type ) {
              ctrl.icon = config.elements[element].icon;
              break;
            }
          }
        }
      });
    },
    controller: ElementContainerController,
    controllerAs: 'ctrl'
  };

  function ElementContainerController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.delete = function () {
      var confirmDeleteElement = $mdDialog.confirm()
      .title($translate.instant('DELETE_COMPONENT_TITLE'))
      .textContent($translate.instant('DELETE_COMPONENT_WARNING'))
      .ariaLabel($translate.instant('CONFIRMATION'))
      .ok($translate.instant('YES'))
      .cancel($translate.instant('NO'));

      $mdDialog.show(confirmDeleteElement)
      .then(function () {
        $rootScope.$broadcast('delete:editorElement', ctrl.element.$$hashKey);
      });
    };

    ctrl.collapse = function () {
      $element.toggleClass('selected');
      $rootScope.$broadcast('selected:editorElement', ctrl.element.$$hashKey);
    };

    ctrl.showInfo = function () {
      var saveMobidulOptionsDialog =
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title($translate.instant($scope.element.type))
          // TODO: implement component description
          .textContent($translate.instant($scope.element.type + '_DESCRIPTION'))
          .ariaLabel($translate.instant('CLOSE'))
          .ok($translate.instant('CLOSE'));

      $mdDialog.show( saveMobidulOptionsDialog )
        .then(function () {
          // ...
        });
    };
  }
}

})();
