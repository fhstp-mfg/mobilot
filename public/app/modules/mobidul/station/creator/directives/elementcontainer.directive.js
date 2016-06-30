(function () {
  'use strict';
  
  angular
    .module('StationCreator')
    .directive('elementcontainer', ElementContainer);
  
  ElementContainer.$inject = [
    '$log', '$compile'
  ];
  
  function ElementContainer(
    $log, $compile
  ){
    return {
      restrict: 'E',
      template:'<div></div>',
      scope:{
        element: '='
      },
      link: function($scope, $element, $attrs, ctrl){
        //$log.info('ElementContainer - element:');
        //$log.debug($scope.element);

        /*
        setInterval(function(){
          $log.debug(ctrl.element);
        }, 2500);
        */

        ctrl.element = $scope.element;

        var type = ctrl.element.type;

        switch(type){

          case 'html':
            $element.append($compile('<editorhtmlcontainer data-content="ctrl.element.content"></editorhtmlcontainer>')($scope));
            break;

          case 'button':
            $element.append($compile('<actionbutton success="' + ctrl.element.success + '">' + ctrl.element.content + '</actionbutton>')($scope));
            break;

          case 'ifNear':
            $element.append($compile("<ifnear range='" + ctrl.element.range + "' fallback='" + ctrl.element.fallback + "' success='" + ctrl.element.success + "'></ifnear>")($scope));
            break;

          case 'inputCode':
          $element.append($compile("<editorinputcode data-verifier='ctrl.element.verifier' data-success='ctrl.element.success' error='ctrl.element.error'></editorinputcode>")($scope));
            break;

          default:
            $log.error('couldn\'t render element with type: ' + type);
        }

        angular.forEach(ctrl.element, function(value, key){
          $log.debug(key + ': ' + value);
          //$element.append('<p>' + value + '</p>')


        });

      },
      controller: ElementContainerController,
      controllerAs: 'ctrl'
    };
    
    function ElementContainerController($scope, $element, $attrs){
      
    }
  }
  
})();