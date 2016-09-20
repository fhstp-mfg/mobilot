angular
  .module('Profile')
  .controller('ProfileController', ProfileController);


ProfileController.$inject = [
  '$log', '$state', '$stateParams',
  '$mdDialog', '$translate',
  'UserService', 'StateManager', 'LanguageService',
  'RallyService', 'MobidulService'
];


function ProfileController (
  $log, $state, $stateParams,
  $mdDialog, $translate,
  UserService, StateManager, LanguageService,
  RallyService, MobidulService
) {
  /// ProfileController
  var profile = this;

  /// constants
  // ...


  /// vars
  profile.isCordovaIos = isCordova && isIos;


  /// functions
  profile.logout               = logout;
  profile.changePassword       = changePassword;
  profile.cancelChangePassword = cancelChangePassword;
  profile.resetRally           = resetRally;
  profile.selectLanguage       = selectLanguage;

  /// construct

  _init();


  /// private functions

  function _init ()
  {
    // $log.debug('ProfileController init');

    _initDefaultValues();
    _checkIsLoggedIn();
  }


  function _initDefaultValues ()
  {
    profile.language = LanguageService.getCurrentLanguage();
    profile.availableLanguages = LanguageService.LANGUAGES;

    profile.currentUser = {
      username : UserService.Session.username
    };

    profile.changePasswordData = {
      oldPassword : '',
      newPassword : ''
    };

    profile.isChangePassword = false;
  }


  function _checkIsLoggedIn ()
  {
    // TODO: what if session expires
    if ( ! UserService.Session.isLoggedIn ) {
      var stateParams = StateManager.state.params;

      $state.go(StateManager.LOGIN, stateParams);
    }
  }


  function _resetChangePasswordData ()
  {
    profile.changePasswordData.oldPassword = '';
    profile.changePasswordData.newPassword = '';
  }


  /// public functions

  function logout ()
  {
    UserService.logout()
    .then(function () {
      $state.go(StateManager.DEFAULT_NAME, StateManager.DEFAULT_PARAMS);
    });
  }


  function changePassword ()
  {
    if (profile.isChangePassword) {
      UserService.changePassword(profile.changePasswordData)
      .then(function (response) {
        // $log.debug('change password callback :');
        // $log.debug(response);

        var changePasswordDialogTitle,
            changePasswordDialogContent,
            changePasswordDialogOk;


        if ( response.data === 'success' ) {
          changePasswordDialogTitle   = $translate.instant('PASSWORD_CHANGED');
          changePasswordDialogContent = $translate.instant('PASSWORD_CHANGED_SUCCESS');
          changePasswordDialogOk      = $translate.instant('CONTINUE');

          cancelChangePassword();
          _resetChangePasswordData();
        }
        else {
          changePasswordDialogTitle = $translate.instant('PASSWORD_CHANGED_ERROR');

          changePasswordDialogContent = '';
          angular.forEach(response.data, function (field, id) {
            var message = field[0];
            changePasswordDialogContent += message + ' ';
          });

          changePasswordDialogOk = $translate.instant('EDIT_CREDENTIALS');
        }


        var changePasswordCompletedDialog =
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title(changePasswordDialogTitle)
          .textContent(changePasswordDialogContent)
          .ariaLabel($translate.instant('CHANGE_PASSWORD_INFORMATION'))
          .ok(changePasswordDialogOk);

        $mdDialog.show(changePasswordCompletedDialog);
      });
    }
    else {
      profile.isChangePassword = true;
    }
  }


  function cancelChangePassword ()
  {
    profile.isChangePassword = false;
  }


  function resetRally ()
  {
    $log.warn('Is this still used?');

    RallyService.reset();

    var resetRallyCompletedDialog =
      $mdDialog.alert()
      .parent(angular.element(document.body))
      .title($translate.instant('RALLY_RESET'))
      .textContent($translate.instant('RALLY_RESET_SUCCESS'))
      .ariaLabel($translate.instant('RALLY_RESET'))
      .ok($translate.instant('CONTINUE'));

    $mdDialog.show(resetRallyCompletedDialog);
  }


  /// events
  function selectLanguage () {
    LanguageService.switchLanguage(profile.language);
  }

}
