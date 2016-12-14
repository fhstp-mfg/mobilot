angular
  .module('Login')
  .controller('LoginController', LoginController);

LoginController.$inject = [
  '$log', '$rootScope', '$timeout', '$translate',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  'UserService'
];

function LoginController (
  $log, $rootScope, $timeout, $translate,
  $state, $stateParams, StateManager,
  $mdDialog,
  UserService
) {
  /// LoginController
  var login = this;

  /// constants
  // ...

  /// vars
  login.isCordovaIos = isCordova && isIos;

  login.credentials = {
    username : '',
    email    : '',
    password : ''
  };

  login.resetData = {
    resetToken      : $stateParams.token,
    newPassword     : '',
    confirmPassword : ''
  };

  login.isHeaderTabsContent = StateManager.isHomeLogin();

  login.disableLoginButton         = false;
  login.disableRegisterButton      = false;
  login.disableResetPasswordButton = false;

  /// functions
  login.loginUser          = loginUser;
  login.registerUser       = registerUser;
  login.requestRestore     = requestRestore;
  login.resetPassword      = resetPassword;

  login.goToLogin          = goToLogin;
  login.goToRegister       = goToRegister;
  login.goToForgotPassword = goToForgotPassword;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    // $log.debug('LoginController init');

    _initDefaultValues();

    _checkIsLoggedIn();
  }


  function _initDefaultValues ()
  {
    // login.activationMessage = 'Dieser Aktivierungscode ist ungültig!';
    login.activationMessage = $translate.instant('ACTIVATION_MSG');
  }


  function _checkIsLoggedIn ()
  {
    if ( UserService.Session.isLoggedIn ) {
      if ( StateManager.isActivate() ) {
        // TODO: Find a better solution for the following !!!
        $timeout(function () {
          $state.go('home');
        }, 4000);
      } else {
        StateManager.back();
      }
    } else {
      if (StateManager.isActivate()) {
        // TODO: Find a better solution for the following !!!
        $timeout(function () {
          $state.go('home.login');
        }, 4000);
      }
    }
  }


  /// public functions

  function loginUser ()
  {
    $log.debug('loggin user in');
    $log.debug(login.credentials);

    UserService.login(login.credentials)
      .then(function (response) {
        $log.debug('login callback');
        $log.debug(response);

        if (response.data === 'wrong') {
          var loginCompletedDialog =
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('LOGIN_ERROR'))
              .textContent($translate.instant('CREDENTIALS_WRONG'))
              .ariaLabel($translate.instant('LOGIN_ERROR'))
              .ok($translate.instant('EDIT_CREDENTIALS'));

          $mdDialog.show(loginCompletedDialog);
        }

        _checkIsLoggedInOnline(response);
      });
  }


  function registerUser ()
  {
    // $log.debug('register user');

    UserService.register(login.credentials)
    .then(function (response) {
      // $log.debug('register callback');
      // $log.debug(response);

      var registrationDialogTitle,
          registrationDialogContent,
          registrationDialogOk;

      var result = response.data ? response.data : {};

      switch (result) {
        case 'success' :
          registrationDialogTitle   = $translate.instant('REGISTRATION_SUCCESSFUL');
          registrationDialogContent = $translate.instant('CONFIRM_MAIL_SENT_CHECK_SPAM');
          registrationDialogOk      = $translate.instant('CONTINUE');
          break;

        case 'email-exists' :
          registrationDialogTitle   = $translate.instant('INVALID_EMAIL');
          registrationDialogContent = $translate.instant('EMAIL_ALREADY_TAKEN');
          registrationDialogOk      = $translate.instant('CHANGE_EMAIL');
          break;

        case 'username-exists' :
          registrationDialogTitle   = $translate.instant('INVALID_USERNAME');
          registrationDialogContent = $translate.instant('USERNAME_ALREADY_TAKEN');
          registrationDialogOk      = $translate.instant('CHANGE_USERNAME');
          break;

        case 'error'   :
          registrationDialogTitle   = $translate.instant('REGISTRATION_ERROR');
          registrationDialogContent = $translate.instant('REGISTRATION_ERROR_TRY_AGAIN');
          registrationDialogOk      = $translate.instant('OK');
          break;
      }


      var registrationCompletedDialog =
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .title(registrationDialogTitle)
        .textContent(registrationDialogContent)
        .ariaLabel($translate.instant('REGISTRATION_INFORMATION'))
        .ok(registrationDialogOk);

      $mdDialog.show( registrationCompletedDialog );



      if (result === 'success') {
        _checkIsLoggedInOnline(response);
      }
    });
  }


  function requestRestore ()
  {
    UserService.requestRestore(login.credentials.email)
    .then(function (response) {
      // $log.debug('request restore callback');
      // $log.debug(response);

      var emailMessage,
          requestRestoreDialogTitle,
          requestRestoreDialogAriaLabel,
          requestRestoreDialogOk;


      if (response.data !== 'success') {
        if (response.data.email) {
          emailMessage = response.data.email[0];

          requestRestoreDialogTitle     = $translate.instant('RESET_PASSWORD_ERROR');
          requestRestoreDialogAriaLabel = $translate.instant('RESET_PASSWORD_ERROR');
          requestRestoreDialogOk        = $translate.instant('CHANGE_EMAIL');
        }
      } else {
        emailMessage = $translate.instant('RESET_PASSWORD_EMAIL');

        requestRestoreDialogTitle     = $translate.instant('RESET_PASSWORD_ERROR');
        requestRestoreDialogAriaLabel = $translate.instant('RESET_PASSWORD_EMAIL');
        requestRestoreDialogOk        = $translate.instant('CONTINUE');
      }


      var requestRestoreCompletedDialog =
        $mdDialog.alert()
        .parent( angular.element(document.body) )
        .title(requestRestoreDialogTitle)
        .textContent(emailMessage)
        .ariaLabel(requestRestoreDialogAriaLabel)
        .ok(requestRestoreDialogOk);

      $mdDialog.show( requestRestoreCompletedDialog );
    });
  }


  function resetPassword ()
  {
    // $log.debug('resetting password');

    var postData = {
      resetToken      : login.resetData.resetToken,
      newPassword     : login.resetData.newPassword,
      confirmPassword : login.resetData.confirmPassword
    };

    UserService.changePassword(postData)
    .then(function (response) {
      // $log.debug('Reset, change password callback');
      // $log.debug(response);

      var resetPasswordDialogTitle,
        resetPasswordDialogAriaLabel,
        resetPasswordDialogContent,
        resetPasswordDialogOk;

      if (response.data === 'success') {
        resetPasswordDialogTitle     = $translate.instant('PASSWORD_RESET');
        resetPasswordDialogAriaLabel = $translate.instant('PASSWORD_RESET');
        resetPasswordDialogContent   = $translate.instant('RESET_PASSWORD_SUCCESS');
        resetPasswordDialogOk        = $translate.instant('CONTINUE');


        var currentStateParams = StateManager.getParams();
        var mobidulCode = currentStateParams.mobidulCode;

        UserService.restoreUser(mobidulCode)
        .then(function (response) {
          $state.go('home');
        });
      } else {
        resetPasswordDialogTitle     = $translate.instant('RESET_PASSWORD_ERROR');
        resetPasswordDialogAriaLabel = $translate.instant('RESET_PASSWORD_ERROR');

        resetPasswordDialogContent = '';
        angular.forEach(response.data, function (field, id) {
          var message = field[0];
          resetPasswordDialogContent += message + ' ';
        });

        resetPasswordDialogOk = $translate.instant('EDIT_CREDENTIALS');
      }


      var resetPasswordCompletedDialog =
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .title(resetPasswordDialogTitle)
        .textContent(resetPasswordDialogContent)
        .ariaLabel(resetPasswordDialogAriaLabel)
        .ok(resetPasswordDialogOk);

      $mdDialog.show(resetPasswordCompletedDialog);
    });
  }


  function _checkIsLoggedInOnline (response)
  {
    if (response.data && response.data === 'success') {
      UserService.isLoggedIn()
        .then(function (response) {
          $log.debug('is logged in callback');
          $log.debug(response);

          if (response.data && response.data === 'true') {
            StateManager.redirectLogin();
          }
        });
    }
  }


  function goToLogin ()
  {
    var state = StateManager.comesFrom(StateManager.HOME_LOGIN)
      ? StateManager.HOME_LOGIN
      : StateManager.LOGIN;

    $state.go(state);
  }


  function goToRegister () {
    $state.go('register');
  }


  function goToForgotPassword () {
    $state.go('restore');
  }


  /// events

  // ...
}
