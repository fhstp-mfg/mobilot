describe('MobidulService', function () {
  var MobidulService, $httpBackend;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(inject(function ($injector) {
    MobidulService = $injector.get('MobidulService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function () {
    $httpBackend.expectGET('/rallyMobidul/getConfig')
    .respond(200, {
      mode: 'rally'
    });
  });

  describe('.getMobidulMode()', function () {

    it('should exist', function () {
      expect(MobidulService.getMobidulMode).toBeDefined();
    });

    it('should return "rally" for a rally mobidul', function () {

      MobidulService.getMobidulMode('rallyMobidul')
      .then(function (mode) {
        expect(mode).toEqual('rally');
      });

      $httpBackend.flush();
    });
  });

  describe('.getMobidulConfig()', function () {

    it('should exist', function () {
      expect(MobidulService.getMobidulConfig).toBeDefined();
    });

    it('should return the correct config', function () {

      MobidulService.getMobidulConfig('rallyMobidul')
      .then(function (config) {
        expect(config.name).toBe('rally');
        expect(config.states.length).toBe(3);
        expect(config.defaultState).toBe('ACTIVATED');
        expect(config.hiddenStations).toBe(true);
      });

      $httpBackend.flush();
    });
  });

  describe('.getProgress()', function () {

    it('should exist', function () {
      expect(MobidulService.getProgress).toBeDefined();
    });


  });

});