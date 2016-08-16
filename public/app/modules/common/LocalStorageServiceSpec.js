describe('LocationService', function () {
  var LocalStorageService, $rootScope, $timeout, $q, $localStorage;

  beforeEach(angular.mock.module('Mobidul'));

  beforeEach(inject(function ( $injector ) {
    LocalStorageService = $injector.get('LocalStorageService');
    $rootScope = $injector.get('$rootScope').$new();
    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');
    $localStorage = $injector.get('$localStorage');
  }));

  it('should exist', function () {
    expect(LocalStorageService).toBeDefined();
  });

  describe('.getValue()', function (  ) {

    it('should exist', function(){
      expect(LocalStorageService.getValue).toBeDefined();
    });

    it('should return the correct value from localstorage', function (done) {
      var testKey = Math.random().toString(36).substring(7),
          testValue = Math.random().toString(36).substring(7);

      $localStorage[testKey] = testValue;

      LocalStorageService.getValue(testKey).then(function ( value ) {
        expect(value).toBe(testValue);
      })
      .finally(done);

      $timeout.flush();
    });
  });

  describe('.setValue()', function () {

    it('should exist', function () {
      expect(LocalStorageService.setValue).toBeDefined();
    });

    it('should save the value with according key', function () {

      var testKey = Math.random().toString(36).substring(7),
        testValue = Math.random().toString(36).substring(7);

      LocalStorageService.setValue(testKey, testValue)
      .then(function (value) {
        expect(value).toEqual(testValue);
      });

      $timeout.flush();
    });
  });

  describe('.increaseScore()', function () {

    it('should increase the score by 10', function () {

      var mobidulCode = Math.random().toString(36).substring(7);

      LocalStorageService.getProgress(mobidulCode, ['open'])
      .then(function ( progress ) {

        LocalStorageService.increaseScore(mobidulCode, 10)
        .then(function ( newScore ) {
          expect(newScore).toEqual(10);
        });
      });

      $timeout.flush();
    });

  });

});