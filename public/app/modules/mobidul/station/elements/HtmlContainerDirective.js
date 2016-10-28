(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblHtmlContainer', HtmlContainer);


HtmlContainer.$inject = [
  /* ... */
];


function HtmlContainer (
  /* ... */
) {
  return {
    restrict: 'E',
    transclude: true,
    template: '' +
      '<div>' +
        '<div ng-transclude></div>' +
        '<md-divider style="margin-bottom: 1em; margin-top: 0.5em"></md-divider>' +
      '</div>'
  }
}

})();
