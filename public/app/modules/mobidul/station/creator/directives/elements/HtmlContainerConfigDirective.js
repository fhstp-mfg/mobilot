(function () {
'use strict';

angular
  .module('StationCreator')
  .directive('htmlContainerConfig', HtmlEditor);


HtmlEditor.$inject = [
  '$log', '$sce'
];

function HtmlEditor (
  $log, $sce
) {

  return {
    restrict: 'E',
    scope: {
      content: '='
    },
    template: '' +
      '<div>' +
        '<div ' +
          'ng-bind-html="htmlEditor.trustAsHtml(content)" ' +
          'class="editor-preview" ' +
          'style="padding: 1rem"' +
        '></div>' +
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

    htmlEditor.trustAsHtml = function (str) {
      return $sce.trustAsHtml(str);
    }
  }

}

})();
