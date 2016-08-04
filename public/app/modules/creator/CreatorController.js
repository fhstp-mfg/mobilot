angular
.module('Creator')
.controller('CreatorController', CreatorController);

CreatorController.$inject = [
  '$log', '$rootScope', '$scope', '$timeout', '$q',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog', '$mdToast', '$animate', '$translate',
  'UtilityService', 'HeaderService', 'CreatorService',
  'ListService', 'MobidulService'
];


function CreatorController (
  $log, $rootScope, $scope, $timeout, $q,
  $state, $stateParams, StateManager,
  $mdDialog, $mdToast, $animate, $translate,
  UtilityService, HeaderService, CreatorService,
  ListService, MobidulService
) {
  /// CreatorController
  var creator = this;


  /// constants
  // NOTE: TODO: Code duplication w/ CloneMobidulDialogController
  creator._codeHelperGenerating = $translate.instant('CREATING');
  creator._codeHelperGenerated  = $translate.instant('AUTOMATICALLY_CREATED');
  creator._codeHelperManual     = $translate.instant('MANUALLY_CREATED');


  /// vars
  creator.isCordovaIos = isCordova && isIos;

  creator.categories = [
    { name : $translate.instant('NEW_CATEGORY'), isNewCategory : true }
  ];

  creator.editMode = 0;
  // creator.editModes = [
  //   'Jeder darf alle Stationen editieren',
  //   'Jeder darf nur eigene Stationen editieren',
  //   'Gruppen dürfen nur eigene Stationen editieren'
  // ];
  creator.editModes = [
    'Alle',
    'Eigene',
    'Gruppen'
  ];

  creator.tabs = [
    { name : 'Basis' },
    { name : 'Kategorien' },
    { name : 'Menü' },
    { name : 'Optionen' }
  ];

  creator.mobidulTabIndex = (
    StateManager.state.helpers.tabIndex ||
    CreatorService.BASIS_TAB_INDEX
  );

  // TODO: remove this and use StateManager params to check if it is new mobidul .
  creator.isNewMobidul    = true;
  creator.showCreatorTabs = false;

  creator.menuDialog  = {
    selectedIndex: 0
  };
  creator.menu     = [];
  creator.stations = [];
  creator.codes    = [];

  var nameRegex = /^[A-Za-zÄÖÜäöüß0-9 ]{1,32}$/;

  /// for basic tab
  creator.mobidul = {
    name         : '',
    link         : 'www.mobilot.at',
    description  : '',

    originalCode : '',
    generateCode : false,
    mode         : 'default',
    codeHelper   : {
      show : false,
      text : '',
    },

    // mobidul optionen
    isHiddenOnHome : false,
    isLocked       : false,
    font           : undefined, // CreatorService.DEFAULT_FONT
  };

  // font css conditional classes
  creator.class = {
    druckschrift95: creator.mobidul.font === 'druckschrift95'
  };


  /// functions
  creator.changeName       = changeName;
  creator.changeCode       = changeCode;
  creator.saveBasis        = saveBasis;
  creator.saveOptions      = saveOptions;
  creator.showToast        = showToast;
  creator.deleteCategory   = deleteCategory;
  creator.deleteMenuItem   = deleteMenuItem;
  creator.addCategory      = addCategory;
  creator.focusCategory    = focusCategory;
  creator.blurCategory     = blurCategory;
  creator.saveCategories   = saveCategories;
  creator.showAddMenuItem  = showAddMenuItem;
  creator.saveMenu         = saveMenu;
  creator.addMenuItem      = addMenuItem;
  // TODO: which dialog ? use more explicit name !
  creator.closeDialog      = closeDialog;
  creator.changeDetailTab  = changeDetailTab;
  creator.deleteCode       = deleteCode;
  creator.toggleCode       = toggleCode;
  creator.requestCode      = requestCode;
  creator.showQRCode       = showQRCode;
  creator.deleteMobidul    = deleteMobidul;


  var lastCommitedCode = '';


  /// construct

  _init();


  /// private functions

  function _init () {
    //$log.debug('CreatorController init');

    _initDefaultValues();

    _listenToMobidulCode();


    var mobidulCode = StateManager.state.params.mobidulCode;

    if (mobidulCode) {
      if ( ! creator.isNewMobidul ) {
        // enable save button for existing mobiduls
        creator.canNotSave = false;
        creator.showCreatorTabs = true;

        // get categories for mobidul
        getCategoriesFromServer();


        // get options for mobidul
        CreatorService.getOptions( mobidulCode )
        .success(function (response, status, headers, config) {
          // $log.debug('getOptions success in CreatorController');

          var mobidulPrivate = response.private;
          var mobidulLocked  = response.locked;

          creator.mobidul.id             = response.id;
          creator.mobidul.name           = response.name;
          creator.mobidul.originalCode   = response.code;
          creator.mobidul.isHiddenOnHome = ! isNaN(mobidulPrivate) ? mobidulPrivate : 0;
          creator.mobidul.isLocked       = ! isNaN(mobidulLocked) ? mobidulLocked : 0;
          creator.mobidul.font           = response.font;
          creator.editMode               = response.editMode;
        });


        // get menu for mobidul TODO dafür gibts noch kein ws, aber man kanns über getConfig machen.

        CreatorService.getConfig( mobidulCode )
        .success(function (response, status, headers, config) {
          // $log.debug('getConfig success in CreatorController');

          creator.mobidul.description = response.mobidulDescription;
          creator.menu                = response.customNav.navigation;
        });


        // get stations
        ListService.getStations( mobidulCode, 'all')
        .then(function(response){

          var hasPermission = response.hasPermission,
            stations = response.stations;

          if (hasPermission){
            //console.info('creator - stations:');
            //console.log(stations);

            creator.stations = stations;
          } else {
            $log.warn('inside creator withour having permission to view all stations!');
          }
        });

        //get Codes
        getPlayCodes();
      } else {
        //$log.debug('NEW MOBIDUL in CreatorController _initDefaultValues');

        creator.modes = MobidulService.getModes();
        //$log.info('creator.modes:');
        //$log.debug(creator.modes);
      }

      // NOTE hide the app loader
      $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
    }
  }


  function getCategoriesFromServer () {
    var mobidulCode = StateManager.state.params.mobidulCode;

    CreatorService.getCategories( mobidulCode )
    .success(function (categories, status, headers, config) {
      // $log.debug('getCategories success in CreatorController');

      var newCategories = [];
      angular.forEach( categories, function (category, cIx) {
        category.origName      = category.name;
        category.isNewCategory = false;

        newCategories.push(category);
      });

      creator.categories = newCategories;
    });
  }


  function _initDefaultValues () {
    var mobidulCode = StateManager.state.params.mobidulCode;

    if (mobidulCode) {
      var isNewMobidul = mobidulCode === StateManager.NEW_MOBIDUL_CODE;

      creator.isNewMobidul = isNewMobidul;
      creator.mobidul.code = isNewMobidul ? '' : mobidulCode;

      creator.savingBasisMode = false;
      creator.canNotSave      = isNewMobidul; // TODO - check if this is right
      creator.saveBasisText   =
        creator.isNewMobidul
          ? CreatorService.CREATE_MOBIDUL
          : CreatorService.UPDATE_MOBIDUL;
    }
  }


  function _listenToMobidulCode () {
    $scope.$watch('creator.mobidul.code', function (newCode, oldCode)
    {
      creator.mobidul.codePreview =
        newCode ? newCode : CreatorService.MOBIDUL_CODE_EXAMPLE;
    });
  }


  function changeDetailTab () {
    // $log.debug('changeDetailTab in CreatorController : ');

    var editRoute = 'mobidul.creator.';

    switch ( creator.mobidulTabIndex )
    {
      case CreatorService.BASIS_TAB_INDEX :
        editRoute += 'basis';
        break;

      case CreatorService.CATEGORIES_TAB_INDEX :
        editRoute += 'categories';
        break;

      case CreatorService.MENU_TAB_INDEX :
        editRoute += 'menu';
        getCategoriesFromServer();
        break;

      case CreatorService.SETTINGS_TAB_INDEX :
        editRoute += 'settings';
        break;
    }

    // $log.debug('goto route : ' + editRoute);

    var currentStateParams = StateManager.state.params || {};

    $state.go( editRoute, currentStateParams );
  }


  function showToast (message) {
    $mdToast.show(
      $mdToast.simple()
      .textContent(message)
      .position({
        bottom: true,
        top: false,
        left: true,
        right: false
      })
      .hideDelay(3000)
    );
  }


  // NOTE: TODO: Code duplication w/ CloneMobidulDialogController
  function _isOriginalCode (mobidulCode) {
    return mobidulCode === creator.mobidul.originalCode;
  }


  // NOTE: TODO: Code duplication w/ CloneMobidulDialogController
  function _restoreOriginalStationCode () {
    creator.mobidul.code = creator.mobidul.originalCode;

    _resetCodeHelper();
  }


  // NOTE: TODO: Code duplication w/ CloneMobidulDialogController
  function _refreshCodeHelper (mobidulCode, codeHelperText) {
    var isOriginalCode = _isOriginalCode(mobidulCode);

    if (isOriginalCode) {
      creator.mobidul.codeHelper.text = '';
    } else {
      creator.mobidul.codeHelper.text = codeHelperText;
    }

    creator.mobidul.codeHelper.show = ! isOriginalCode;
  }


  // NOTE: TODO: Code duplication w/ CloneMobidulDialogController
  function _resetCodeHelper () {
    creator.mobidul.codeHelper.show = false;
    creator.mobidul.codeHelper.text = '';
  }


  function changeName () {
    if ( creator.isNewMobidul || creator.mobidul.generateCode ) {
      var mobidulName = creator.mobidul.name.trim();
      var mobidulCode = UtilityService.getCodeFromName(mobidulName);

      if (mobidulCode) {
        creator.mobidul.codeHelper.text = creator._codeHelperGenerating;
      }

      if (
        creator.isNewMobidul ||
        ( ! creator.isNewMobidul &&
        ! _isOriginalCode( mobidulCode ) )
      ) {
        CreatorService.existsMobidul(mobidulCode)
        .success(function (response, status, headers, config) {
          // $log.debug('request valid code callback from changeName : ');
          // $log.debug(code);

          // TODO: add exists from the responseobject
          creator.canNotSave = response.exists;
          mobidulCode = response.mobidulCode;

          if (mobidulCode) {
            creator.mobidul.code = mobidulCode;

            _refreshCodeHelper( mobidulCode, creator._codeHelperGenerated );

            if ( ! creator.isNewMobidul ) {
              creator.mobidul.generateCode = false;
            }
          } else {
            creator.mobidul.code = '';

            _resetCodeHelper();
          }
        });
      } else {
        _restoreOriginalStationCode();
      }
    }
  }


  function changeCode () {
    // $log.debug('change code');
    // $log.debug(stationCreator.station.code + "<");

    creator.mobidul.code =
      UtilityService.formatCode( creator.mobidul.code );

    // $log.debug(stationCreator.station.code + "<");

    var mobidulCode = creator.mobidul.code;


    if ( mobidulCode )
    {
      if ( creator.isNewMobidul ||
        ( ! creator.isNewMobidul &&
        ! _isOriginalCode( mobidulCode ) ) )
      {
        CreatorService.existsMobidul( mobidulCode )
        .success(function (response, status, headers, config)
        {
          // $log.debug('request valid code callback from changeName : ');
          // $log.debug(code);

          // TODO: add exists from the responseobject
          creator.canNotSave = response.exists;

          var code = response.mobidulCode
          creator.mobidul.code = code;

          if ( mobidulCode !== code )
            _refreshCodeHelper( code, creator._codeHelperGenerated );

          else
            _refreshCodeHelper( code, creator._codeHelperManual );
        });
      }
      else _restoreOriginalStationCode();
    }
    else
    {
      creator.mobidul.generateCode = true;

      changeName();
    }
  }


  function saveBasis () {
    // check if everything is correct.
    // TODO: Check if new mobidul

    var params = {
      'name'        : creator.mobidul.name,
      'code'        : creator.mobidul.code,
      'description' : creator.mobidul.description,
      'mode'        : creator.mobidul.mode
    };

    creator.savingBasisMode = true;
    creator.canNotSave      = true;


    if ( creator.isNewMobidul ) {
      creator.saveBasisText = CreatorService.CREATING_MOBIDUL;

      CreatorService.createMobidul(params)
      .success(function (response, status, headers, config) {
        // $log.debug('Created Mobidul successfully callback : ');
        // $log.debug(response);

        var saveMobidulOptionsDialog =
          $mdDialog.alert()
          .parent( angular.element(document.body) )
          .title($translate.instant('CREATE_MOBIDUL'))
          .textContent( response.msg )
          .ariaLabel($translate.instant('CREATE_MOBIDUL'))
          .ok($translate.instant('OPEN_MOBIDUL'));

        $mdDialog.show(saveMobidulOptionsDialog)
        .then(function () {
          if ( response.code ) {
            $state.go('mobidul.creator.basis', {
              mobidulCode : response.code
            });

            _initDefaultValues();
          }
        });
      });
    } else {
      creator.saveBasisText = CreatorService.UPDATING_MOBIDUL;

      CreatorService.updateMobidul(creator.mobidul.originalCode, params)
      .success(function (response, status, headers, config) {
        // $log.debug('Updated Mobidul successfully callback : ');
        // $log.debug(response);

        var saveMobidulOptionsDialog =
          $mdDialog.alert()
          .parent( angular.element(document.body) )
          .title($translate.instant('REFRESH_MOBIDUL'))
          .textContent( response.msg )
          .ariaLabel($translate.instant('REFRESH_MOBIDUL'))
          .ok($translate.instant('CLOSE'));

        $mdDialog.show(saveMobidulOptionsDialog)
        .then(function () {
          $state.go('mobidul.creator.basis', {
            mobidulCode : params.code
          });

          _initDefaultValues();
        });
      });
    }
  }


  function saveOptions () {
    // TODO Statische Optionen!!
    var params =
    {
      'showMenu'             : 1,
      'allowedStationTypes'  : '',
      'automaticPollingTime' : 0,
      'editingDistance'      : 0,
      'locked'               : creator.mobidul.isLocked,
      'private'              : creator.mobidul.isHiddenOnHome,
      'editMode'             : creator.editMode,
      'font'                 : creator.mobidul.font
    };

    // TODO - check if the same as StateManager.state.params.mobidulCode !
    var mobidulCode = creator.mobidul.code;


    CreatorService.saveOptions( mobidulCode, params )
    .success(function (response, status, headers, config)
    {
      switch ( response ) {
        case 'success':
          // $log.debug("saved everything, go to next state");
          // TODO: Wenn stateparam mobidul gesetzt ist soll automatisch auf den mobidulcreator in den Optionen des mobiduls umgeleitet werden.
          // WEIL: Das Mobidul existiert ab diesem Zeitpunkt
          // UND:  man kann ?? TODO finish description

          var saveMobidulOptionsDialog =
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title($translate.instant('MOBIDUL_SAVED'))
            .textContent($translate.instant('MOBIDUL_OPTIONS_SAVED'))
            .ariaLabel($translate.instant('POSITION_ERROR_TITLE'))
            .ok($translate.instant('CLOSE'));

          $mdDialog.show( saveMobidulOptionsDialog )
          .then(function ()
          {
            if ( creator.isNewMobidul )
            {
              var stateParams = {
                mobidulCode : creator.mobidul.originalCode
              };

              $state.go('mobidul.creator.basis', stateParams);
            }
            else
              MobidulService.menuReady();
          });
          break;

        case 'not-allowed':
          // creator.showToast('Es existiert bereits ein Mobidul mit diesem Code !');
          creator.showToast($translate.instant('NOT_AUTHORIZED_TO_EDIT_MOBIDUL'));
          break;

        case 'code-not-allowed' :
          creator.showToast($translate.instant('CODE_INVALID'));
          break;

        default :
          creator.showToast( response );
          break;
      }
    });
  }


  function deleteCategory (categoryId, $index, $event) {
    // TODO - check when to remove category
    // TODO - remove category animation

    var confirm = $mdDialog.confirm()
    .title($translate.instant('DELETE_CATEGORY_TITLE'))
    .textContent($translate.instant('DELETE_CATEGORY_WARNING'))
    .ariaLabel($translate.instant('CONFIRMATION'))
    .targetEvent( $event )
    .ok($translate.instant('YES'))
    .cancel($translate.instant('NO'));

    $mdDialog.show( confirm )
    .then(function ()
    {
      // NOTE - remove category from categories array in order to "not resave at save"
      creator.categories.splice($index, 1);

      // TODO - check if it is the same as creator.mobidul.code
      var mobidulCode = StateManager.state.params.mobidulCode;

      CreatorService.removeCategory( mobidulCode, categoryId )
      .success(function (response)
      {
        switch ( response )
        {
          case 'success' :
            creator.showToast($translate.instant('CATEGORY_DELETED'));
            break;

          case 'not-allowed' :
            creator.showToast($translate.instant('NOT_AUTHORIZED_TO_DELETE_CATEGORY'));
            break;

          case 'not-existing' :
            creator.showToast($translate.instant('CATEGORY_DOESNT_EXIST'));
            break;

          case 'empty' :
            creator.showToast($translate.instant('NO_CATEGORY_PASSED'));
            break;

          default :
            creator.showToast( response );
            break;
        }
      });

    }, function() {
      //Abort
    });
  }


  function deleteMenuItem (menuItemId, $index) {
    creator.menu.splice($index, 1);
  }


  function addCategory () {
    var newCategory = {
      origName      : $translate.instant('NEW_CATEGORY'),
      name          : $translate.instant('NEW_CATEGORY'),
      isNewCategory : true
    };

    creator.categories.push(newCategory);

    // var newLength = creator.categories.push({ name : 'Neue Kategorie' });
    // var lastIndex = newLength - 1;
    // var categoryFieldId   = 'category_field_' + lastIndex;
    // var lastCategoryField = document.getElementById(categoryFieldId);
    //
    // lastCategoryField.focus();
    // lastCategoryField.value = '';


    // angular.forEach( creator.categories, function (category, cIx)
    // {
    //   if ( category.focus )
    //      category.focus = false;
    // });
    //
    // creator.categories.push({ name : 'Neue Kategorie', focus : true });


    // var lix = creator.categories.push({ name : 'Neue Kategorie' });
    // $log.debug(lix);
    // $log.debug($('#creator_categories input.category-field'));
    // $log.debug( $('#creator_categories input.category-field').last() );
    // $('#creator_categories input.category-field').last().focus();
  }


  function focusCategory (category) {
    if ( category.isNewCategory ) category.name = '';
  }


  function blurCategory (category) {
    if ( category.name === '' ) category.name = category.origName;
    else category.isNewCategory = false;
  }


  function saveCategories () {
    // $log.debug('Save categories in CreatorController');

    // only allow to save if the list is not empty and every category has a name
    var canSave = true;

    if ( creator.categories.length == 0 ) canSave = false;


    angular.forEach( creator.categories, function (value, key) {
        if ( value.name === '' ) canSave = false;
      }, this);


    if (canSave) {
      // TODO Statische Optionen!!
      var params = creator.categories;

      // DEBUG
      var mobidulCode =
        creator.mobidul.code === undefined
          ? '' : creator.mobidul.code;

      CreatorService.updateCategories( mobidulCode, params )
      .success(function (response, status, headers, config)
      {
        switch ( response )
        {
          case 'success' :
            // creator.showToast('Kategorien wurden erfolgreich gespeichert.');

            var savedMobidulCategoriesDialog =
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('MOBIDUL_SAVED'))
              .textContent($translate.instant('CATEGORIES_SAVED'))
              .ariaLabel($translate.instant('MOBIDUL_SAVED'))
              .ok($translate.instant('CLOSE'));

            $mdDialog.show( savedMobidulCategoriesDialog )
            .then(function ()
            {
              MobidulService.menuReady();

              $state.go(
                $state.current,
                StateManager.state.params,
                { reload : true }
              );
            });
            break;

          case 'not-allowed' :
            creator.showToast($translate.instant('NOT_AUTHORIZED_TO_EDIT_CATEGORY'));
            break;

          case 'Keine Kategorie angegeben' :
            creator.showToast($translate.instant('NO_CATEGORY_PASSED'));
            break;

          default :
            creator.showToast( response );
            break;
        }
      });
    }
  }


  function showAddMenuItem () {
    $mdDialog.show({
      locals : {
        categories : creator.categories,
        stations   : creator.stations
      },
      controller  : DialogController,
      templateUrl : 'app/modules/creator/CreatorAddMenuItemDialogTemplate.html',
      parent      : angular.element(document.body),
      clickOutsideToClose : true
    })
    .then(function (param)
      {
        // $log.debug('type ' + param.type + ' id ' + param.id);
        creator.addMenuItem( param.type, param.id );
      },
      function () {
        // canceled the dialog
      });
  }


  function saveMenu () {
    var params = creator.menu;

    // TODO - check if it is the same as creator.mobidul.code
    var mobidulCode = StateManager.state.params.mobidulCode;

    CreatorService.saveMenu( mobidulCode, params )
    .success(function (response, status, headers, config)
    {
      switch ( response )
      {
        case 'success' :
          var savedMobidulMenuDialog =
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title($translate.instant('MOBIDUL_SAVED'))
            .textContent($translate.instant('MENU_SAVED'))
            .ariaLabel($translate.instant('MOBIDUL_SAVED'))
            .ok($translate.instant('CLOSE'));

          $mdDialog.show( savedMobidulMenuDialog )
          .then(function ()
          {
            if ( creator.isNewMobidul )
              $state.go('creator.settings', {});
            else
            {
              // creator.showToast('Menü wurde gespeichert');
              MobidulService.menuReady();
            }
          });

          break;

        case 'not-allowed' :
          creator.showToast($translate.instant('GENERIC_NOT_ALLOWED'));
          break;

        case 'Keine Kategorie angegeben' :
          creator.showToast($translate.instant('NO_CATEGORY_PASSED'));
          break;

        default :
          creator.showToast(response);
          break;
      }
    });

  }


  function addMenuItem (type, id) {
    // $log.debug(type);
    // $log.debug(id);
    creator.closeDialog();

    switch ( type ) {
      case 'category':
        menuItem = {    id          : null,
          name        : creator.categories[id].name,
          text        : creator.categories[id].name,
          icon        : '',
          isDivider   : false,
          href        : creator.categories[id].id,
          func        : 'getForCategory'
        };
        break;

      case 'map':
        menuItem = {    id          : null,
          name        : 'Map',
          text        : $translate.instant('MAP'),
          icon        : '',
          isDivider   : false,
          href        : 'map.html',
          func        : 'switchcontent'
        };
        break;

      case 'divider':
        menuItem = {    id          : null,
          name        : $translate.instant('TRENNER'),
          text        : '',
          icon        : '',
          isDivider   : true,
          href        : '',
          func        : ''
        };
        break;

      case 'station':
        menuItem = {     id          : null,
          name        : creator.stations[id].name,
          text        : creator.stations[id].name,
          icon        : '',
          isDivider   : false,
          href        : creator.stations[id].id,
          func        : 'switchcontent'
        };
        break;
    }

    creator.menu.push(menuItem);

  }


  function closeDialog() {
    $mdDialog.hide();
  }


  function deleteCode ($index, $event) {
    $event.stopPropagation();

    CreatorService.deleteCode( creator.codes[$index].code )
    .success(function (response, status, headers, config) {
      creator.codes.splice($index,1);
    });

  }


  function toggleCode (code, $index) {
    if (code.locked) {
      CreatorService.unlockCode(code.code)
      .success(function (response, status, headers, config) {
        //code.locked=
      });
    } else {
      CreatorService.lockCode( code.code )
      .success(function (response, status, headers, config) {
        //creator.codes.splice($index,1);
      });
    }

  }


  function requestCode () {
    var mobidulCode = StateManager.state.params.mobidulCode;

    CreatorService.requestCode( mobidulCode )
    .success(function (response, status, headers, config) {
      getPlayCodes();
    });
  }


  function getPlayCodes () {
    var mobidulCode = StateManager.state.params.mobidulCode;

    CreatorService.getCodes( mobidulCode )
    .success(function (codes, status, headers, config) {
      // $log.debug('getCodes success in CreatorController');
      // $log.debug(codes);

      if ( codes ) {
        angular.forEach( codes, function (code, cIx) {
          // $log.debug(code.locked);
          // $log.debug(typeof code.locked);

          code.locked = code.locked == 1 ? 1 : 0;
        });

        creator.codes = codes;
      }
    });
  }


  function showQRCode ($index, $event) {
    // TODO
    $event.stopPropagation();
    //var protocol = 'http:'
    var url = location.protocol + '//' + location.host + '/Play/' + creator.codes[ $index ].code;

    $mdDialog.show({
      locals : { code : creator.codes[ $index ].code },
      controller  : QRDialogController,
      templateUrl : 'app/modules/creator/CreatorQRCodeTemplate.html',
      parent     : angular.element(document.body),
      clickOutsideToClose : true
    })
    .then(function (param) {
        // $log.debug("type " + param.type + " id " + param.id);
        // creator.addMenuItem( param.type, param.id );
      },
      function () {
        // canceled the dialog ;
      });
  }


  function deleteMobidul () {
    var confirmDeleteMobidulDialog =
      $mdDialog.confirm()
      .parent( angular.element(document.body) )
      .title($translate.instant('DELETE_MOBIDUL_CONFIRMATION_TITLE'))
      .textContent($translate.instant('DELETE_MOBIDUL_CONFIRMATION_BODY'))
      .ariaLabel($translate.instant('DELETE_MOBIDUL_CONFIRMATION_TITLE'))
      .ok($translate.instant('DELETE'))
      .cancel($translate.instant('CANCEL'));

    $mdDialog.show( confirmDeleteMobidulDialog )
    .then(function () {
      //$log.debug('Mobidul löschen triggered');
      //$log.debug('die 2 sollten gleich sein :');
      //$log.debug(StateManager.state.params.mobidulCode + ' === ' + creator.mobidul.code);

      // TODO - check if it is the same as creator.mobidul.code
      var mobidulCode = StateManager.state.params.mobidulCode;

      CreatorService.deleteMobidul( mobidulCode )
      .success(function (response) {
        // $log.debug('delete Mobidul in CreatorController callback :');
        // $log.debug(response);

        if (response) {
          var responseMsg = response.msg || $translate.instant('DELETE_MOBIDUL_ERROR_MSG');

          var deleteMobidulOptionsDialog =
            $mdDialog.alert()
            .parent( angular.element(document.body) )
            .title($translate.instant('DELETE_MOBIDUL'))
            .textContent( responseMsg )
            .ariaLabel($translate.instant('DELETE_MOBIDUL'))
            .ok($translate.instant('CLOSE'));

          $mdDialog.show( deleteMobidulOptionsDialog )
          .then(function () {
            if ( response.success )
              $state.go('home');
          });
        }
      });
    });
  }

  /// events
  // ...

}



/**
 * DialogController
 */

function DialogController ($scope, $mdDialog, categories, stations) {
  // Station noch eintragen.
  $scope.categories = categories;
  $scope.stations   = stations;


  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.addMenuItem = function (type, id)
  {
    $mdDialog.hide({
      type : type,
      id   : id
    });
  }
}



/**
 * QRDialogController
 */

function QRDialogController ($scope, $mdDialog, code) {
  $scope.url = location.protocol + '//' + location.host + '/Play/' + code;

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}
