angular
  .module('Mobidul')
  .controller('CloneMobidulDialogController', CloneMobidulDialogController);


CloneMobidulDialogController.$inject = [
  '$log', '$scope', '$mdDialog', '$translate',
  'MobidulService', 'CreatorService',
  'UtilityService'
];


function CloneMobidulDialogController (
  $log, $scope, $mdDialog,
  MobidulService, CreatorService,
  UtilityService
) {
  /// CloneMobidulDialogController
  var cloneMobidulDialog = this;

  // constants
  // NOTE: TODO: Code duplication w/ CreatorController
  cloneMobidulDialog._codeHelperGenerating = $translate.instant('CREATING');
  cloneMobidulDialog._codeHelperGenerated  = $translate.instant('AUTOMATICALLY_CREATED');
  cloneMobidulDialog._codeHelperManual     = $translate.instant('MANUALLY_CREATED');

  // vars
  cloneMobidulDialog.canNotSave = false;

  cloneMobidulDialog.mobidul = {
    name: MobidulService.Mobidul.mobidulName,
    code: MobidulService.Mobidul.mobidulCode,
    link: 'www.mobilot.at',

    originalCode: MobidulService.Mobidul.mobidulCode,
    generateCode: false,

    codeHelper: {
      show: false,
      text: '',
    }
  };

  // functions
  cloneMobidulDialog.close        = close;
  cloneMobidulDialog.changeName   = changeName;
  cloneMobidulDialog.changeCode   = changeCode;
  cloneMobidulDialog.cloneMobidul = cloneMobidul;


  /// constructor

  _init();


  /// private functions

  function _init () {
    $log.debug('CloneMobidulDialogController init');
  }


  // NOTE: TODO: Code duplication w/ CreatorController
  function _isOriginalCode (mobidulCode) {
    return mobidulCode === cloneMobidulDialog.mobidul.originalCode;
  }


  // NOTE: TODO: Code duplication w/ CreatorController
  function _refreshCodeHelper (mobidulCode, codeHelperText) {
    var isOriginalCode = _isOriginalCode(mobidulCode);

    if (isOriginalCode) {
      cloneMobidulDialog.mobidul.codeHelper.text = '';
    } else {
      cloneMobidulDialog.mobidul.codeHelper.text = codeHelperText;
    }

    cloneMobidulDialog.mobidul.codeHelper.show = ! isOriginalCode;
  }


  // NOTE: TODO: Code duplication w/ CreatorController
  function _resetCodeHelper () {
    cloneMobidulDialog.mobidul.codeHelper.show = false;
    cloneMobidulDialog.mobidul.codeHelper.text = '';
  }


  // NOTE: TODO: Code duplication w/ CreatorController
  function _restoreOriginalStationCode () {
    cloneMobidulDialog.mobidul.code = cloneMobidulDialog.mobidul.originalCode;

    _resetCodeHelper();
  }


  /// public functions

  function close () {
    $mdDialog.hide();
  }


  function changeName () {
    var mobidulName = cloneMobidulDialog.mobidul.name.trim();
    var mobidulCode = UtilityService.getCodeFromName(mobidulName);

    if (mobidulCode) {
      cloneMobidulDialog.mobidul.codeHelper.text =
        cloneMobidulDialog._codeHelperGenerating;
    }

    if ( ! _isOriginalCode(mobidulCode) ) {
      CreatorService.existsMobidul(mobidulCode)
      .success(function (response, status, headers, config) {
        //$log.debug('existsMobidul success response: ');
        //$log.debug(response);

        // TODO: add exists from the responseobject
        //$log.debug('response.exists: ' + response.exists);

        cloneMobidulDialog.canNotSave = response.exists;
        mobidulCode = response.mobidulCode;

        if (mobidulCode) {
          cloneMobidulDialog.mobidul.code = mobidulCode;

          _refreshCodeHelper(
            mobidulCode,
            cloneMobidulDialog._codeHelperGenerated
          );
        } else {
          cloneMobidulDialog.mobidul.code = '';

          _resetCodeHelper();
        }
      });
    } else {
      _restoreOriginalStationCode();
    }
  }


  function changeCode () {
    $log.debug('CloneMobidulDialog changeCode:')
  }


  function cloneMobidul () {
    var params = {
      oldCode:  MobidulService.Mobidul.mobidulCode,
      name:     cloneMobidulDialog.mobidul.name,
      code:     cloneMobidulDialog.mobidul.code
    };

    MobidulService.cloneMobidul(params)
    .then(function (response, status, headers, config, statusText) {
      cloneMobidulDialog.close();
    });
  }

  // ...
}
