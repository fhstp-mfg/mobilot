describe('MobidulService', function () {
  var MobidulService, $httpBackend;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(inject(function ($injector) {
    MobidulService = $injector.get('MobidulService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  describe('.getMobidulMode()', function () {

    it('should exist', function () {
      expect(MobidulService.getMobidulMode).toBeDefined();
    });

    it('should return "rally" for a rally mobidul', function () {

      $httpBackend.expectGET('/rallyMobidul/getConfig')
      .respond(200, {
        mode: 'rally'
      });

      MobidulService.getMobidulMode('rallyMobidul')
      .then(function (mode) {
        expect(mode).toEqual('rally');
      });

      $httpBackend.flush();
    });

  });

});