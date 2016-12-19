angular
  .module('Mobidul')
  .controller('MapController', MapController);


MapController.$inject = [
  '$log', '$interval', '$timeout', '$q', '$translate',
  '$scope', '$rootScope', '$compile',
  '$state', 'StateManager',
  '$geolocation', '$mdDialog',
  'MapService', 'StationService', 'StationCreatorService',
  'LocalStorageService', 'RallyService', 'MobidulService'
];


function MapController (
  $log, $interval, $timeout, $q, $translate,
  $scope, $rootScope, $compile,
  $state, StateManager,
  $geolocation, $mdDialog,
  MapService, StationService, StationCreatorService,
  LocalStorageService, RallyService, MobidulService
)
{
  var map = this;

  // constants
  $scope._mobidulMapState       = 'mobidul.map';
  $scope._stationEditPlaceState = 'mobidul.station.edit.place';

  // vars
  $scope.isCordovaIos = isCordova && isIos;

  $scope.stations = [];
  $scope.mapZoom = parseInt(10, 10);;

  $scope.myPositionOpacity = 0;
  $scope.myPositionZIndex  = google.maps.Marker.MAX_ZINDEX + 1;
  $scope.myPositionIcon = {
    url    : 'assets/img/my_position_blue_flat.png',
    size   : [22, 22],
    anchor : [11, 11]
  };

  $scope.stationIconDisabled = {
    url: '../assets/img/marker_grey.png',
    size: [22, 40],
    scaledSize: [22, 40]
  };
  // $scope.marker = StationCreatorService.marker;

  $scope.options = {
    disableDefaultUI : true
  };

  $scope.accuracyRibbon = {
    show  : false,
    value : null
  };

  $scope.googleMap          = {};
  $scope.circleColor        = MapService.circleColor;
  $scope.myPosition         = null;
  $scope.searchingLocation  = false;
  $scope.centerToMyPosition = false;
  $scope.locationBlink      = false;
  $scope.setOriginMap       = false;

  $scope.infoWindow =
    new google.maps.InfoWindow( MapService.INFO_WINDOW_OPTIONS );

  // functions
  $scope.stationSelect    = stationSelect;
  $scope.goToStation      = goToStation;

  $scope.toggleMyPosition = toggleMyPosition;
  $scope.fitToMarkers     = fitToMarkers;
  $scope.dropMarker       = dropMarker;

  // events
  $scope.dragStart = dragStart;
  $scope.newStationDragend = newStationDragend;


  /// construct

  _init();


  /// private functions

  function _init () {
    // $log.debug('MapController init');
    // $log.debug('isNewStation : ' + map.isNewStation);
    LocalStorageService.init();

    _initDefaultValues();

    _watchMapCenter();


    _waitForGoogleMap().then(function () {
      MapService.clearWatch();

      _initWatchPosition();
    });


    _listenToOnDestroy();
  }


  function _initDefaultValues () {
    // $log.debug('init default values in MapController');

    $scope.isMobidulMap          = StateManager.isMobidulMap();
    $scope.isStationCreatorPlace = StateManager.isStationCreatorPlace();

    map.isNewStation =
      StateManager.state.params.stationCode === StateManager.NEW_STATION_CODE;
    map.changedMarkerManually = false;

    if ( $scope.isStationCreatorPlace ) {
      $scope.marker = StationCreatorService.marker;
      $scope.stations = StationCreatorService.markersAll;
    }

    $scope.mapCenterAttr = MapService.getDefaultCenterLat() + ', ' +
                           MapService.getDefaultCenterLng();
  }


  function _watchMapCenter () {
    $scope.$watch('map.center', function (newCenter, oldCenter) {
      // $log.debug('watched "map.center" callback : ');
      // $log.debug($scope.map.center);
      // $log.debug(newCenter);
      // $log.debug(oldCenter);

      // first time (init) nothing is passed
      if ( newCenter )
        $scope.mapCenterAttr = newCenter.lat() + ',' + newCenter.lng();

      // $log.debug($scope.mapCenterAttr);
    });
  }


  function _waitForGoogleMap () {
    var defer = $q.defer();

    $scope.$on('mapInitialized', function (event, map) {

        if ( $scope.isMobidulMap ) {
          // $log.debug('StateManager checked if isMobidulMap :');

          $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });

          MapService.startPollStations()
          .then(function () {
            // $log.debug('startPollStations callback :');

            _startPollStations();
          });
        } else if ( $scope.isStationCreatorPlace ) {
          // $log.debug('GoogleMaps ready for StationCreatorPlace');

          MapService.stopPollStations();

          _initStationCreatorMap();
        }

        defer.resolve();
      });

    return defer.promise;
  }


  function _initWatchPosition ()
  {
    // $log.debug('watchPosition in MapController : ');
    // $log.debug($scope.myPosition);

    if ( ! $scope.myPosition && LocalStorageService.shouldExplainGeoPermit() ) {
      var informAboutGeoPermitDialog =
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title($translate.instant('INFORMATION'))
          .textContent( $translate.instant('EXPLAIN_GENERIC_GEO_PERMIT') )
          .ariaLabel($translate.instant('INFORMATION'))
          .ok($translate.instant('OK'));

      $mdDialog.show( informAboutGeoPermitDialog )
        .then(function () {
          LocalStorageService.explainGeoPermit(false);

          _watchPosition();
        });
    } else {
      _watchPosition();
    }
  }


  function _watchPosition () {
    // NOTE: this is the javascript animation for the tracking control
    _startSignalGatheringPosition();

    var watchPositionId =
      navigator.geolocation.watchPosition(function (position) {
        // $log.debug('watchPosition in MapController callback :');
        // $log.debug(position);

        $scope.myPosition = position;

        _stopSignalGatheringPosition();
        _showMyPositionMarker();
        _showAccuracyRibbon();


        /// StationCreatorPlace
        if ( $scope.isStationCreatorPlace ) {
          if (
            ( map.isNewStation && ! map.changedMarkerManually ) ||
            StationCreatorService.marker.coords === null
          ) {
            StationCreatorService.marker.coords = position.coords;

            $scope.marker = StationCreatorService.marker;
          }

          fitToMarkers();
        }

        // $log.debug('centering to my position :');
        // $log.debug($scope.centerToMyPosition);

        if ( $scope.centerToMyPosition ) {
          var gmap = $scope.map;

          var myPositionCoords =
            new google.maps.LatLng( $scope.myPosition.coords.latitude,
                                    $scope.myPosition.coords.longitude );

          gmap.panTo( myPositionCoords );


          // if ( data.speed !== undefined )
          // {
          //     if ( data.speed < 7 )
          //     gmap.setZoom(16);
          //     else if ( data.speed < 15 )
          //         gmap.setZoom(15);
          //     else
          //         gmap.setZoom(13);
          // }
          // else
          //     gmap.setZoom(14);
        }
      },
      function (error) {
        $log.error('watchPosition error in MapController :');
        $log.error(error);

        // TODO: implement possibility for retries here as well !!!
        var retryPossible = false; // default : true
        var errorMessage  = $translate.instant('UNKNOWN_ERROR_MSG');

        switch ( error.code ) {
          case MapService.PERMISSION_DENIED:
            errorMessage = $translate.instant('PERMISSION_DENIED_MSG');
            retryPossible = false;
            break;

          case MapService.POSITION_UNAVAILABLE:
            errorMessage = $translate.instant('POSITION_UNAVAILABLE_MSG');
            break;

          case MapService.TIMEOUT:
            errorMessage = $translate.instant('TIMEOUT_MSG');
            break;

          default : break;
        }


        if ( retryPossible ) {
          var positionErrorDialog =
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('POSITION_ERROR_TITLE'))
              .textContent(errorMessage)
              .ariaLabel($translate.instant('POSITION_ERROR_TITLE'))
              .ok($translate.instant('TRY AGAIN'))
              .cancel($translate.instant('BACK_TO_MOBIDULS'));

          $mdDialog.show( positionErrorDialog )
            .then(function () {
              home.getMyPosition()
                .then(function (position) {
                  _switchSearchType();
                });

            }, function () {
              home.searchTypeIndex = MapService.ALL_MOBIDULE;
            });
        } else {
          var positionErrorDialog2 =
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .title($translate.instant('POSITION_ERROR_TITLE'))
              .textContent(errorMessage)
              .ariaLabel($translate.instant('POSITION_ERROR_TITLE'))
              .ok($translate.instant('TO_MAP'));

          // TODO: Implement functionality if error happens.
          // $mdDialog.show(positionErrorDialog2)
          //   .then(function () {
          //     // ...
          //   });
        }

        _stopSignalGatheringPosition();
        _hideMyPositionMarker();
        _hideAccuracyRibbon();
      }, {
        timeout           : 5000,  // ms
        maximumAge        : 10000, // ms
        enableHighAccuracy : true
      });

    MapService.watchPositionId = watchPositionId;
  }


  function _startSignalGatheringPosition () {
    var promise = $interval(function () {
      $scope.locationBlink = ! $scope.locationBlink;
    }, 600);

    MapService.setGatheringPositionIntervalPromise(promise);
  }


  function _stopSignalGatheringPosition () {
    MapService.cancelGatheringPositionInterval();

    $scope.locationBlink = false;
  }


  function _showMyPositionMarker () {
    var myPositionAnimationInterval = $interval(function () {
      $scope.myPositionOpacity += 0.2;

      if ( $scope.myPositionOpacity >= 1 ) {
        $scope.myPositionOpacity = 1;
        $interval.cancel(myPositionAnimationInterval);
      }
    }, 40);
  }

  function _hideMyPositionMarker () {
    var myPositionAnimationInterval = $interval(function () {
      $scope.myPositionOpacity -= 0.2;

      if ( $scope.myPositionOpacity <= 0 ) {
        $scope.myPositionOpacity = 0;
        $interval.cancel( myPositionAnimationInterval );
      }
    }, 40);
  }


  function _showAccuracyRibbon () {
    $scope.$apply(function () {
      $scope.accuracyRibbon.value =
        Math.round($scope.myPosition.coords.accuracy);

      $scope.accuracyRibbon.show  = true;
    });
  }


  function _hideAccuracyRibbon () {
    $scope.$apply(function () {
      $scope.accuracyRibbon.value = null;
      $scope.accuracyRibbon.show  = false;
    });
  }


  function _listenToOnDestroy () {
    $scope.$on('$destroy', function () {
      // $log.debug('MapController $destroy :');

      MapService.lastCenter = {};
      MapService.lastCenter.latitude  = $scope.map.getCenter().lat();
      MapService.lastCenter.longitude = $scope.map.getCenter().lng();

      MapService.lastZoom = $scope.map.getZoom();

      MapService.stopPollStations();
      MapService.clearWatch();

      // $log.debug(MapService.lastCenter);
      // $log.debug(MapService.lastZoom);
    });
  }


  function _startPollStations () {
    var promise =
      $interval(function () {
        // $log.debug('$interval for loadStations');

        _loadStations();

      }, 5000);

    MapService.setPollStationsIntervalPromise( promise );

    _loadStations();
  }


  function _initOriginMap () {
    // $log.debug('init origin map');
    // $log.debug('Map is first load : ' + MapService.firstLoad);

    var gmap = $scope.map;


    if ( MapService.firstLoad ) {
      if ( $scope.stations.length ) {
        fitToMarkers();
      } else {
        toggleMyPosition();
      }

      MapService.firstLoad = false;
    } else if ( ! $scope.setOriginMap ) {
      // $log.debug('second map load, load last center coords and zoom');
      // $log.debug($scope.map);
      // $log.debug($scope.map.center);
      // $log.debug($scope.mapCenterAttr);
      // $log.debug($scope.mapZoom);
      // $log.debug(MapService.lastCenter);
      // $log.debug(MapService.lastZoom);


      var lastCenter =
        new google.maps.LatLng( MapService.lastCenter.latitude,
                                MapService.lastCenter.longitude );

      // $log.debug('lastZoom : ' + lastZoom);
      // $log.debug(lastZoom);

      gmap.setCenter( lastCenter );
      gmap.setZoom( MapService.lastZoom );
    }

    $scope.setOriginMap = true;
  }


  function _initStationCreatorMap () {
    // $log.debug('init station creator map');
    // $log.debug('(not doing anything)');

    // $scope.centerToMyPosition = true;
  }


  /// public functions

  function stationSelect (event, marker) {
    // $log.debug('Station select on MapController:');
    // $log.debug(event);
    // $log.debug(marker);

    // show info window for this marker
    var center = new google.maps.LatLng(marker.latitude, marker.longitude);
    var html = (
      '<div id="infoWindowBody">' +
        '<button class="md-button"' +
          ' ng-click="goToStation(\'' + marker.id + '\')">' +
          '<span>' + marker.name + '</span>' +
        '</button>' +
      '</div>'
    );

    $scope.infoWindow.setContent(html);
    $scope.infoWindow.setPosition(center);
    $scope.infoWindow.open($scope.map);

    // NOTE: really interesting thing happening here
    $scope.$apply(function() {
      var infoWindowBody = document.getElementById('infoWindowBody');
      $compile(infoWindowBody)($scope);
    });
  }


  function goToStation (stationCode) {
    // $log.debug('go to station');

    // var stationCode = marker.id;
    // $log.debug(stationCode);

    var mobidulCode = StateManager.state.params.mobidulCode;
    // $log.debug(mobidulCode);

    var routeParams = {
      mobidulCode : mobidulCode,
      stationCode : stationCode
    };

    $state.go('mobidul.station', routeParams);
  }


  function toggleMyPosition () {
    $scope.centerToMyPosition = ! $scope.centerToMyPosition;

    if ( $scope.myPosition         &&
         $scope.myPosition.coords  &&
         $scope.centerToMyPosition
    ) {
      var gmap = $scope.map;

      var myPositionCoords =
        new google.maps.LatLng( $scope.myPosition.coords.latitude,
                                $scope.myPosition.coords.longitude );


      gmap.panTo( myPositionCoords );


      if ( $scope.myPosition.coords.speed !== undefined ) {
          if ( $scope.myPosition.coords.speed < 7 ) {
            gmap.setZoom(17);
          } else if ( $scope.myPosition.coords.speed < 15 ) {
            gmap.setZoom(15);
          } else {
            gmap.setZoom(14);
          }
      } else {
        gmap.setZoom(14);
      }
    }

    // close the info window
    $scope.infoWindow.close();
  }


  function fitToMarkers ()
  {
    // $log.debug('fitToMarkers');

    $scope.centerToMyPosition = false;

    var gmap = $scope.map;


    /// MobidulMap
    if ( $scope.isMobidulMap ) {
      // $log.debug('isMobidulMap');

      var bounds = new google.maps.LatLngBounds();

      for ( var i = 0; i < $scope.stations.length; i++ ) {
        bounds.extend(
          new google.maps.LatLng( $scope.stations[ i ].latitude,
                                  $scope.stations[ i ].longitude ) );
      }

      $timeout(function () {
        gmap.fitBounds( bounds );
        gmap.panTo( bounds.getCenter() );
      }, 0);

      // set a minimum zoom
      if ( gmap.getZoom() > 15 ) {
        gmap.setZoom(15);
      }
    }


    /// StationCreatorPlace
    if ( $scope.isStationCreatorPlace ) {
      // $log.debug('isStationCreatorPlace');

      var newStationPosition =
        new google.maps.LatLng( StationCreatorService.marker.coords.latitude,
                                StationCreatorService.marker.coords.longitude );

      gmap.panTo( newStationPosition );

      // set a minimum zoom
      if ( gmap.getZoom() > 17 )
        gmap.setZoom(17);
    }


    // remove one zoom level to ensure no marker is on the edge.
    $timeout(function () {
      gmap.setZoom( gmap.getZoom() );
    }, 0);


    // close the info window
    $scope.infoWindow.close();
  }


  function dropMarker () {
    // $log.debug('dropMarker');

    var markerCoords =
    {
      latitude  : $scope.map.center.lat(),
      longitude : $scope.map.center.lng()
    };
    // $log.debug(markerCoords);

    $scope.marker.coords         = markerCoords;
    StationCreatorService.marker.coords = markerCoords;

    map.changedMarkerManually = true;
  }


  function _loadStations () {
    var mobidulCode = StateManager.state.params.mobidulCode;

    MobidulService.getMobidulConfig(mobidulCode)
    .then(function(config){

      MobidulService.getProgress(mobidulCode)
      .then(function(progress){

        StationService.getMapStations( mobidulCode )
        .success(function (stations, status, headers) {
          // $log.debug('Map Stations response success :');
          // $log.debug(stations);

          RallyService.refresh();

          // init map stations empty array
          $scope.stations = [];

          angular.forEach( stations, function (station, key) {
            // HACK show latest station by station order
            // TODO sort zIndex beforehand !
            $scope.markerLastZIndex++;
            if ( $scope.markerLastZIndex <= google.maps.Marker.MAX_ZINDEX ) {
              $scope.markerLastZIndex = google.maps.Marker.MAX_ZINDEX + 1;
            }

            var stationData =
            {
              id         : station.code,
              latitude   : station.lat,
              longitude  : station.lon,
              name       : station.name,

              // NOTE not even using zIndex prop
              // zindex     : $scope.markerLastZIndex,

              order      : station.order,
            };

            if ( ! config.hiddenStations ) {
              stationData.isEligible = true;
            } else {
              stationData.isEligible = stationData.order <= progress.progress;
            }

            // NOTE not eligible stations also get pushed
            $scope.stations.push(stationData);


            // var stationMarkerData = {
            //   code     : station.code,
            //   title    : station.name,
            //   position : new google.maps.LatLng( station.lat, station.lng )
            // };
            //
            // var stationMarker = new google.maps.Marker( stationMarkerData );
            //
            // $scope.markers.push(stationMarker);
          });
        })
        .error(function (response, status, headers, config, statusText) {
          $log.error(response);
          $log.error(status);
        })
        .then(function (stations) {
          _initOriginMap();
        });
      });
    });
  }


  /// events

  function dragStart () {
    $scope.centerToMyPosition = false;
  }


  function newStationDragend (event) {
    // $log.debug('marker position has changed :');
    // $log.debug(event);

    var newStationPosition = event.latLng;
    // $log.debug(newStationPosition);

    $scope.marker.coords.latitude  = newStationPosition.lat();
    $scope.marker.coords.longitude = newStationPosition.lng();

    StationCreatorService.marker.coords = $scope.marker.coords;

    map.changedMarkerManually = true;
  }
}
