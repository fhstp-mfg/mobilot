angular
  .module('Mobidul')
  .controller('MenuController', MenuController);


MenuController.$inject = [
  '$log', '$scope', '$rootScope', '$timeout', '$translate',
  '$state', '$stateParams', '$mdSidenav', '$mdDialog',
  'MobidulService', 'UserService', 'RallyService', 'FontService', 'StateManager'
];


function MenuController (
  $log, $scope, $rootScope, $timeout, $translate,
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
  menu.isCordovaIos = isCordova && isIos;

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
  menu.openFeedbackDialog     = openFeedbackDialog;
  menu.openPDF                = openPDF;


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

    if ( ! menu.isGoToHomeEnabled && ! menu.isGoToAboutEnabled ) {
      menu.isLastDividerEnabled = false;
    }

    MobidulService.getMobidulMode(StateManager.state.params.mobidulCode)
      .then(function (mode) {
        menu.isRallyMode = mode == MobidulService.MOBIDUL_MODE_RALLY;
      });

    // $log.info('MenuController - _initDefaultValues - menu.isRallyMode');
    // $log.debug(menu.isRallyMode);

    // TODO: Implement Promise
    var currentUser = UserService.Session;
    menu.currentUser = currentUser;

    var isLoggedIn = currentUser.isLoggedIn;
    if (isLoggedIn) {
      menu.isLoggedIn = isLoggedIn;
      menu.accountItemText = menu._logoutAccountText;

      menu.profile.flex = menu._profileFlexThird;
    } else {
      menu.profile.flex = menu._profileFlexFull;
    }
  }


  function _listenToConfig ()
  {
    var configListener =
      $rootScope.$on('rootScope:setConfig', function (event, config) {
        // $log.debug('Heard "rootScope:setConfig" in MenuController');
        // $log.debug(config);

        var colorElements = document.querySelectorAll('.menu-login, .menuDivider');
        for (var c = 0; c < colorElements.length; c++) {
          colorElements[c].style.background = config.background;
          colorElements[c].style.color = config.foreground;
        }

        menu.myFont = FontService.getFontClass(config.font);
      });

     $scope.$on('$destroy', configListener);
  }


  /// public functions

  /**
   * Performs login / logout action
   */
  function loginLogoutButtonClick ()
  {
    if ( menu.accountItemText == menu._loginAccountText ) {
      $state.go('login');
    } else {
      UserService
        .logout()
        .then(function (response) {
          $log.debug('menu logout callback');
          $log.debug(response);

          var closeSidenavOnLogout = true;

          if ( response.data
            && response.data === 'success'
            && closeSidenavOnLogout
          ) {
            $mdSidenav('menu')
              .close()
              .then(function () {
                menu.isLoggedIn           = false;
                menu.profile.flex         = menu._profileFlexFull;
                menu.accountItemText      = menu._loginAccountText;
                menu.currentUser.username = UserService._guestName;
              });
          } else {
            menu.isLoggedIn           = false;
            menu.profile.flex         = menu._profileFlexThird;
            menu.accountItemText      = menu._loginAccountText;
            menu.currentUser.username = UserService._guestName;
          }
        });
      }
  }


  function resetRally ()
  {
    var resetRallyConfirmDialog =
      $mdDialog.confirm()
      .parent( angular.element(document.body) )
      .title($translate.instant('RESET_RALLY'))
      .textContent($translate.instant('RESET_RALLY_CONFIRMATION'))
      .ariaLabel($translate.instant('RESET_RALLY'))
      .ok($translate.instant('RESET'))
      .cancel($translate.instant('CANCEL'));

    $mdDialog.show( resetRallyConfirmDialog )
      .then(function ()
      {
        RallyService.reset();

        var resetRallyCompletedDialog =
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title($translate.instant('RALLY_RESET'))
            .textContent($translate.instant('RALLY_RESET_SUCCESS'))
            .ariaLabel($translate.instant('RALLY_RESET'))
            .ok($translate.instant('OK'));

        $mdDialog.show(resetRallyCompletedDialog)
          .then(function () {
            $state.go($state.current, $stateParams, { reload: true });
          });
      });
  }


  function openFeedbackDialog() {
    var FEEDBACK_TITLE = $translate.instant('FEEDBACK_TITLE');
    var FEEDBACK_TEXT = $translate.instant('FEEDBACK_TEXT');
    var FEEDBACK_PLACEHOLDER = $translate.instant('FEEDBACK_PLACEHOLDER');

    var feedbackDialog = $mdDialog.prompt()
      .title(FEEDBACK_TITLE)
      .textContent(FEEDBACK_TEXT)
      .placeholder(FEEDBACK_PLACEHOLDER)
      .ariaLabel(FEEDBACK_TITLE)
      // .initialValue(FEEDBACK_PLACEHOLDER)
      // .targetEvent(event)
      .ok($translate.instant('SEND'))
      .cancel($translate.instant('CANCEL'));

      $mdDialog.show(feedbackDialog)
        .then(function(message) {
          UserService.sendFeedback(message)
            .then(function(response) {
              if (response.data === 'ok') {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(FEEDBACK_TITLE)
                    .textContent($translate.instant('FEEDBACK_SUCCESS_MSG'))
                    .ariaLabel(FEEDBACK_TITLE)
                    .ok($translate.instant('CLOSE'))
                );
              } else {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(FEEDBACK_TITLE)
                    .textContent($translate.instant('FEEDBACK_ERROR_MSG'))
                    .ariaLabel(FEEDBACK_TITLE)
                    .ok($translate.instant('TRY_AGAIN'))
                )
                .then(function() {
                  openFeedbackDialog();
                });
              }
            });
        }, function() {
          // console.debug('cancel');
      });
  }

  function openPDF()
  {
    if(isCordova){
      if(isIos){
        var ref = cordova.InAppBrowser.open('assets/doc/UserDoku_v1_20170127.pdf', '_blank', 'location=yes');
      }else{
        window.open('https://www.mobilot.at/assets/doc/UserDoku_v1_20170127.pdf', '_system', 'location=yes');
      }
    }else
    {
      location.href='assets/doc/UserDoku_v1_20170127.pdf';
    }
  }

  /// events

  function goToProfile ()
  {
    $state.go('profile');
  }

}
