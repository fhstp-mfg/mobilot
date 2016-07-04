angular
  .module('Mobidul')
  .controller('MapController', MapController);


MapController.$inject = [
  '$log', '$interval',
  '$scope', '$rootScope',
  '$state', 'StateManager',
  '$geolocation', /*'uiGmapGoogleMapApi', 'uiGmapIsReady',*/
  'MapService', 'StationService', 'StationCreatorService'
];


function MapController (
  $log, $interval,
  $scope, $rootScope,
  $state, StateManager,
  $geolocation, /*uiGmapGoogleMapApi, uiGmapIsReady,*/
  MapService, StationService, StationCreatorService
)
{
  var map = this;

  // constants
  map._mobidulMapState       = 'mobidul.map';
  map._stationEditPlaceState = 'mobidul.station.edit.place';

  // vars
  map.stations = [];

  map.data =
  {
    center :
    {
      latitude  : 48.24935983096312,
      longitude : 15.759132385253922
    },
    zoom: 8
  };
  map.data.centerAttr = map.data.center.latitude + ', ' +
                        map.data.center.longitude;


  map.options = {
    disableDefaultUI : true
  };

    map.googleMap          = {};
  // TODO - check if this would be better as null
  map.myPosition         = null;
  map.showMyPosition     = false;
  map.circleColor        = MapService.circleColor;
  map.centerToMyPosition = false;

  map.window =
  {
    show        : false,
    coords      : {},
    stationCode : '',
    stationName : '',
    options :
    {
        pixelOffset : { height : -35, width : 0 },
        show : true
    }
  };
  map.window.templateUrl = 'app/modules/common/InfoWindowPartial.html';

  map.marker = StationCreatorService.marker;

  map.events =
  {
    dragstart   : function ()
    {
      map.centerToMyPosition = false;
    },
    dragend     : function ()
    {
    // ...
    },
    zoomchanged : function ()
    {
      // TODO: Grischa will ja immer dass man sich merkt wo man grade steht wenn man zurück zur map kommt.
    }
  };

  // functions
  map.stationSelect      = stationSelect;
  map.goToStation        = goToStation;
  map.closeWindow        = closeWindow;

  map.toggleMyPosition   = toggleMyPosition;
  map.fitToMarkers       = fitToMarkers;
  map.dropMarker         = dropMarker;

  map.loadStations       = loadStations;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    $log.debug('MapController init');


    _waitForGoogleMapApi();
    _waitForGoogleMap();


    MapService.clearWatch();

    _watchPosition();


    _listenToOnDestroy();
  }


  function _waitForGoogleMapApi ()
  {
    /*uiGmapGoogleMapApi.then(function (maps)
    {
      // $log.debug('GoogleMaps API ready');
    });*/
  }


  function _waitForGoogleMap ()
  {
    /*uiGmapIsReady
      .promise(1)
      .then(function (instances)
      {*/
        $log.debug('uiGmapIsReady callback');
        // $log.debug(instances);
        $log.debug('isMobidulMap : ' + StateManager.isMobidulMap() );
        $log.debug('isStationCreatorPlace : ' + StateManager.isStationCreatorPlace() );


        if ( StateManager.isMobidulMap() )
        {
          // $log.debug('StateManager checked if isMobidulMap :');

          $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });

          MapService
            .startPollStations()
            .then(function ()
            {
              $log.debug('startPollStations callback :');

              _startPollStations();
            });
        }

        if ( StateManager.isStationCreatorPlace() )
        {
          $log.debug('uiGmapIsReady for StationCreator Place Map');

          MapService.stopPollStations();
        }
      /*});*/
  }


  function _watchPosition ()
  {
    MapService
      .watchPosition()
      .then(function (position)
      {
        map.myPosition = position;


        // NOTE - this should only work on the station creator place view
        // if ( StateManager.isStationCreatorPlace() )
        //
        //   map.marker.coords = position.coords;

        // StationCreatorService.marker.coords = position.coords;


        if ( StationCreatorService.marker.coords === null )
        {
          StationCreatorService.marker.coords = position.coords;

          map.marker = StationCreatorService.marker;
        }



        if ( map.centerToMyPosition )
        {
          map.data.center = position.coords;

          var gmap = map.googleMap.getGMap();
          $log.debug('center to my position :');
          $log.debug(gmap);

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
      });

    map.showMyPosition = true;
  }


  function _listenToOnDestroy ()
  {
    $scope.$on('$destroy', function ()
    {
      $log.debug('MapController $destroy');

      MapService.stopPollStations();
      MapService.clearWatch();
    });
  }


  function _startPollStations ()
  {
    var promise =
      $interval(function () {
        $log.debug('$interval for loadStations');

        map.loadStations();
      }, 5000);

    MapService.setPollStationsIntervalPromise( promise );

    map.loadStations();
  }


  /// public functions

  function stationSelect (instance, event, marker)
  {
    // $log.debug('station select');

    map.window =
    {
      show : true,
      coords :
      {
        latitude  : marker.latitude,
        longitude : marker.longitude
      }
    };

    map.window.options =
    {
      pixelOffset : { height : -35, width : 0 },
      show : true
    };

    map.window.templateUrl = 'app/modules/common/InfoWindowPartial.html';
    map.window.templateParameter =
    {
      stationCode : marker.id,
      stationName : marker.name
    };
  }


  function goToStation (stationCode)
  {
    // $log.debug('go to station');
    // $log.debug(stationCode);

    var mobidulCode = StateManager.state.params.mobidulCode;
    $log.debug(mobidulCode);

    var routeParams =
    {
      mobidulCode : mobidulCode,
      stationCode : stationCode
    };

    $state.go('mobidul.station', routeParams);
  }


  function closeWindow ()
  {
    // $log.debug("closing Window");
    map.window.show = false;
  }


  function toggleMyPosition ()
  {
    map.centerToMyPosition = ! map.centerToMyPosition;

    if ( map.myPosition )
    {
      if ( map.centerToMyPosition && map.myPosition.coords !== undefined )
      {
        map.data.center =
        {
          latitude  : map.myPosition.coords.latitude,
          longitude : map.myPosition.coords.longitude
        };

        map.data.centerAttr = map.data.center.latitude + ', ' +
                              map.data.center.longitude;


        var gmap = map.googleMap.getGMap();

        if ( map.myPosition.coords.speed !== undefined )
        {
          if ( map.myPosition.coords.speed < 7 )
            gmap.setZoom(16);
          else if ( map.myPosition.coords.speed < 15 )
            gmap.setZoom(15);
          else
            gmap.setZoom(14);
        }
        else
          gmap.setZoom(14);


          map.locationIcon = 'my_location';
      }
      else
        map.locationIcon = 'location_disabled';
    }
  }


  function fitToMarkers ()
  {
    map.centerToMyPosition = false;

    var gmap   = map.googleMap.getGMap();
    var bounds = new google.maps.LatLngBounds();


    for ( var i = 0; i < map.stations.length; i++ )
    {
      bounds.extend(
        new google.maps.LatLng( map.stations[ i ].latitude,
                                map.stations[ i ].longitude ) );
    }

    if ( StationCreatorService.marker.coords !== null )
    {
      bounds.extend(
        new google.maps.LatLng( StationCreatorService.marker.coords.latitude,
                                StationCreatorService.marker.coords.longitude ) );
    }


    gmap.setCenter( bounds.getCenter() );
    gmap.fitBounds( bounds );
    //remove one zoom level to ensure no marker is on the edge.
    gmap.setZoom( gmap.getZoom() );

    // set a minimum zoom
    // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
    if ( gmap.getZoom() > 15 )
        gmap.setZoom(15);
  }


  function dropMarker ()
  {
    // var mapDataCenter = Object.create( map.data.center );
    //
    // map.marker.coords = mapDataCenter;

    map.marker.coords = angular.copy( map.data.center );
  }


  function loadStations ()
  {
    var mobidulCode = StateManager.state.params.mobidulCode;

    StationService
      .getMapStations( mobidulCode )
      .success(function (stations, status, headers, config, statusText)
      {
        $log.debug('Map Stations response success :');
        $log.debug(stations);

        // init map stations empty array
        map.stations = [];

        // add and filter response stations
        angular.forEach( stations, function (station, key)
        {
          var mapStation =
          {
            id        : station.code,
            latitude  : station.lat,
            longitude : station.lon,
            name      : station.name
          };


          // NOTE stations must pass some criteria for different mobidul types
          // e.g. for a "rally" the station must either be completed or the
          // currently activated station, in order to be eligible.
          var isEligible = false;


          // finally push station to map stations obj, if eligible
          if ( isEligible )
            map.stations.push(mapStation);
        });
      })
      .error(function (response, status, headers, config, statusText)
      {
        $log.error(response);
        $log.error(status);
      });
  }
}
