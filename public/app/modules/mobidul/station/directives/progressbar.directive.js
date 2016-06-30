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
        order: '@',
        length: '@'
      },
      template: '<div >' +
        '<ul class="progressbar clearfix" data-progtrckr-steps="{{ length }}">' +
        '<li data-ng-class="($index <= order) ? \'finished\' : \'\'" '+
            'data-ng-repeat="i in ctrl.getNumber(length) track by $index"></li>'+
        '</ul></div>',
      link: function($scope, $element, $attrs, ctrl){
        $attrs.order = parseInt($attrs.order);

      },
      controller: function($scope, $element, $attrs){
        var ctrl = this;
        
        ctrl.getNumber = function(number){
          number = parseInt(number);
          return new Array(number);
        };
        
      },
      controllerAs: 'ctrl'
    };


  }

})();