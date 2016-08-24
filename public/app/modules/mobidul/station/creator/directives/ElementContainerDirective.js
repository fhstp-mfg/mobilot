(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('elementContainer', ElementContainer);

ElementContainer.$inject = [
  '$log', '$compile', '$rootScope', '$translate',
  '$mdDialog'
];

function ElementContainer(
  $log, $compile, $rootScope, $translate,
  $mdDialog
){
  return {
    restrict: 'E',
    template:
      '<md-button class="editor-element-opt" data-ng-click="ctrl.delete()">' +
        '<md-icon>delete</md-icon>' +
      '</md-button>' +
      '<md-button  class="editor-element-opt" data-ng-click="ctrl.showInfo()">' +
        '<md-icon>info_outline</md-icon>' +
      '</md-button>' +
      '<md-button class="editor-element-opt" data-ng-click="ctrl.collapse()">' +
        '<md-icon>build</md-icon>' +
      '</md-button>',
    scope:{
      element: '='
    },
    link: function($scope, $element, $attrs, ctrl){
      //$log.info('ElementContainer - element:');
      //$log.debug($scope.element);

      ctrl.element = $scope.element;

      var type = ctrl.element.type;

      switch(type){

        case 'HTML':
          $element.prepend($compile('<html-container-config data-content="ctrl.element.content"></html-container-config>')($scope));
          break;

        case 'BUTTON':
          $element.prepend($compile('<action-button-config data-success="ctrl.element.success" data-content="ctrl.element.content"></action-button-config>')($scope));
          break;

        case 'IF_NEAR':
          $element.prepend($compile('<trigger-near-config data-range="ctrl.element.range" fallback="ctrl.element.fallback" data-success="ctrl.element.success"></trigger-near-config>')($scope));
          break;

        case 'INPUT_CODE':
          $element.prepend($compile('<input-code-config data-id="ctrl.element.id" data-verifier="ctrl.element.verifier" data-success="ctrl.element.success" error="ctrl.element.error"></input-code-config>')($scope));
          break;

        case 'PHOTO_UPLOAD':
          $element.prepend($compile('<photo-upload-config data-success="ctrl.element.success" data-id="ctrl.element.id" data-content="ctrl.element.content"></photo-upload-config>')($scope));
          break;

        case 'SET_TIMEOUT':
          $element.prepend($compile('<set-timeout-config data-action="ctrl.element.action" data-delay="ctrl.element.delay" data-show="ctrl.element.show"></set-timeout-config>')($scope));
          break;

        case 'FREE_TEXT':
          $element.prepend($compile('<free-text-input-config data-success="ctrl.element.success" data-question="ctrl.element.question" data-id="ctrl.element.id"></free-text-input-config>')($scope));
          break;

        case 'CONFIRM_SOCIAL':
          $element.prepend($compile('<confirm-social-config data-id="ctrl.element.id" data-success="ctrl.element.success"></confirm-social-config>')($scope));
          break;

        case 'SHOW_SCORE':
          $element.prepend($compile('<show-score-config data-content="ctrl.element.content"></show-score-config>')($scope));
          break;

        default:
          $log.error('couldn\'t render element with type: ' + type);
      }

      $rootScope.$on('selected:editorElement', function ( event, msg ) {
        if ( msg != ctrl.element.$$hashKey ) {
          $element.removeClass('selected');
        }
      })

    },
    controller: ElementContainerController,
    controllerAs: 'ctrl'
  };

  function ElementContainerController($scope, $element, $attrs){

    var ctrl = this;

    ctrl.delete = function () {
      $rootScope.$broadcast('delete:editorElement', ctrl.element.$$hashKey);
    };

    ctrl.collapse = function () {
      $element.toggleClass('selected');
      $rootScope.$broadcast('selected:editorElement', ctrl.element.$$hashKey);
    };

    ctrl.showInfo = function () {

      var saveMobidulOptionsDialog =
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title( $translate.instant($scope.element.type) )
          // TODO: implement component description
          .textContent( $translate.instant($scope.element.type + '_DESCRIPTION') )
          .ariaLabel($translate.instant('CLOSE'))
          .ok($translate.instant('CLOSE'));

      $mdDialog.show( saveMobidulOptionsDialog )
        .then(function ()
        {

        });

    };

  }
}

})();
