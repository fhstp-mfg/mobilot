angular
  .module('Mobidul')
  .controller('MenuController', MenuController);


MenuController.$inject = [
  '$log', '$scope', '$rootScope', '$timeout',
  '$state', '$stateParams', '$mdSidenav', '$mdDialog',
  'MobidulService', 'UserService', 'RallyService', 'FontService', 'StateManager'
];


function MenuController (
  $log, $scope, $rootScope, $timeout,
  $state, $stateParams, $mdSidenav, $mdDialog,
  MobidulService, UserService, RallyService, FontService, StateManager
) {
  var menu = this;

  /// constants
  menu._loginAccountText  = 'Anmelden';
  menu._logoutAccountText = 'Abmelden';

  menu._profileFlexThird  = '60';
  menu._profileFlexFull   = '';


  /// vars
  menu.isCordovaIOS = isCordova && isIOS;

  menu.profile = {};

  menu.isGoToHomeEnabled     = MobidulService.Config.isGoToHomeEnabled;
  menu.isGoToAboutEnabled    = MobidulService.Config.isGoToAboutEnabled;
  menu.isCloneMobidulEnabled = MobidulService.Config.isCloneMobidulEnabled;
  menu.isLastDividerEnabled  = true;

  menu.isLoggedIn      = false;
  menu.accountItemText = menu._loginAccountText;

  menu.myFont = '';


  /// functions
  menu.init = init;

  /// events
  menu.goToProfile            = goToProfile;
  menu.loginLogoutButtonClick = loginLogoutButtonClick;
  menu.resetRally             = resetRally;


  /// construct

  // init();


  function init ()
  {
    $log.debug('MenuController init');
    // $log.debug(MobidulService.Config);
    // $log.debug(MobidulService.Mobidul);

    _initDefaultValues();

    _listenToConfig();

    MobidulService.menuReady();
  }


  /// private functions

  function _initDefaultValues ()
  {
    menu.config = MobidulService.Mobidul;


    if ( ! menu.isGoToHomeEnabled && ! menu.isGoToAboutEnabled )
      menu.isLastDividerEnabled = false;

    MobidulService.getMobidulMode(StateManager.state.params.mobidulCode)
      .then(function(mode){
        menu.isRallyMode = (mode == MobidulService.MOBIDUL_MODE_RALLY);
      });

    //$log.info('MenuController - _initDefaultValues - menu.isRallyMode');
    //$log.debug(menu.isRallyMode);

    // TODO: Implement Promise
    var  currentUser = UserService.Session;
    menu.currentUser = currentUser;

    var isLoggedIn   = currentUser.isLoggedIn;


    if ( isLoggedIn )
    {
      menu.isLoggedIn      = isLoggedIn;
      menu.accountItemText = menu._logoutAccountText;

      menu.profile.flex    = menu._profileFlexThird;
    }
    else
      menu.profile.flex    = menu._profileFlexFull;
  }


  function _listenToConfig ()
  {
    var configListener =
      $rootScope.$on('rootScope:setConfig', function (event, config)
      {
        $log.debug('Heard "rootScope:setConfig" in MenuController');
        $log.debug(config);

        menu.config.background = MobidulService.Mobidul.background + ' !important';
        menu.config.foreground = MobidulService.Mobidul.foreground + ' !important';

        menu.myFont = FontService.getFontClass( MobidulService.Mobidul.font );
      });

    $scope.$on('$destroy', configListener);
  }


  /// public functions

  /**
   * Performs login / logout action
   */
  function loginLogoutButtonClick ()
  {
    if ( menu.accountItemText == menu._loginAccountText )

      $state.go('login');

    else
      UserService
        .logout()
        .then(function (response)
        {
          $log.debug('menu logout callback');
          $log.debug(response);

          var closeSidenavOnLogout = true;


          if ( response.data &&
               response.data === 'success' &&
               closeSidenavOnLogout
          ) {
            $mdSidenav('menu')
              .close()
              .then(function ()
              {
                menu.isLoggedIn           = false;
                menu.profile.flex         = menu._profileFlexFull;
                menu.accountItemText      = menu._loginAccountText;
                menu.currentUser.username = UserService._guestName;
              });
          }
          else
          {
            menu.isLoggedIn           = false;
            menu.profile.flex         = menu._profileFlexThird;
            menu.accountItemText      = menu._loginAccountText;
            menu.currentUser.username = UserService._guestName;
          }
        });
  }


  function resetRally ()
  {
    var resetRallyConfirmDialog =
      $mdDialog.confirm()
      .parent( angular.element(document.body) )
      .title('Rally zurücksetzten')
      .textContent('Bitte bestätige, dass du deinen Rally Fortschritt zurücksetzen möchtest.')
      .ariaLabel('Rally zurücksetzten')
      .ok('Zurücksetzten')
      .cancel('Abbrechen');

    $mdDialog
      .show( resetRallyConfirmDialog )
      .then(function ()
      {
        RallyService.reset();

        var resetRallyCompletedDialog =
          $mdDialog
            .alert()
            .parent(angular.element(document.body))
            .title('Rally zurückgesetzt')
            .textContent('Dein Rally Fortschitt wurde zurückgesetzt.')
            .ariaLabel('Rally zurückgesetzt')
            .ok('Weiter');

        $mdDialog
          .show( resetRallyCompletedDialog )
          .then(function ()
          {
            $state.go($state.current, $stateParams, { reload: true });
          });
      });
  }


  /// events

  function goToProfile ()
  {
    $state.go('profile');
  }

}
