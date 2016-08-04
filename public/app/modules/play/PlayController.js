angular
  .module('Play')
  .controller('PlayController', PlayController);

PlayController.$inject = [
  '$log', '$rootScope', '$scope', '$translate',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  'PlayService'
];

function PlayController (
  $log, $rootScope, $scope, $translate,
  $state, $stateParams, StateManager,
  $mdDialog,
  PlayService
) {
  /// PlayController
  var play = this;

  /// constrants
  // ...

  /// vars
  play.isCordovaIos = isCordova && isIos;

  play.code;

  /// functions
  play.join = join;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    $log.debug('PlayController init');

    _initDefaultValues();
  }


  function _initDefaultValues ()
  {
    play.code = '';
  }


  /// public functions

  function join ()
  {
    PlayService.play(play.code)
    .success(function (response) {
      // console.warn('join mobidul play callback : ');
      // console.info(response);

      if (response) {
        if (response.success) {
          $state.go('mobidul.map', { mobidulCode : response.code });
        }
        else {
          var msg = $translate.instant('JOIN_CODE_INVALID_EXPLANATION');

          var invalidPlayDialog =
            $mdDialog.alert()
            .parent( angular.element(document.body) )
            .title($translate.instant('JOIN_NOT_POSSIBLE'))
            .textContent(msg)
            .ariaLabel($translate.instant('LOGIN_ERROR'))
            .ok($translate.instant('EDIT_CREDENTIALS'));

          $mdDialog.show(invalidPlayDialog);
        }
      }
    });
  }
}
