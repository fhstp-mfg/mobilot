(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('editorhtmlcontainer', HtmlEditor);

  HtmlEditor.$inject = [
    '$log'
  ];

  function HtmlEditor(
    $log
  ){

    return {
      restrict: 'E',
      scope:{
        content: '='
      },
      template: '<div><wysiwyg-edit ' +
      'content="content"' +
      'api="ctrl.api">' +
      '</wysiwyg-edit></div>',
      link: function($scope, $element, $attrs, ctrl){
        
      },
      controller: HtmlEditorController,
      controllerAs: 'ctrl'
    };

    function HtmlEditorController($scope, $element, $attrs){



    }

  }

})();