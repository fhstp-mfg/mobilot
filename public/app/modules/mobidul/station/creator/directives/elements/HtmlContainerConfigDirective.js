(function () {
'use strict';

angular
  .module('StationCreator')
  .directive('htmlContainerConfig', HtmlEditor);


HtmlEditor.$inject = [
  '$log'
];

function HtmlEditor (
  $log
) {

  return {
    restrict: 'E',
    scope: {
      content: '='
    },
    template: '' +
      '<div>' +
        '<wysiwyg-edit ' +
          'content="content" ' +
          'api="htmlEditor.api">' +
        '</wysiwyg-edit>' +
      '</div>'
    ,

    link: function ($scope, $element, $attrs, HtmlEditor) {
      // ...
    },

    controller: HtmlEditorController,
    controllerAs: 'htmlEditor'
  };



  function HtmlEditorController (
    $scope, $element, $attrs
  ) {
    var htmlEditor = this;
    // ...
  }

}

})();
