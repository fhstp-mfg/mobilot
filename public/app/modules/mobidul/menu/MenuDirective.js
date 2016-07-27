angular
  .module('Mobidul')
  .directive('mobidulMenu', MobidulMenu);


MobidulMenu.$inject = [];


function MobidulMenu () {
  return {
    restrict    : 'E',
    replace     : true,
    templateUrl : 'app/modules/mobidul/menu/MenuPartial.html',
    controller  : MenuController,
    controllerAs: 'menu',

    link: function (scope, element, attrs, MenuController) {
      MenuController.init();
    }
  }
}
