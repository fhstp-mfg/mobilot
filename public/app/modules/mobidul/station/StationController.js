angular
  .module('Mobidul')
  .controller('StationController', StationController);


StationController.$inject = [
  '$log', '$rootScope', '$sce', '$scope', '$compile', '$timeout',
  '$state', 'StateManager', '$translate',
  'StationService', 'MobidulService', 'HeaderService',
  'UserService', 'RallyService', 'GeoLocationService', 'FontService'
];


function StationController (
  $log, $rootScope, $sce, $scope, $compile, $timeout,
  $state, StateManager, $translate,
  StationService, MobidulService, HeaderService,
  UserService, RallyService, GeoLocationService, FontService
) {
  var station = this;

  /// constants
  // ...

  /// vars
  station.isCordovaIos  = isCordova && isIos;

  station.mediaList     = [];
  station.imageList     = [];
  station.content       = '';
  station.text          = $translate.instant('LOADING');
  // station.loading       = 'visible';
  station.loading       = 'block';
  station.stationId     = 0;
  station.panZoomConfig = {};
  station.panZoomModel  = {};
  station.myFont        = '';

  /// functions
  // station.getStation        = getStation;
  station.renderText        = renderText;
  station.getPictureByHash  = getPictureByHash;
  $scope.actionPerformed    = actionPerformed;

  /// XXX temp function
  station.setRallyState     = setRallyState;
  station.progressToNext    = __progressToNext;
  station.activateThis      = activateThis;

  // XXX why is this nicer or better than calling what it returns ?
  station.__isStatusActivated = function () {
    return RallyService.isStatusActivated();
  };
  station.__isStatusOpen = function () {
    return RallyService.isStatusOpen();
  };


  /// construct

  _init();


  /// XXX temp functions

  function setRallyState(state){
    RallyService.setStatus(state)
    .then(function(newState){
      renderJSON();
      //Stop position watching and timeout on state change
      GeoLocationService.stopPositionWatching();
      $timeout.cancel($rootScope.timeout);
      // Todo: is this necessary?
      //$rootScope.timeout = undefined;
      //$state.go($state.current, {}, {reload: true});
    });
  }

  function __progressToNext () {
    $log.warn('StationController.__progressToNext(): Please don\'t use this any longer');
    RallyService.activateNext()
      .then(function(){
        RallyService.progressToNext();
      });
  }

  function activateThis(){
    $log.warn('StationController.activateThis(): Please don\'t use this any longer');
    RallyService.setProgress(station.order)
      .then(function(){
        $state.go($state.current, {}, {reload: true});
      });
  }


  /// private functions

  function _init ()
  {
    $log.debug('StationController init');

    _initStation();
    _initActionListener();

    _listenToConfig();
  }


  function _initStation () {
    if (
      StateManager.state.params.mobidulCode &&
      StateManager.state.params.stationCode &&
      StateManager.state.params.stationCode != StateManager.NEW_STATION_CODE
    ) {
      StationService.getStation(
        StateManager.state.params.mobidulCode,
        StateManager.state.params.stationCode
      )
      .success(function (response, status, headers, config) {
        // $log.info('_initStation station response :');
        // $log.debug(response);

        if ( response === '' ) {
          station.text = $translate.instant('NO_STATION_FOR_CODE');

          UserService.Permit.EditStation = false;
        } else {
          var goToCurrentTesting = true;

          RallyService.isEligible(response.order)
            .then(function (isEligible) {
              if (
                ! isEligible &&
                ! StateManager.isStationCreator() &&
                ! goToCurrentTesting
              ) {
                RallyService.goToCurrent();
              } else {

                UserService.Permit.EditStation = response.canEdit && UserService.Permit.EditStation;

                station.content      = response.content;
                station.stationId    = response.stationId;
                station.stationName  = response.stationName;
                station.order        = response.order;
                station.coords       = response.coords;

                /// XXX: this is just for testing purposes
                /// choosing right content based on Mobidul type
                RallyService.refresh();

                var statusContent = [];
                statusContent[ RallyService.STATUS_HIDDEN ] = '' +
                  '<p style="background: #eee; font-weight: bold">' +
                    'Diese Station hat für den Status "' + RallyService.STATUS_HIDDEN + '" keinen Inhalt.' +
                  '</p>';
                statusContent[ RallyService.STATUS_ACTIVATED] = '' +
                  '<p style="background: #eee; font-weight: bold">' +
                    'Diese Station hat für den Status "' + RallyService.STATUS_ACTIVATED + '" keinen Inhalt.' +
                  '</p>';
                statusContent[ RallyService.STATUS_OPEN] = '' +
                  '<p style="background: #eee; font-weight: bold">' +
                    'Diese Station hat für den Status "' + RallyService.STATUS_OPEN + '" keinen Inhalt.' +
                  '</p>';
                statusContent[ RallyService.STATUS_COMPLETED] = '' +
                  '<p style="background: #eee; font-weight: bold">' +
                    'Diese Station hat für den Status "' + RallyService.STATUS_COMPLETED + '" keinen Inhalt.' +
                  '</p>';

                // station.content = statusContent[ RallyService.getStatus( station.order ) ] + response.content;
                // station.content = response.content;

                StationService.setName( response.stationName );

                //get length of all stations belonging to this mobidul to display progressbar correctly
                RallyService.getRallyLength()
                  .then(function (length) {
                    station.rallyLength = parseInt(length);
                  });

                RallyService.getProgress()
                  .then(function (progress) {
                    station.currentStation = progress.progress;
                    station.currentState = progress.state;
                  });

                MobidulService.getMobidulConfig(
                  StateManager.state.params.mobidulCode
                )
                .then(function (config) {
                  station.mobidulConfig = config;
                });


                // TODO: document what the following is doing !

                station.mediaList[ response.stationId ] = [];

                for (var i = 0; i < response.mediaList.length; i++) {
                  var currMediaListHash = response.mediaList[i].hash;

                  station.mediaList[ response.stationId ].push({
                    'hash'      : currMediaListHash,
                    'timestamp' : response.mediaList[i].timestamp
                  });

                  if (
                    typeof station.imageList[currMediaListHash] == 'undefined'
                  ) {
                    station.imageList[currMediaListHash] = {
                      'url'            : response.mediaList[i].url,
                      'uploaded'       : true,
                      'uploadprogress' : 100
                    };
                  }
                }


                // Check whether Station has JSON Content
                try {
                  station.config = JSON.parse(station.content);
                  // $log.info('station.config:');
                  // $log.debug(station.config);

                  // Display dev tools for rally
                  station.isOwner = UserService.Session.role == 1;

                  renderJSON();
                } catch (e) {
                  // TODO: Add better error !
                  $log.warn('No JSON');
                  $log.error(e);
                  // station.renderText();
                }
              }
            });
        }

        station.loading = 'none';
      })
      .error(function (response, status, headers, config) {
        $log.error('couldn\'t get station');
        $log.error(response);
        $log.error(status);

        station.loading = 'none';
      })
      .then(function () {
        HeaderService.refresh();
        $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
      });
    }
  }

  function _initActionListener () {

    $scope.$on('action', function (event, msg) {
      actionPerformed(msg);
    });
  }


  function _listenToConfig ()
  {
    var setConfigListener =
      $rootScope.$on('rootScope:setConfig', function (event, config) {
        // $log.debug('Listened to "rootScope:setConfig" in StationController');
        // $log.debug(config);

        station.myFont = FontService.getFontClass( MobidulService.Mobidul.font );
      });

    $scope.$on('$destroy', setConfigListener);
  }


  function renderText ()
  {
    $log.warn('RenderText() is deprecated - please don\'t use it any longer!');
    var ergebnis = station.content; //.replace(/<.[^>]*>/g, '');
        ergebnis = '\n' + ergebnis; // billiger Trick - so ist auch vor Beginn der ersten Zeile ein \n, und das gilt auch als Whitespace also \s

    var regexp =
    [
      // fett: beginnender * nach einem Whitespace (auch \n)
      /(\s)\*([^*\s][^*]*[^*\s])\*/g,
      // H1: beginnender ** nach einem Whitespace (auch \n)
      /\s\*\*([^*\s][^*]*[^*\s])\*\*/g,
      // kursiv: beginnender _ nach einem Whitespace (auch \n)
      /(\s)\_([^*\s][^_]*[^*\s])\_/g,
      // Links werden einfach am http... erkannt
      /(\s)(https?:\/\/\S+)(\s)/g,
      // normale Links, die mit --- markiert sind
      /(\s)-{3}(https?:\/\/[^\s]+)-{3}/g,
      // Links auf eine interne Mobilot-Seite - soll per JS geladen werden!!
      /*/(\s)-{3}(\w+)-{3}/g,*/
      // BILDxxx nur am Anfang einer Zeile
      /\nBILD([0-9]+)/g,
      // VIDEOxyz nur am Anfang einer Zeile, gibt den Dateinamen (ohne Dateierweiterung an)
      /\nVIDEO(\w)/g,
      // AUDIOxyz nur am Anfang einer Zeile, gibt den Dateinamen (ohne Dateierweiterung an)
      /\nAUDIO(\w)/g,
      // löscht führende Zeilenumbruch weg (u.a. den billigen Trick) - wir starten nicht mir leeren Zeilen
      /^\n+/,
      // Carriage Return (also eingegebenes Enter) - muss als letztes ersetzt werden!!!
      /\n/g
    ];


    var ersetzung =
    [
      // fett: $1 ist das Leerzeichen oder CR vor dem *, $2 der fette Text
      '$1<b>$2</b>',
      // $1 ist der Text (das vorherige Leerzeichen oder CR brauchen wir bei H1 (=Blockelement) nicht)
      '<h1>$1</h1>',
      // $1 ist das Leerzeichen oder CR vor dem *, $2 der kursive Text
      '$1<i>$2</i>',
      // ersetzt URLs automatisch durch Link auf die URL
      '$1<a href="$2">$2</a>$3',
      // externe Links mit --- Syntax
      '$1<a href="$2">$2</a>',
      // es werden 2 Params übergeben, 1) der Match, 2) die Bildnummer (weil in runden Klammern)
      null,
      // es werden 2 Params übergeben, 1) der Match, 2) das Video (weil in runden Klammern)
      null,
      // es werden 2 Params übergeben, 1) der Match, 2) das Audio (weil in runden Klammern)
      null,
      '',
      '</p><p>'
    ];


    for ( var i = 0; i < regexp.length; i++ )
    {
      oneRegExp    = regexp[ i ];
      oneErsetzung = ersetzung[ i ];

      if ( i != 5 && i != 6 && i != 7 )
        ergebnis = ergebnis.replace(oneRegExp, oneErsetzung);

      if ( i == 5 )
      {
        var scope = station;
        //ergebnis.replace bei Bild geht nicht, da die Bilder() funktion dann nicht auf this zugreifen.
        ergebnis = ergebnis.replace(oneRegExp, function (match, bildNummer)
        {
          var myMediaList = [];

          //for new stations: images should be at -1 in medialist
          var stationid = ( scope.stationId != '' ) ? scope.stationId : -1;

          //make it safe!!
          if ( typeof scope.stationId != 'undefined' &&
               typeof scope.mediaList != 'undefined'
          ) {
            if ( typeof scope.mediaList[ stationid ] != 'undefined' )
            {
              for ( var i = 0; i < scope.mediaList[ stationid ].length; i++ )
              {
                myMediaList.push(scope.mediaList[ stationid ][ i ]);
              }

              myMediaList.sort(function (x, y)
              {
                return x.timestamp - y.timestamp;
              });
              //getPictureByHash

              //not sure if bildNummer -1 or bildNummer
              if ( bildNummer > myMediaList.length || myMediaList.length == 0 )
              {
                return "<p>Ung&uuml;ltige Bildnummer: " + bildNummer + "</p>";
              }
              else
              {
                // an der Stelle wird für die Bildnummer die URL des Bildes (sollte md5-Hash sein) eingesetzt.

                var image = scope.getPictureByHash( myMediaList[ bildNummer-1 ].hash );

                if ( image != null )
                {
                  var imgSrc = 'image/' + window.screen.availWidth + '/' + image.url;

                  if ( Boolean( image.uploaded ) )
                    return '<a href="#/' + StateManager.state.params.mobidulCode + '/media/' + image.url +'">' +
                      '<img class="picture" '    +
                           'src="' + imgSrc + '" ' +
                           'width="100%" '     +
                           'height="auto" '    +
                           'style="max-width : '   + window.screen.availWidth + 'px"></a>';
                  else
                    // TODO maybe add missing image default image (thumbnail)
                    return  '<a href="#/' + StateManager.state.params.mobidulCode + '/media/' + image.url + '">' +
                      '<img class="picture" '    +
                           'src="' + imgSrc + '" ' +
                           'width="100%" '     +
                           'height="auto" '    +
                           'style="max-width : '   + window.screen.availWidth + 'px"></a>';
                }
                else
                  // $log.debug("image was null");
                  $log.debug('image was null');
              }
            }
          }

          return "Bild " + bildNummer + " nicht gefunden";
        });
      }

      if ( i == 6 )
      {
        var stateParams = StateManager.state.params;

        ergebnis = ergebnis.replace(oneRegExp, function (match, videoFileName)
        {
          var videostring = '<video controls style="width: 100%;" ' +
              'poster="http://mobilot.at/media/'    +
              stateParams.mobidulCode               +
              '/' + videoFileName + '.jpg"'         +
            '>' +
              '<source src="http://mobilot.at/media/' +
                 stateParams.mobidulCode              +
                 '/' + videoFileName + '.mp4" '       +
                'type="video/mp4"'                    +
              '>' +
            '</video>';

          return videostring;
        });
      }

      if ( i == 7 ) {
        var stateParams = StateManager.state.params;

        ergebnis = ergebnis.replace(oneRegExp, function (match, audioFileName) {
          var audiostring = '<audio controls style="width : 100%">' +
            '<source src="http://mobilot.at/media/'                 +
              stateParams.mobidulCode + '/'                         +
              audioFileName + '.mp3" '                              +
              'type="audio/mp3"'                                    +
            '>'                                                     +
          '</audio>';

          return audiostring;
        });
      }
    }


    if ( this.disablelinks ) {
      ergebnis = ergebnis.replace(/-{3}(\w+)-{3}/g, '<font color="blue" style="text-decoration:underline">Klick</font>');
    } else {
      ergebnis = ergebnis.replace(/-{3}(\w+)-{3}/g, '<a href="#/' + StateManager.state.params.mobidulCode + '/$1/">Station $1</a>');
    }
    ///*href="' + location.protocol + '//' + location.host + '/' + this.mobidul + '/#/content/$1\"

    ergebnis = '<p>' + ergebnis + '</p>';

    // replace (some) empty paragraph tags
    ergebnis = ergebnis.replace(/<p><\/p>/gmi, '');
    // replace (the rest of) empty paragraph tags
    ergebnis = ergebnis.replace(/<p><\/p>/gmi, '');


    station.text = $sce.trustAsHtml( ergebnis );
  }


  /**
   * Appends Rally Directives to their container
   */
  function renderJSON () {
    RallyService.getStatus(station.order)
      .then(function (status) {
         //$log.info('StationController - renderJSON - RallyService.getStatus - status:');
         //$log.debug(status, station, StateManager.isStationCreator());

        station.currentState = status;

        if ( ! StateManager.isStationCreator() ) {
          var config = station.config[status];
          var container = document.getElementById('station-container');
          container.innerHTML = '';

          if (config) {
            config.forEach(function (obj) {
              var type = obj.type;

              if ( ! type ) {
                $log.error('JSON Object doesn\'t have a type ! (ignoring)');
              } else {
                switch (type) {
                  case 'HTML':
                    angular
                    .element(container)
                    .append($compile('<mbl-html-container>' + obj.content + '</mbl-html-container>')($scope))
                    break;

                  case 'INPUT_CODE':
                    angular
                    .element(container)
                    .append($compile("<mbl-input-code data-id='" + obj.id + "' verifier='" + obj.verifier + "' success='" + obj.success + "' error='" + obj.error + "'></mbl-input-code>")($scope));
                    break;

                  case 'BUTTON':
                    angular
                    .element(container)
                    .append($compile("<mbl-action-button success='" + obj.success + "'>" + obj.content + "</mbl-action-button>")($scope));
                    break;

                  case 'IF_NEAR':
                    // HACK: force to startwatching after stopwatching event from headerservice
                    $timeout(function () {
                      GeoLocationService.startPositionWatching(station.coords);
                    }, 0);

                    angular
                    .element(container)
                    .append($compile("<mbl-trigger-near range='" + obj.range + "' fallback='" + obj.fallback + "' success='" + obj.success + "'></mbl-trigger-near>")($scope));

                    break;

                  case 'PHOTO_UPLOAD':
                    angular
                    .element(container)
                    .append($compile('<mbl-photo-upload data-id="' + obj.id + '" data-success="' + obj.success + '" data-content="' + obj.content + '"></mbl-photo-upload>')($scope));
                    break;

                  case 'SET_TIMEOUT':
                    angular
                    .element(container)
                    .append($compile('<mbl-set-timeout data-show="' + obj.show + '" data-delay="' + obj.delay + '" data-action="' + obj.action + '"></mbl-set-timeout>')($scope));
                    break;

                  case 'FREE_TEXT':
                    angular
                    .element(container)
                    .append($compile('<mbl-free-text-input data-success="' + obj.success + '" data-question="' + obj.question + '" data-id="' + obj.id + '"></mbl-free-text-input>')($scope));
                    break;

                  case 'CONFIRM_SOCIAL':
                    angular
                    .element(container)
                    .append($compile('<mbl-confirm-social data-success="' + obj.success + '" data-id="' + obj.id + '"></mbl-confirm-social>')($scope));
                    break;

                  case 'SHOW_SCORE':
                    angular
                    .element(container)
                    .append($compile('<mbl-show-score data-content="' + obj.content + '"></mbl-show-score>')($scope));
                    break;

                  default:
                    $log.error("Objecttype not known: " + type);
                    break;
                }
              }
            });
          }
        }
      });
  }


  /**
   * Rally-Directives trigger these actions
   *
   * @param actionString
   */
  function actionPerformed (actionString) {
    RallyService.performAction(actionString)
    .then(function (refresh) {
      if (refresh) {
        renderJSON();
      }
    }, function (error) {
      $log.error(error);
    });
  }

  function getPictureByHash (hash) {
    if ( hash != null ) {
      // suche in Bildliste nach Bild
      if ( typeof station.imageList[hash] != 'undefined' ) {
        return station.imageList[hash];
      }
    }

    return null;
  }


  /// events
  // ...

}
