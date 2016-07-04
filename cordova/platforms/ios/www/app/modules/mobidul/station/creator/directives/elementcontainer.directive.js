(function () {
  'use strict';
  
  angular
    .module('StationCreator')
    .directive('elementcontainer', ElementContainer);
  
  ElementContainer.$inject = [
    '$log', '$compile', '$rootScope'
  ];
  
  function ElementContainer(
    $log, $compile, $rootScope
  ){
    return {
      restrict: 'E',
      template:'<div class="editorelement" data-ng-click="ctrl.delete()"><button>Delete</button></div>',
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
            $element.prepend($compile('<editorhtmlcontainer data-content="ctrl.element.content"></editorhtmlcontainer>')($scope));
            break;

          case 'button':
            $element.prepend($compile('<editoractionbutton data-success="ctrl.element.success" data-content="ctrl.element.content"></editoractionbutton>')($scope));
            break;

          case 'ifNear':
            $element.prepend($compile("<editorifnear data-range='ctrl.element.range' fallback='ctrl.element.fallback' data-success='ctrl.element.success'></editorifnear>")($scope));
            break;

          case 'inputCode':
          $element.prepend($compile("<editorinputcode data-verifier='ctrl.element.verifier' data-success='ctrl.element.success' error='ctrl.element.error'></editorinputcode>")($scope));
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