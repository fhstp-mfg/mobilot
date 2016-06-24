angular
  .module('Login')
  .controller('LoginController', LoginController);


LoginController.$inject = [
  '$log', '$rootScope', '$timeout',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  'UserService'
];


function LoginController (
  $log, $rootScope, $timeout,
  $state, $stateParams, StateManager,
  $mdDialog,
  UserService
) {
  var login = this;

  // constants
  // ...

  // vars
  login.credentials =
  {
    username : '',
    email    : '',
    password : ''
  };

  login.resetData =
  {
    resetToken      : $stateParams.token,
    newPassword     : '',
    confirmPassword : ''
  }

  login.isHeaderTabsContent = StateManager.isHomeLogin();

  login.disableLoginButton         = false;
  login.disableRegisterButton      = false;
  login.disableResetPasswordButton = false;

  // functions
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
    login.activationMessage = 'Danke für deine Registrierung. Du wirds in Kürze weitergeleitet und kannst loslegen. Viel Spaß!';
  }


  function _checkIsLoggedIn ()
  {
    if ( UserService.Session.isLoggedIn )
    {
      if ( StateManager.isActivate() )
        $timeout(function () {
          $state.go('home');
        }, 4000);
      else
        StateManager.back();
    }
    else
    {
      if ( StateManager.isActivate() )
        $timeout(function () {
          $state.go('home.login');
        }, 4000);
    }
  }


  /// public functions

  function loginUser ()
  {
    $log.debug('loggin user in');
    $log.debug(login.credentials);

    UserService
      .login( login.credentials )
      .then(function (response)
      {
        $log.debug('login callback');
        $log.debug(response);

        if ( response.data === 'wrong' )
        {
          var loginCompletedDialog =
            $mdDialog
              .alert()
              .parent( angular.element(document.body) )
              .title('Anmeldung Fehler')
              .textContent('Der Benutzername oder das Passwort ist falsch.')
              .ariaLabel('Anmeldung Fehler')
              .ok('Daten überarbeiten');

          $mdDialog.show( loginCompletedDialog );
        }

        _checkIsLoggedInOnline( response );
      });
  }

  function registerUser ()
  {
    // $log.debug('register user');

    UserService
      .register(login.credentials)
      .then(function (response)
      {
        // $log.debug('register callback');
        // $log.debug(response);

        var registrationDialogTitle,
          registrationDialogContent,
          registrationDialogOk;

        var result = response.data ? response.data : {};

        switch ( result )
        {
          case 'success' :
            registrationDialogTitle   = 'Registrierung erfolgreich';
            registrationDialogContent = 'Du solltest in Kürze eine Bestätigung per Mail bekommen. ' +
                          'Kontrolliere bitte auch deinen Spam Ordner.';
            registrationDialogOk      = 'Weiter';

            break;

          case 'email-exists' :
            registrationDialogTitle   = 'Ungültige Email Adresse';
            registrationDialogContent = 'Ein Benutzer ist schon mit dieser Email Adresse registriert.';
            registrationDialogOk      = 'Email ändern';

            break;

          case 'username-exists' :
            registrationDialogTitle   = 'Ungültiger Benutzername';
            registrationDialogContent = 'Dieser Benutzername ist schon vergeben.';
            registrationDialogOk      = 'Benutzername ändern';

            break;

          case 'error'   :
            registrationDialogTitle   = 'Registrierung Fehler';
            registrationDialogContent = 'Das Registrieren hat leider nicht geklappt. Bitte probiere es nochmal.';
            registrationDialogOk      = 'OK';

            break;
        }


        var registrationCompletedDialog =
          $mdDialog
            .alert()
            .parent(angular.element(document.body))
            .title(registrationDialogTitle)
            .textContent(registrationDialogContent)
            .ariaLabel('Registrierung Informationen')
            .ok(registrationDialogOk);

        $mdDialog.show( registrationCompletedDialog );



        if ( result === 'success' )

          _checkIsLoggedInOnline( response );

      });
  }


  function requestRestore ()
  {
    UserService
      .requestRestore( login.credentials.email )
      .then(function (response)
      {
        // $log.debug('request restore callback');
        // $log.debug(response);

        var emailMessage,
          requestRestoreDialogTitle,
          requestRestoreDialogAriaLabel,
          requestRestoreDialogOk;


        if ( response.data !== 'success' )
        {
          if ( response.data.email )
          {
            var emailMessage = response.data.email[ 0 ];

            requestRestoreDialogTitle     = 'Passwort zurücksetzten Fehler';
            requestRestoreDialogAriaLabel = 'Passwort zurücksetzten Fehler';
            requestRestoreDialogOk         = 'Email überarbeiten';
          }
        }
        else
        {
          emailMessage = 'Du solltest in Kürze einen Wiederherstellungslink per Mail bekommen. ' +
                   'Kontrolliere bitte auch deinen Spam Ordner.';

          requestRestoreDialogTitle     = 'Passwort zurücksetzten';
          requestRestoreDialogAriaLabel = 'Passwort zurücksetzten';
          requestRestoreDialogOk      = 'Weiter';
        }


        var requestRestoreCompletedDialog =
          $mdDialog
            .alert()
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

    var postData =
    {
      resetToken      : login.resetData.resetToken,
      newPassword     : login.resetData.newPassword,
      confirmPassword : login.resetData.confirmPassword
    };


    UserService
      .changePassword( postData )
      .then(function (response)
      {
        // $log.debug('Reset, change password callback');
        // $log.debug(response);

        var resetPasswordDialogTitle,
          resetPasswordDialogAriaLabel,
          resetPasswordDialogContent,
          resetPasswordDialogOk;


        if ( response.data === 'success' )
        {
          resetPasswordDialogTitle   = 'Passwort zurückgesetzt';
          resetPasswordDialogAriaLabel = 'Passwort zurückgesetzt';
          resetPasswordDialogContent   = 'Das Passwort wurde erfolgreich geändert und du wurdest automatisch eingeloggt.';
          resetPasswordDialogOk      = 'Weiter';


          var currentStateParams = StateManager.getParams();
          var mobidulCode = currentStateParams.mobidulCode;

          UserService
            .restoreUser( mobidulCode )
            .then(function (response)
            {
              $state.go('home');
            });
        }
        else
        {
          resetPasswordDialogTitle     = 'Passwort zurücksetzten Fehler';
          resetPasswordDialogAriaLabel = 'Passwort zurücksetzten Fehler';

          resetPasswordDialogContent = '';
          angular.forEach( response.data, function (field, id)
          {
            var message = field[ 0 ];

            resetPasswordDialogContent += message + ' ';
          });

          resetPasswordDialogOk = 'Daten überarbeiten';
        }


        var resetPasswordCompletedDialog =
          $mdDialog
            .alert()
            .parent(angular.element(document.body))
            .title(resetPasswordDialogTitle)
            .textContent(resetPasswordDialogContent)
            .ariaLabel( resetPasswordDialogAriaLabel )
            .ok( resetPasswordDialogOk );

        $mdDialog.show( resetPasswordCompletedDialog );
      })
  }


  function _checkIsLoggedInOnline (response)
  {
    if ( response.data &&
       response.data === 'success' )

      UserService
        .isLoggedIn()
        .then(function (response)
        {
          $log.debug('is logged in callback');
          $log.debug(response);

          if ( response.data &&
             response.data === 'true' )

            StateManager.redirectLogin();
        });
  }


  function goToLogin ()
  {
    var state = StateManager.comesFrom( StateManager.HOME_LOGIN )
                  ? StateManager.HOME_LOGIN
                  : StateManager.LOGIN;

    $state.go(state);
  }


  function goToRegister ()
  {
    $state.go('register');
  }


  function goToForgotPassword ()
  {
    $state.go('restore');
  }


  /// events

  // ...

}
