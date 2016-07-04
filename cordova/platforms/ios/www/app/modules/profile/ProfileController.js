angular
  .module('Profile')
  .controller('ProfileController', ProfileController);


ProfileController.$inject = [
  '$log',
  '$state', '$stateParams',
  '$mdDialog',
  'UserService', 'StateManager',
  'RallyService', 'MobidulService'
];


function ProfileController (
  $log,
  $state, $stateParams,
  $mdDialog,
  UserService, StateManager,
  RallyService, MobidulService
)
{
  var profile = this;

  /// constants
  // ...


  /// vars
  MobidulService.getMobidulMode($stateParams.mobidulCode)
    .then(function(mode){
      profile.isRallyMode = (mode == MobidulService.MOBIDUL_MODE_RALLY) && StateManager.comesFrom( StateManager.MOBIDUL );
    });


  /// functions
  profile.logout               = logout;
  profile.changePassword       = changePassword;
  profile.cancelChangePassword = cancelChangePassword;
  profile.resetRally           = resetRally;


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
    // TODO - what if session expires
    if ( ! UserService.Session.isLoggedIn )
    {
      var stateParams = StateManager.state.params;

      $state.go( StateManager.LOGIN, stateParams );
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
    UserService
      .logout()
      .then(function ()
      {
        $state.go( StateManager.DEFAULT_NAME, StateManager.DEFAULT_PARAMS );
      });
  }


  function changePassword ()
  {
    if ( profile.isChangePassword )

      UserService
        .changePassword( profile.changePasswordData )
        .then(function (response)
        {
          // $log.debug('change password callback :');
          // $log.debug(response);

          var changePasswordDialogTitle,
              changePasswordDialogContent,
              changePasswordDialogOk;


          if ( response.data === 'success' )
          {
            changePasswordDialogTitle   = 'Passwort geändert'
            changePasswordDialogContent = 'Passwort wurde erfolgreich geändert.';
            changePasswordDialogOk      = 'Weiter';


            cancelChangePassword();

            _resetChangePasswordData();
          }
          else
          {
            changePasswordDialogTitle = 'Passwort ändern Fehler'

            changePasswordDialogContent = '';
            angular.forEach(response.data, function (field, id)
            {
              var message = field[0];

              changePasswordDialogContent += message + ' ';
            });

            changePasswordDialogOk = 'Daten überarbeiten';
          }


          var changePasswordCompletedDialog =
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .title(changePasswordDialogTitle)
              .textContent(changePasswordDialogContent)
              .ariaLabel('Passwort ändern Informationen')
              .ok( changePasswordDialogOk );

          $mdDialog.show( changePasswordCompletedDialog );
        });

    else
      profile.isChangePassword = true;
  }


  function cancelChangePassword ()
  {
    profile.isChangePassword = false;
  }


  function resetRally ()
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

    $mdDialog.show( resetRallyCompletedDialog );
  }


  /// events
  // ...

}
