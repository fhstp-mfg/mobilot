(function () {
  'use strict';
  
  angular
    .module('StationCreator')
    .directive('elementContainer', ElementContainer);
  
  ElementContainer.$inject = [
    '$log', '$compile', '$rootScope'
  ];
  
  function ElementContainer(
    $log, $compile, $rootScope
  ){
    return {
      restrict: 'E',
      template:'<div class="editorelement"><button data-ng-click="ctrl.delete()">Delete</button></div>',
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
            $element.prepend($compile('<html-container-config data-content="ctrl.element.content"></html-container-config>')($scope));
            break;

          case 'button':
            $element.prepend($compile('<action-button-config data-success="ctrl.element.success" data-content="ctrl.element.content"></action-button-config>')($scope));
            break;

          case 'ifNear':
            $element.prepend($compile("<trigger-near-config data-range='ctrl.element.range' fallback='ctrl.element.fallback' data-success='ctrl.element.success'></trigger-near-config>")($scope));
            break;

          case 'inputCode':
          $element.prepend($compile("<input-code-config data-verifier='ctrl.element.verifier' data-success='ctrl.element.success' error='ctrl.element.error'></input-code-config>")($scope));
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
      }

    }
  }
  
})();