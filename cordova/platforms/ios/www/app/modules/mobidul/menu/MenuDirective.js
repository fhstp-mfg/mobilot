angular
	.module('Mobidul')
	.directive('mobidulMenu', MobidulMenu);


function MobidulMenu ()
{
	return {
		restrict    : 'E',
		replace     : true,
		templateUrl : 'app/modules/mobidul/menu/MenuPartial.html',
		controller  : 'MenuController as menu',

		link : function (scope, element, attrs, MenuController)
		{
			MenuController.init();
		}
	}
}
