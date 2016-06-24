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

  station.directive("inputcode",
    function(){
      return {
        restrict: "E",
        scope:{
          verifier: "@",
          success: '@',
          error: '@'
        },
        template: "<div><md-input-container><input data-inputchange='{{verifier}}' data-success='{{success}}' data-error='{{error}}'</input></md-input-container><md-button class='md-primary'>Go</md-button></div>"
      };
    });

  station.directive("inputchange", function(){
    return function(scope, element, attrs){
      element.bind("change", function(){
        if(element[0].value.toLowerCase() == attrs.inputchange.toLowerCase()){
          scope.$parent.actionPerformed(attrs.success);
        }else{
          scope.$parent.actionPerformed(attrs.error);
        }
      });
    };
  });

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
        template: "<div><md-button data-buttonclick='{{success}}'><ng-transclude></ng-transclude></md-button></div>"
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

})();