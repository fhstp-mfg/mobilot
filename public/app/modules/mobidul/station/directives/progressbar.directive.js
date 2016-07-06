(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('progressbar', progressbar);

  progressbar.$inject = [
    '$log', 
    'RallyService'
  ];

  function progressbar(
    $log,
    RallyService
  ){

    return {
      restrict: 'E',
      scope:{
        current: '@',
        length: '@'
      },
      template: '<div >' +
        '<ul class="progressbar clearfix" data-progtrckr-steps="{{ length }}">' +
        '<li data-ng-class="($index <= current) ? \'finished\' : \'\'" '+
            'data-ng-repeat="i in ctrl.getNumber(length) track by $index"' +
            'data-ng-click="ctrl.goToStation($index)"></li>'+
        '</ul></div>',
      link: function($scope, $element, $attrs, ctrl){
        $attrs.current = parseInt($attrs.current);

      },
      controller: function($scope, $element, $attrs){
        var ctrl = this;

        ctrl.goToStation = function(order){
          //$log.info('Go To Station:');
          //$log.debug(order);
          if(order <= $scope.current){

            RallyService.goToStation(order);
          }
        };

        ctrl.getNumber = function(number){
          number = parseInt(number);
          return new Array(number);
        };
        
      },
      controllerAs: 'ctrl'
    };


  }

})();