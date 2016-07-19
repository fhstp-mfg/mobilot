angular
  .module('StationCreator')
  .controller('StationCreatorController', StationCreatorController);


StationCreatorController.$inject = [
  '$log', '$rootScope', '$scope', '$q',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  'UtilityService', 'HeaderService', 'MobidulService',
  'StationCreatorService', 'MapService', 'StationService'
];


function StationCreatorController (
  $log, $rootScope, $scope, $q,
  $state, $stateParams, StateManager,
  $mdDialog,
  UtilityService, HeaderService, MobidulService,
  StationCreatorService, MapService, StationService
)
{
  var stationCreator = this;

  /// constants
  stationCreator._mobilotUrl = 'www.mobilot.at';

  stationCreator._codeHelperGenerating = 'wird generiert ...';
  stationCreator._codeHelperGenerated  = 'automatisch generiert';
  stationCreator._codeHelperManual     = 'manuell geändert';


  /// vars
  stationCreator.isCordovaIos = isCordova && isIos;

  // StationCreator general
  stationCreator.stationTabIndex =
    StateManager.state.helpers.tabIndex ||
    StationCreatorService.BASIS_TAB_INDEX;

  stationCreator.categories     = [];
  stationCreator.origCategories = [];

  stationCreator.stationOptions = [{
    name        : 'Unveränderbar',
    description : 'Die Station ist unveränderbar.',
    selected    : false
  }, {
    name        : 'Auf Karte verstecken',
    description : 'Die Station wird nicht auf der Karte angezeigt.',
    selected    : false
  }];
  stationCreator.origStationOptions = angular.copy(stationCreator.stationOptions);

  stationCreator.myPosition         = {};
  stationCreator.circleColor        = MapService.circleColor;
  stationCreator.centerToMyPosition = false;
  stationCreator.isRally            = false;

  // basic
  stationCreator.basis = {
    originalCode: '',
    generateCode: false,

    codeHelper: {
      show: false,
      text: ''
    }
  };


  // station Data
  stationCreator.isNewStation = false;

  // edit modes
  stationCreator.isNameEditMode = false;



  /// functions
  stationCreator.changeStationDetailTab = changeStationDetailTab;
  stationCreator.discardChanges = discardChanges;
  stationCreator.saveChanges    = saveChanges;
  stationCreator.closeDialog    = closeDialog;
  // basis
  stationCreator.changeName = changeName;
  stationCreator.changeCode = changeCode;
  // map
  // NOTE - moved to MapController
  // stationCreator.dropMarker = dropMarker;
  // categories
  // ...
  // settings
  stationCreator.deleteStation = deleteStation;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    $log.debug('StationCreatorController init');

    HeaderService.refresh();

    _initDefaultValues();

    _listenToStationCode();

    _listenToCancelEdit();
    _listenToSaveStation();

    // if ( stationCreator.state === 'mobidul.station.edit.place' )
    // {
    //   _waitForGoogleMapApi();
    //
    //   _waitForGoogleMap();
    // }
  }


  function _initDefaultValues ()
  {
    var currentStateParams = StateManager.state.params;

    // TODO - check if this statament is really necessary
    if ( currentStateParams )
    {
      var mobidulCode = currentStateParams.mobidulCode;
      var stationCode = currentStateParams.stationCode;

      stationCreator.mobidulCode = mobidulCode;

      // var stationOptions = angular.copy( stationCreator.stationOptions );

      stationCreator.station =
      {
        name : '',
        link : '',
        code : '',

        categories : []
        // options    : stationOptions
      };
      stationCreator.origStation = angular.copy( stationCreator.station );

      _resetStationOptions();


      //Check if mobidule is rallye
      MobidulService.getMobidulMode(currentStateParams.mobidulCode)
        .then(function(mode){
          stationCreator.isRally = (mode == MobidulService.MOBIDUL_MODE_RALLY);
        });

      // setting corrent url for current mobidul
      stationCreator.station.link = stationCreator._mobilotUrl + '/' + mobidulCode  + '/';


      // loading mobidul categories
      _loadCategories( mobidulCode )
        .then(function ()
        {
          // NOTE - after the mobidul categories are loaded,
          //    station related data should be loaded .

          var isNewStation = stationCode === StateManager.NEW_STATION_CODE;

          stationCreator.isNewStation = isNewStation;


          // different actions when there is new station or nah .
          if ( isNewStation )
          {
            stationCreator.basis.generateCode = true;

            //new station - fill with default station structure
            MobidulService.getMobidulConfig(StateManager.state.params.mobidulCode)
              .then(function(response){

                var config = {};
                angular.forEach(response.states, function(state){
                  config[state] = [
                    {
                      type: 'html',
                      content: 'This is some sample text.'
                    }
                  ];
                });

                stationCreator.station.content = config;

              });
          }
          else
          {
            _loadStation( mobidulCode, stationCode );
          }
          _loadAllStations(mobidulCode);

        });


      // getting current position
      MapService
        .getCurrentPosition()
        .then(function (position)
        {
          // NOTE - check if this is even necessary
          stationCreator.myPosition = position;
        });
    }
  }


  function _listenToStationCode ()
  {
    $scope.$watch('stationCreator.station.code', function (newCode, oldCode)
    {
      stationCreator.codePreview =
        newCode ? newCode : StationCreatorService.STATION_CODE_EXAMPLE;
    });
  }


  function _listenToCancelEdit ()
  {
    // $log.debug('(( Listening to "Header::cancelEdit"');

    var cancelEditListener =
      $rootScope.$on('Header::cancelEdit', function (event, config)
      {
        $log.debug('Listened to "Header::cancelEdit"');

        // _saveStation();

        _checkForChanges();
      });

    $scope.$on('$destroy', cancelEditListener);
  }


  function _listenToSaveStation ()
  {
    // $log.debug('(( Listening to "Header::saveStation"');

    var saveStationListener =
      $rootScope.$on('Header::saveStation', function (event, config)
      {
        // $log.debug(')) Listened to "Header::saveStation"');
        // $log.debug(event);

        _saveStation();
      });

    $scope.$on('$destroy', saveStationListener);
  }


  /**
   * Loads all stations of the Mobidul to show them (disabled) in the editor view
   * saves loaded stations to StationsCreatorService.markersAll
   *
   * @param mobidulCode
   * @private
   */
  function _loadAllStations(mobidulCode)
  {

    StationService
      .getMapStations(mobidulCode)
      .success(function(stations){

        //$log.info("loadAllStations:");
        //$log.debug(stations);

        //Check if marker exists (doesn't if new station is created)
        if(StationCreatorService.marker.coords) {
          //Remove stations with the same coordinates as the current station
          stations = stations.filter(function (station) {
            return station.lat != StationCreatorService.marker.coords.latitude && station.lon != StationCreatorService.marker.coords.longitude;
          });
        }else{
          //$log.info("New Marker");
        }

        angular.forEach(stations, function(station, key){

          var stationData =
          {
            id         : station.code,
            latitude   : station.lat,
            longitude  : station.lon,
            name       : station.name
          };

          StationCreatorService.markersAll.push(stationData);

        });
      })
      .error(function (response, status, headers, config, statusText)
      {
        $log.error(response);
        $log.error(status);
      })
      .then(function(){
        //$log.info("StationCreatorController - _loadAllStations - stationCreator.stations:");
        //$log.debug(StationCreatorService.markersAll);
      });
  }

  function _loadCategories (mobidulCode)
  {
    var defer = $q.defer();

    StationCreatorService
      .loadCategories( mobidulCode )
      .then(function (response)
      {
        // $log.debug('StationCreatorcontroller _loadCategories callback : ');

        var categories = response.data || null;
        // $log.debug(categories);

        if ( categories )
        {
          angular.forEach( categories, function (category, cIx)
          {
            category.selected = false;

            stationCreator.categories.push(category);
          });
        }

        stationCreator.origCategories = angular.copy( stationCreator.categories );

        defer.resolve();
      });

    return defer.promise;
  }


  function _loadStation (mobidulCode, stationCode)
  {
    $log.debug('StationCreatorController _loadStation : ');
    // $log.debug(mobidulCode);
    // $log.debug(stationCode);

    StationCreatorService
      .loadStation( mobidulCode, stationCode )
      .success(function (response, status, headers, config)
      {
        $log.debug('StationCreatorController _loadStation callback : ');
        $log.debug(response);

        var stationData = response || null;

        if ( stationData )
        {
          // mobidul url
          var mobidulUrl = stationCreator._mobilotUrl + '/' + mobidulCode + '/';

          // station categories
          if ( stationData.categories )
          {
            // NOTE TODO - find more performant method
            angular.forEach( stationCreator.categories, function (mobidulCategory, mcIx)
            {
              angular.forEach( stationData.categories, function (category, cIx)
              {
                if ( mobidulCategory.id === category.categoryId )
                  mobidulCategory.selected = true;
              });
            });
            stationCreator.origCategories = angular.copy( stationCreator.categories );
          }


          // station options
          var options = angular.copy( stationCreator.stationOptions );

          var isLocked  = Boolean( stationData.locked  );
          var isEnabled = Boolean( stationData.enabled );

          stationCreator.origStationOptions[ 0 ].selected = isLocked;
          stationCreator.origStationOptions[ 1 ].selected = isEnabled;
          stationCreator.stationOptions[ 0 ].selected   = isLocked;
          stationCreator.stationOptions[ 1 ].selected   = isEnabled;


          stationCreator.station =
          {
            name     : stationData.name,
            link    : mobidulUrl,
            code     : stationData.code,
            lat     : stationData.lat,
            lon     : stationData.lon,
            radius     : stationData.radius,
            contentType : stationData.contentType,
            locked     : isLocked,
            enabled   : isEnabled

            // categories   : stationCreator.station.categories,
            // medialist    : []
          };

          try{
            stationCreator.station.content =  JSON.parse(stationData.content);
          }catch(e){
            $log.error('Error while parsing station.content');
          }

          // make reference-less copyies of the loaded station data
          //  for checking changes later on
          stationCreator.origStation = angular.copy( stationCreator.station );


          stationCreator.basis.originalCode = stationData.code;
          stationCreator.basis.generateCode = false;

          _resetCodeHelper();


          StationCreatorService.marker.coords = {
            latitude  : stationData.lat,
            longitude : stationData.lon
          };
        }
      })
      .error(function (response, status, headers, config)
      {
        $log.error(response);
        $log.error(status);
      });
  }


  function _saveStation ()
  {
    $log.debug('> Saving station');

    var currentStateParams = StateManager.state.params;
    // $log.debug(currentStateParams);


    if ( currentStateParams )
    {
      // station categories
      var selectedCategories = [];

      angular.forEach( stationCreator.categories, function (category, cIx)
      {
        if ( category.selected )
          selectedCategories.push(category);
      });


      // station options
      // var isLocked  = stationCreator.station.options[ 0 ].selected ? 1 : 0;
      // var isEnabled = stationCreator.station.options[ 1 ].selected ? 1 : 0;
      var isLocked  = stationCreator.stationOptions[ 0 ].selected ? 1 : 0;
      var isEnabled = stationCreator.stationOptions[ 1 ].selected ? 1 : 0;


      // station object
      var stationData =
      {
        name     : stationCreator.station.name,
        code     : stationCreator.station.code,
        lat     : StationCreatorService.marker.coords.latitude,
        lon     : StationCreatorService.marker.coords.longitude,
        radius     : 1000,
        content   : JSON.stringify(stationCreator.station.content),
        contentType : 'html',
        locked     : isLocked,
        enabled   : isEnabled,

        categories   : selectedCategories,
        medialist    : []
      };


      $log.debug('station data : ');
      $log.debug(stationData);


      // NOTE - add station
      if ( currentStateParams.stationCode === StateManager.NEW_STATION_CODE ) {

        StationCreatorService
          .addStation(
            currentStateParams.mobidulCode,
            stationData
          )
          .then(function (response) {
            //$log.info("_saveStation - response");
            //$log.debug(response);

            var responseMsg = response.data || null;

            if (responseMsg)

              if (responseMsg === 'not allowed')
                alert('not allowed');

              else if (responseMsg === 'mobidul locked')
                alert('mobidul locked');

              else if (responseMsg === 'error')
                alert('error');

              else if (responseMsg === 'invalid station code')
                alert('invalid station code');
              else {
                var stationCode = responseMsg;

                $state.go('mobidul.station', {stationCode: stationCode});
              }
          });
      }
      // NOTE - save existing station
      else {
        StationCreatorService
          .saveStation(
            currentStateParams.mobidulCode,
            currentStateParams.stationCode,
            stationData
          )
          .then(function (response) {
            $log.debug('save station StationCreatorService callback :');
            $log.debug(response);
            $log.debug(currentStateParams.stationCode);

            var saved = response.data.saved;
            var msg = response.data.msg || 'Unknown error';

            if (saved) {
              var stationCode = response.data.code;
              $log.debug(stationCode);

              $state.go(
                'mobidul.station',
                {stationCode: stationCode},
                {'reload': true}
              );
            }
            else {
              // $log.error(msg);
              alert(msg);
            }
          });
      }
    }
  }


  function _checkForChanges ()
  {
    $log.debug('StationCreator checkForChanges : ');

    var hasStationChanges    = ! angular.equals( stationCreator.station, stationCreator.origStation );
    var hasCategoriesChanges = ! angular.equals( stationCreator.categories, stationCreator.origCategories );
    var hasOptionChanges     = ! angular.equals( stationCreator.stationOptions, stationCreator.origStationOptions );

    var hasChanges = hasStationChanges     ||
             hasCategoriesChanges ||
             hasOptionChanges;

    // $log.debug('hasChanged : ' + hasChanges);
    // $log.debug('origStation vs station :');
    // $log.debug(stationCreator.origStation);
    // $log.debug(stationCreator.station);
    // $log.debug('origCategories, categories');
    // $log.debug(stationCreator.origCategories);
    // $log.debug(stationCreator.categories);
    // $log.debug('origStationOptions, stationOptions');
    // $log.debug(stationCreator.origStationOptions);
    // $log.debug(stationCreator.stationOptions);


    if ( hasChanges )
    {
      var dialogTitle, stationMsg, saveText;

      if ( stationCreator.isNewStation )
      {
        dialogTitle    = 'Station erstellen';
        stationMsg     = 'Möchtest du diese Station erstellen?'
        saveButtonText = 'Erstellen';
      }
      else
      {
        dialogTitle = 'Änderungen speichern';
        stationMsg  = 'Die Station mit dem Code "' + stationCreator.origStation.code + '" wurde geändert. Möchtest du die Änderungen speichern?'
        saveText    = 'Speichern';
      }


      $mdDialog.show({
        template :
          '<md-dialog aria-label="Station Änderungen speichern Dialog">' +
            '<md-dialog-content>' +
              '<div class="md-dialog-content">' +
                '<h2 class="md-title">' + dialogTitle + '</h2>' +
                '<p>' + stationMsg + '</p>' +
              '</div>' +
            '</md-dialog-content>' +

            '<md-dialog-actions class="md-dialog-content-divider">' +
              '<md-button ng-click="stationCreator.discardChanges()">' +
                'Verwerfen' +
              '</md-button>' +

              '<span flex></span>' +

              '<md-button ng-click="stationCreator.closeDialog()">' +
                'Abbrechen' +
              '</md-button>' +

              '<md-button ng-click="stationCreator.saveChanges()">' +
                saveButtonText +
              '</md-button>' +
            '</md-dialog-actions>' +
          '</md-dialog>', // NOTE - remember commas
        // controller : 'StationCreatorController as stationCreator',
        scope : $scope,
        preserveScope : true,
        clickOutsideToClose : true
      });
    }
    else
      StateManager.back();
  }


  function _isOriginalCode (stationCode)
  {
    return stationCode === stationCreator.basis.originalCode;
  }


  function _restoreOriginalStationCode ()
  {
    stationCreator.station.code = stationCreator.basis.originalCode;

    _resetCodeHelper();
  }


  function _resetStationOptions ()
  {
    stationCreator.stationOptions[0].selected = false;
    stationCreator.stationOptions[1].selected = false;

    stationCreator.origStationOptions = angular.copy( stationCreator.stationOptions );
  }


  function _refreshCodeHelper (stationCode, codeHelperText)
  {
    var  isOriginalCode = _isOriginalCode( stationCode );

    if ( isOriginalCode )
      stationCreator.basis.codeHelper.text = '';
    else
      stationCreator.basis.codeHelper.text = codeHelperText;

    stationCreator.basis.codeHelper.show = ! isOriginalCode;
  }


  function _resetCodeHelper ()
  {
    stationCreator.basis.codeHelper.show = false;
    stationCreator.basis.codeHelper.text = '';
  }


  /// public functions

  function changeStationDetailTab ()
  {
    // $log.debug('change search detail tab');
    // $log.debug(stationCreator.stationTabIndex);

    var editRoute = 'mobidul.station.edit.';

    switch ( stationCreator.stationTabIndex )
    {
      case StationCreatorService.BASIS_TAB_INDEX :
        editRoute += 'basis';
        break;

      case StationCreatorService.PLACE_TAB_INDEX :
        editRoute += 'place';
        break;

      case StationCreatorService.CATEGORIES_TAB_INDEX :
        editRoute += 'categories';
        break;

      case StationCreatorService.SETTINGS_TAB_INDEX :
        editRoute += 'settings';
        break;
    }


    var currentStateParams = StateManager.state.params || {};

    $state.go( editRoute, currentStateParams );
  }


  function discardChanges ()
  {
    closeDialog();

    StateManager.back();
  }


  function saveChanges ()
  {
    closeDialog();

    _saveStation();
  }


  function closeDialog ()
  {
    $mdDialog.hide();
  }


  function changeName ()
  {
    if ( stationCreator.isNewStation || stationCreator.basis.generateCode )
    {
      // TODO – change default station name handling
      var stationName = stationCreator.station.name.trim() || '(Unbekannt)';
      var stationCode = UtilityService.getCodeFromName( stationName );


      if ( stationCode )
        stationCreator.basis.codeHelper.text = stationCreator._codeHelperGenerating;


      if ( stationCreator.isNewStation ||
         ( ! stationCreator.isNewStation &&
           ! _isOriginalCode( stationCode ) ) )
      {
        StationService
          .requestValidCode( stationCode )
          .success(function (code, status, headers, config)
          {
            // $log.debug('request valid code callback from changeName : ');
            // $log.debug(code);

            stationCode = code;

            if ( stationCode )
            {
              stationCreator.station.code = stationCode;


              _refreshCodeHelper( stationCode, stationCreator._codeHelperGenerated );


              if ( ! stationCreator.isNewStation )

                stationCreator.basis.generateCode = false;
            }
            else
            {
              stationCreator.station.code = '';

              _resetCodeHelper();
            }
          });
      }
      else
        _restoreOriginalStationCode();
    }
  }


  function changeCode ()
  {
    // $log.debug('change code');
    // $log.debug(stationCreator.station.code + "<");

    stationCreator.station.code =
      UtilityService.formatCode( stationCreator.station.code );

    // $log.debug(stationCreator.station.code + "<");

    var stationCode = stationCreator.station.code;


    if ( stationCode )
    {
      if ( stationCreator.isNewStation ||
         ( ! stationCreator.isNewStation &&
           ! _isOriginalCode( stationCode ) ) )
      {
        StationService
          .requestValidCode( stationCode )
          .success(function (code, status, headers, config)
          {
            // $log.debug('request valid code callback from changeCode : ');
            // $log.debug(code);
            // $log.debug('stationCode (' + stationCode + ')');

            stationCreator.station.code = code;

            if ( stationCode !== code )

              _refreshCodeHelper( code, stationCreator._codeHelperGenerated );

            else
              _refreshCodeHelper( code, stationCreator._codeHelperManual );
          });
      }
      else
        _restoreOriginalStationCode();
    }
    else
    {
      stationCreator.basis.generateCode = true;

      changeName();
    }
  }

  /// event
  function deleteStation ()
  {
    var confirmDeleteStationDialog =
      $mdDialog
        .confirm()
        .parent( angular.element(document.body) )
        .title('Station löschen bestätigen')
        .textContent('Bitte bestätige, dass diese Station gelöscht werden soll.')
        .ariaLabel('Station löschen bestätigen')
        .ok('Löschen')
        .cancel('Abbrechen');

    $mdDialog
      .show( confirmDeleteStationDialog )
      .then(function ()
      {
        var currentStateParams = StateManager.state.params;

        var mobidulCode = currentStateParams.mobidulCode || null;
        var stationCode = currentStateParams.stationCode || null;


        if ( mobidulCode && stationCode )

          StationCreatorService
            .deleteStation( mobidulCode, stationCode )
            .success(function (response, status, headers, config)
            {
              if ( response === 'success' )
              {
                $state.go(
                  'mobidul.map',
                  { mobidulCode : mobidulCode },
                  { reload : true }
                );
              }
            })
            .error(function (response, status, headers, config)
            {
              $log.error(response);
              $log.error(status);

              // TODO - alert window einbauen und dann weiterleitung auf (?)
              alert(response);
            });
      });
  }
}
