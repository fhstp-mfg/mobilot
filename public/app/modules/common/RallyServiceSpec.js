describe('RallyService', function () {
  var RallyService, mockStateParams, mockMobidulService, $q, $scope;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(function () {
    mockStateParams = {
      mobidulCode: 'rally'
    };

    module(function ( $provide ) {
      $provide.value('$stateParams', mockStateParams);
    });

    mockMobidulService = {
      getMobidulConfig: function (code) {
        var deferred = $q.defer();
        if (code == 'rally') {
          deferred.resolve({mode: 'rally', hiddenStations: true});
        } else {
          deferred.resolve({mode: 'default', hiddenStations: false});
        }
        return deferred.promise;
      },
      getProgress: function(){
        var deferred = $q.defer();
        deferred.resolve({progress: 2});
        return deferred.promise;
      }
    };

    module(function ( $provide ) {
      $provide.value('MobidulService', mockMobidulService);
    });
  });

  beforeEach(inject(function ($injector) {
    RallyService  = $injector.get('RallyService');
    $q = $injector.get('$q');
    $scope = $injector.get('$rootScope').$new();
  }));

  it('should exist', function () {
    expect(RallyService).toBeDefined();
  });


  describe('.filterStations()', function () {
    var station, stations;

    beforeEach(function () {
      station = [
        {
          order: 0
        }
      ];
      stations = [
        {
          order: 0
        },
        {
          order: 1
        },
        {
          order: 2
        },
        {
          order: 3
        },
        {
          order: 4
        },
      ];
    });

    it('should exist', function () {
      expect(RallyService.filterStations).toBeDefined();
    });

    it('should return the station if length == 1', function () {
      RallyService.filterStations(station)
      .then(function ( filtered ) {
        expect(filtered).toBe(station);
      });

      $scope.$digest();

    });

    it('should return the filtered list for hiddenStation mobiduls', function () {

      RallyService.filterStations(stations)
      .then(function ( filtered ) {
        expect(filtered.length).toBe(3);
      });

      $scope.$digest();

    });

    it('should return all stations for ! hiddenStation mobiduls', function () {

      mockStateParams.mobidulCode = 'default';

      RallyService.filterStations(stations)
      .then(function (list) {
        expect(list.length).toBe(5);
      });

      $scope.$digest();

    });

  });

});