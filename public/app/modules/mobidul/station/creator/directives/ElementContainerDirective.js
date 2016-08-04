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
      '<div class="editorelement">' +
        '<md-button data-ng-click="ctrl.showInfo()" class="editor-element-info">' +
          '<md-icon>info_outline</md-icon>' +
        '</md-button>' +
        '<md-button class="editor-element-delete" data-ng-click="ctrl.delete()">' +
          '<md-icon>delete</md-icon>' +
        '</md-button>' +
      '</div>',
    scope:{
      element: '='
    },
    link: function($scope, $element, $attrs, ctrl){
      //$log.info('ElementContainer - element:');
      //$log.debug($scope.element);

      ctrl.element = $scope.element;

      var type = ctrl.element.type;

      switch(type){

        case 'html':
          $element.append($compile('<html-container-config data-content="ctrl.element.content"></html-container-config>')($scope));
          break;

        case 'button':
          $element.append($compile('<action-button-config data-success="ctrl.element.success" data-content="ctrl.element.content"></action-button-config>')($scope));
          break;

        case 'ifNear':
          $element.append($compile('<trigger-near-config data-range="ctrl.element.range" fallback="ctrl.element.fallback" data-success="ctrl.element.success"></trigger-near-config>')($scope));
          break;

        case 'inputCode':
          $element.append($compile('<input-code-config data-id="ctrl.element.id" data-verifier="ctrl.element.verifier" data-success="ctrl.element.success" error="ctrl.element.error"></input-code-config>')($scope));
          break;

        case 'photoUpload':
          $element.append($compile('<photo-upload-config data-success="ctrl.element.success" data-id="ctrl.element.id" data-content="ctrl.element.content"></photo-upload-config>')($scope));
          break;

        case 'setTimeout':
          $element.append($compile('<set-timeout-config data-action="ctrl.element.action" data-delay="ctrl.element.delay" data-show="ctrl.element.show"></set-timeout-config>')($scope));
          break;

        case 'freeText':
          $element.append($compile('<free-text-input-config data-success="ctrl.element.success" data-question="ctrl.element.question" data-id="ctrl.element.id"></free-text-input-config>')($scope));
          break;

        default:
          $log.error('couldn\'t render element with type: ' + type);
      }

    },
    controller: ElementContainerController,
    controllerAs: 'ctrl'
  };

  function ElementContainerController($scope, $element, $attrs){

    var ctrl = this;

    ctrl.delete = function(){
      $rootScope.$broadcast('delete:editorElement', ctrl.element.$$hashKey);
    };

    ctrl.showInfo = function(){
      //alert(ctrl.element.type);

      var saveMobidulOptionsDialog =
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title(ctrl.element.type)
          // TODO: implement component description
          .textContent( 'lorem ipsum' )
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
