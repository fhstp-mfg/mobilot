'use strict';
angular.module('ngWYSIWYG', ['ngSanitize', 'ui.router']);

angular.module('ngWYSIWYG').directive('wframe', ['$compile', '$timeout',
	function($compile, $timeout) {
		//kudos http://stackoverflow.com/questions/13881834/bind-angular-cross-iframes-possible
		var linker = function( scope, $element, attrs, ctrl ) {
			var $document = $element[0].contentDocument;
			$document.open(); //damn Firefox. kudos: http://stackoverflow.com/questions/15036514/why-can-i-not-set-innerhtml-of-an-iframe-body-in-firefox
			$document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
			$document.close();
			$document.designMode = 'On';
			var $body = angular.element($element[0].contentDocument.body);
			var $head = angular.element($element[0].contentDocument.head);
			$body.attr('contenteditable', 'true');
			$body.css('font-family', 'Roboto, Arial, sans-serif');

			/*
			 $element.bind('load', function (event) {
			 console.log('iframe loaded');
			 $document.designMode = 'On';
			 });
			 */

			//model --> view
			ctrl.$render = function() {
				//$body.html(ctrl.$viewValue || ''); //not friendly with jQuery. snap you jQuery
				$body[0].innerHTML = ctrl.$viewValue || '';
			};

			scope.sync = function() {
				scope.$evalAsync(function(scope) {
					ctrl.$setViewValue($body.html());
				});
			};

			//view --> model
			$body.bind('blur keyup change paste', function() {
				scope.$apply(function blurkeyup() {
					ctrl.$setViewValue($body.html());
				});
			});


			scope.range = null;
			scope.getSelection = function() {
				if($document.getSelection) {
					var sel = $document.getSelection();
					if(sel.getRangeAt && sel.rangeCount) {
						scope.range = sel.getRangeAt(0);
					}
				}
			};
			scope.restoreSelection = function() {
				if(scope.range && $document.getSelection) {
					var sel = $document.getSelection();
					sel.removeAllRanges();
					sel.addRange(scope.range);
				}
			};

			scope.$on('execCommand', function(e, cmd) {
				console.log('execCommand: ');
				console.log(cmd);
				$element[0].contentDocument.body.focus();
				//scope.getSelection();
				var sel = $document.selection; //http://stackoverflow.com/questions/11329982/how-refocus-when-insert-image-in-contenteditable-divs-in-ie
				// 	console.log("selection is: " + JSON.stringify(sel));
				if (sel) {
					//in chrome sel will always be null
					var textRange = sel.createRange();
					$document.execCommand(cmd.command, 0, cmd.arg);
					textRange.collapse(false);
					textRange.select();
				}
				else {
					$document.execCommand(cmd.command, 0, cmd.arg);
				}


				//try to change image width and failed...
				//console.log("$body.html(): " + $body.html());
				if ($body.find("img").length>0)
				{
					//update all images' width to 80%
					for (var i=0;i<$body.find("img").length;i++)
					{
						//$body.find("img")[i].addClass("width-max") ;
					}

				}


				//scope.restoreSelection();
				$document.body.focus();
				scope.sync();
			});

			//init
			try {
				$document.execCommand("styleWithCSS", 0, 0);
				$document.execCommand('contentReadOnly', 0, 'false');
			}
			catch(e) {
				try {
					$document.execCommand("useCSS", 0, 1);
				}
				catch(e) {
				}
			}
		};
		return {
			link: linker,
			require: 'ngModel',
			replace: true,
			restrict: 'AE'
		}
	}
]);

// kudos to http://codereview.stackexchange.com/questions/61847/draggable-resizeable-box
angular.module("ngWYSIWYG").directive("ceResize", ['$document', function($document) {
	return function($scope, $element, $attr) {
		//Reference to the original
		var $mouseDown;

		// Function to manage resize up event
		var resizeUp = function($event) {
			var margin = 50,
				lowest = $mouseDown.top + $mouseDown.height - margin,
				top = $event.pageY > lowest ? lowest : $event.pageY,
				height = $mouseDown.top - top + $mouseDown.height;

			$element.css({
				top: top + "px",
				height: height + "px"
			});
		};
		// Function to manage resize down event
		var resizeDown = function($event) {
			var margin = 50,
				uppest = $element[0].offsetTop + margin,
				height = $event.pageY > uppest ? $event.pageY - $element[0].offsetTop : margin;

			$element.css({
				height: height + "px"
			});
		};


		var createResizer = function createResizer( className , handlers ) {
			var newElement = angular.element( '<span class="' + className + '"></span>' );
			$element.append(newElement);
			newElement.on("mousedown", function($event) {

				$document.on("mousemove", mousemove);
				$document.on("mouseup", mouseup);

				//Keep the original event around for up / left resizing
				$mouseDown = $event;
				$mouseDown.top = $element[0].offsetTop;
				$mouseDown.left = $element[0].offsetLeft
				$mouseDown.width = $element[0].offsetWidth;
				$mouseDown.height = $element[0].offsetHeight;

				function mousemove($event) {
					event.preventDefault();
					for( var i = 0 ; i < handlers.length ; i++){
						handlers[i]( $event );
					}
				}

				function mouseup() {
					$document.off("mousemove", mousemove);
					$document.off("mouseup", mouseup);
				}
			});
		};

		createResizer( 'resizer' , [ resizeDown ,  resizeDown ] );
	};
}]);

angular.module('ngWYSIWYG').directive('colorsGrid', ['$compile', '$document',
	function($compile, $document) {
		var linker = function( scope, element, attrs, ctrl ) {
			//click away
			$document.on("click", function() {
				scope.$apply(function() {
					scope.show = false;
				});
			});
			element.parent().bind('click', function(e) {
				e.stopPropagation();
			});
			scope.colors = ['#000000', '#993300', '#333300', '#003300', '#003366', '#000080', '#333399', '#333333', '#800000', '#FF6600', '#808000', '#008000', '#008080', '#0000FF', '#666699', '#808080', '#FF0000', '#FF9900', '#99CC00', '#339966', '#33CCCC', '#3366FF', '#800080', '#999999', '#FF00FF', '#FFCC00', '#FFFF00', '#00FF00', '#00FFFF', '#00CCFF', '#993366', '#C0C0C0', '#FF99CC', '#FFCC99', '#FFFF99', '#CCFFCC', '#CCFFFF', '#99CCFF', '#CC99FF', '#FFFFFF' ];
			scope.pick = function( color ) {
				scope.onPick({color: color});
			};
			element.ready(function() {
				//real deal for IE
				function makeUnselectable(node) {
					if (node.nodeType == 1) {
						node.setAttribute("unselectable", "on");
						node.unselectable = 'on';
					}
					var child = node.firstChild;
					while (child) {
						makeUnselectable(child);
						child = child.nextSibling;
					}
				}
				//IE fix
				for(var i = 0; i < document.getElementsByClassName('colors-grid').length; i += 1) {
					makeUnselectable(document.getElementsByClassName("colors-grid")[i]);
				}
			});
		};
		return {
			link: linker,
			scope: {
				show: '=',
				onPick: '&'
			},
			restrict: 'AE',
			template: '<ul ng-show="show" class="colors-grid"><li ng-style="{\'background-color\': color}" title: "{{color}}" ng-repeat="color in colors" unselectable="on" ng-click="pick(color)"></li></ul>'
		}
	}
]);

angular.module('ngWYSIWYG').directive('symbolsGrid', ['$compile', '$document', '$sce',
	function($compile, $document, $sce) {
		var linker = function( scope, element, attrs, ctrl ) {
			//click away
			$document.on("click", function() {
				scope.$apply(function() {
					scope.show = false;
				});
			});
			element.parent().bind('click', function(e) {
				e.stopPropagation();
			});
			scope.symbols = ['&iexcl;', '&iquest;', '&ndash;', '&mdash;', '&raquo;', '&laquo;', '&copy;', '&divide;', '&micro;', '&para;', '&plusmn;', '&cent;', '&euro;', '&pound;', '&reg;', '&sect;', '&trade;', '&yen;', '&deg;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&uarr;', '&rarr;', '&darr;', '&spades;', '&clubs;', '&hearts;', '&diams;', '&aacute;', '&agrave;', '&acirc;', '&aring;', '&atilde;', '&auml;', '&aelig;', '&ccedil;', '&eacute;', '&egrave;', '&ecirc;', '&euml;', '&iacute;', '&igrave;', '&icirc;', '&iuml;', '&ntilde;', '&oacute;', '&ograve;', '&ocirc;', '&oslash;', '&otilde;', '&ouml;', '&szlig;', '&uacute;', '&ugrave;', '&ucirc;', '&uuml;', '&yuml;'];
			scope.pick = function( symbol ) {
				scope.onPick({symbol: symbol});
			};
			element.ready(function() {
				//real deal for IE
				function makeUnselectable(node) {
					if (node.nodeType == 1) {
						node.setAttribute("unselectable", "on");
						node.unselectable = 'on';
					}
					var child = node.firstChild;
					while (child) {
						makeUnselectable(child);
						child = child.nextSibling;
					}
				}
				//IE fix
				for(var i = 0; i < document.getElementsByClassName('symbols-grid').length; i += 1) {
					makeUnselectable(document.getElementsByClassName("symbols-grid")[i]);
				}
			});
		}
		return {
			link: linker,
			scope: {
				show: '=',
				onPick: '&'
			},
			restrict: 'AE',
			template: '<ul ng-show="show" class="symbols-grid"><li ng-repeat="symbol in symbols" unselectable="on" ng-click="pick(symbol)" ng-bind-html="symbol"></li></ul>'
		}
	}
]);

angular.module('ngWYSIWYG').directive('chooseFileButton', function() {
	return {
		restrict: 'E',
		link: function (scope, elem, attrs) {
			var button = elem.find('button');
			var input = elem.find('input');
			input.css({ display:'none' });
			button.bind('click', function() {
				input[0].click();
			});
		}
	};
});

angular.module('ngWYSIWYG').directive('customOnChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.customOnChange);
			element.bind('change', onChangeHandler);
		}
	};
});

angular.module('ngWYSIWYG').directive('wysiwygEdit', ['$log', '$compile', '$timeout', '$stateParams', '$http', 'PhotoService',
	function($log, $compile, $timeout, $stateParams, $http, PhotoService) {
		var linker = function( scope, $element, attrs, ctrl ) {
			// var $body = angular.element($element[0]);
			scope.editMode = false;
			scope.fonts = ['SimHei', 'Arial', 'Arial Black', 'Arial Narrow', 'Courier New', 'sans-serif'];
			scope.$watch('font', function(newValue) {
				if(newValue) {
					scope.execCommand( 'fontname', newValue );
					scope.font = '';
				}
			});
			scope.fontsizes = [1, 2, 3, 4, 5, 6, 7, 10, 15, 20, 25, 30, 40];
			scope.$watch('fontsize', function(newValue) {
				if(newValue) {
					scope.execCommand( 'fontsize', newValue );
					scope.fontsize = '';
				}
			});

			// scope.styles =
			// [
			//     {name: 'Paragraph', key: '<p>'},
			//     {name: 'Titel', key: '<h1>'},
			//     {name: 'Größe Überschrift', key: '<h2>'},
			//     {name: 'Mittelgroße Überschrift', key: '<h3>'},
			//     {name: 'Untertitel', key: '<h4>'},
			//     // {name: 'H5', key: '<h5>'},
			//     // {name: 'H6', key: '<h6>'}
			// ];

			scope.$watch('textstyle', function(newValue) {
				if(newValue) {
					scope.execCommand( 'formatblock', newValue );
					scope.fontsize = '';
				}
			});
			scope.showFontColors = false;
			scope.setFontColor = function( color ) {
				scope.execCommand('foreColor', color);
			};
			scope.showBgColors = false;
			scope.setBgColor = function( color ) {
				scope.execCommand('hiliteColor', color);
			};

			scope.execCommand = function(cmd, arg) {
				scope.$emit('execCommand', {command: cmd, arg: arg});
			};
			scope.showSpecChars = false;
			scope.insertSpecChar = function(symbol) {
				scope.execCommand('insertHTML', symbol);
			};
			scope.changeTextStyle=function(textstyle)
			{
				scope.execCommand( 'formatblock', textstyle );
				scope.fontsize = '';
			};
			scope.insertLink = function() {
				var val = prompt('Link url: ', 'http://');
				if (!val)
					return;

				scope.execCommand('createlink', val);
			};
			scope.insertImage = function() {
//  		var val = prompt('Image url: ', 'http://');
//			if (!val)
//			  return;
//
//  		scope.execCommand('insertimage', val);

			};

			//scope.file={};

			scope.uploadFile = function(event){
				var file = event.files[0];
				scope.file = file;

				PhotoService.uploadPhoto(file)
					.then(function(photo){
						scope.addedImage(photo.attachment.hash);
					}, function(error){
						$log.error(error);

					});
			};

			scope.addedImage = function (hash)
			{
				var imgSrc = 'image/' + 400 + '/' + hash+'.jpg';
				var x = '<a href="#/' + $stateParams.mobidulCode + '/media/' + hash +'.jpg">' +
					'<img class="picture" '      +
					'src="' + imgSrc + '" ' +
					'width="100%" '         +
					'height="auto" '        +
					'style="max-width : 100%"></a>';
				scope.execCommand('insertHTML', x);
			};

			$element.ready(function() {
				function makeUnselectable(node) {
					if (node.nodeType == 1) {
						node.setAttribute("unselectable", "on");
						node.unselectable = 'on';
					}
					var child = node.firstChild;
					while (child) {
						makeUnselectable(child);
						child = child.nextSibling;
					}
				}
				//IE fix
				for(var i = 0; i < document.getElementsByClassName('tinyeditor-header').length; i += 1) {
					makeUnselectable(document.getElementsByClassName("tinyeditor-header")[i]);
				}
			});

		};

		return {
			link: linker,
			scope: {
				content: '='
			},
			restrict: 'AE',
			replace: true,
			templateUrl: 'temp/ngWYSIWYG/tpl/wysiwyg.tpl'
		}
	}
]);
