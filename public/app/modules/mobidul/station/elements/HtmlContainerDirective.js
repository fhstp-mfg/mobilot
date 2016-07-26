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
    template: `
      <div>
        <div ng-transclude></div>
        <br>
      </div>
    `
  }
}

})();
