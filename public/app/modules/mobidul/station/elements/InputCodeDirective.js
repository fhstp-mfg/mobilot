(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('mblInputCode', InputCode);

  InputCode.$inject = [
    '$rootScope'
  ];

  function InputCode(
    $rootScope
  ){
    return {
      restrict: "E",
      scope:{
        verifier: "@",
        success: '@',
        error: '@'
      },
      template: "<div><form ng-submit='ctrl.submit()'><md-input-container><input ng-model='ctrl.input' data-success='{{success}}' data-error='{{error}}'</input></md-input-container><md-button type='submit' class='md-raised md-primary'>Go</md-button></form></div>",

      controller: function($scope, $element, $attrs){
        var ctrl = this;

        ctrl.submit = submit;

        function submit(){

          if(ctrl.input){
            if(ctrl.input.toLowerCase() == $attrs.verifier.toLowerCase()){
              $rootScope.$broadcast('action', $attrs.success);
            }else{
              $rootScope.$broadcast('action', $attrs.error);
            }
          }

        }
      },
      controllerAs: 'ctrl'
    };
  }

})();