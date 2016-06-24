(function () {
  "use strict";

  var station = angular.module('Mobidul');

  station.directive('html-container',
    function(){
      return {
        restrict: 'E',
        transclude: true,
        template: '<div><div ng-transclude></div><br/></div>'
      };
    });

  station.directive("inputcode",[ '$rootScope',
    function($rootScope){
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
    }]);


  station.directive("scancode",
    function(){
      return {
        restrict: "E",
        template: "<div><md-button>Scan Code!</md-button></div>"
      };
    });

  station.directive('navigator',
    function(){
      return {
        restrict: 'E',
        template: "[Navigator]"
      };
    });

  station.directive('actionbutton',
    function(){
      return {
        restrict: "E",
        transclude: true,
        scope:{
          success: '@'
        },
        template: "<div><md-button class='md-raised md-primary' data-buttonclick='{{success}}'><ng-transclude></ng-transclude></md-button></div>"
      };
    });

  station.directive('buttonclick',
  function(){
    return function(scope, element, attrs){
      element.bind('click', function(){
        scope.$parent.actionPerformed(attrs.buttonclick);
      });
    };
  });

  station.directive('positionicon', ['GeoLocationService', '$rootScope', '$log',
  function(GeoLocationService, $rootScope, $log){
    return {
      restrict: 'E',
      scope:{
        fallback: '@',
        success: '@',
        range: '@'
      },
      template: "<div>" +
        "<div ng-if='ctrl.inaccurate'>" +
          "<span>GPS zu ungenau - gib den Code bei der Station ein:</span>" +
          "<inputcode verifier='{{fallback}}' success='verifyIfNear:{{success}}' error='say:Falscher Code, probiers nochmal!'></inputcode>" +
        "</div>" +
        "<div ng-if='!ctrl.inaccurate'>" +
          "<md-icon ng-if='ctrl.trigger'>room</md-icon>" +
          "<div ng-if='!ctrl.trigger'>" +
            "<span>{{ctrl.default}}</span>" +
            "<span ng-if='ctrl.distance'>Du bist noch {{ctrl.distance}} Meter entfernt. (± {{ctrl.accuracy}}m)</span>" +
            "<md-icon class='search-anim'>track_changes</md-icon>" +
          "</div>" +
        "</div>" +
      "</div>",

      link: function($scope, $element, $attrs, ctrl){

        //$log.info('positionicon - link - attrs:');
        //$log.debug($attrs);

        $scope.$on('inaccurate', function(event, msg){
          if(msg){
            ctrl.inaccurate = true;
          }
        });

        $scope.$on('distance', function(event, msg){
          if(msg){
            ctrl.default = null;
            ctrl.inaccurate = false;
            ctrl.distance = parseInt(msg.d);
            ctrl.accuracy = parseInt(msg.a);

            ctrl.range = parseInt($attrs.range) + ctrl.accuracy;

            if (ctrl.distance <= ctrl.range) {
              $log.info('User in Range!');
              GeoLocationService.stopPositionWatching();

              ctrl.trigger = true;

              $rootScope.$broadcast('action', $attrs.success);
            }
          }
        });

      },
      controller: function($scope, $element, $attrs){
        var ctrl = this;

        ctrl.default = "GPS wird abgerufen..."
        ctrl.inaccurate = false;
        ctrl.trigger = false;
      },
      controllerAs: 'ctrl'

    };
  }]);

})();
