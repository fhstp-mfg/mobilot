describe('UserService', function () {
  var UserService, HeaderService,
      $httpBackend;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(inject(function ( $injector ) {
    UserService = $injector.get('UserService');
    HeaderService = $injector.get('HeaderService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should exist', function () {
    expect(UserService).toBeDefined();
  });

  describe('.restoreUserRole()', function () {

    it('should exist', function () {
      expect(UserService.restoreUserRole).toBeDefined();
    });

    describe('success', function () {

      beforeEach(function () {
        $httpBackend.expectGET('/RoleForMobidul/TestMobidul')
        .respond(200, {
          role: 1
        });
      });

      it('should set role, Permit and currentMobidul', function () {

        UserService.restoreUserRole('TestMobidul')
        .then(function () {
          expect(UserService.Session.role).toEqual(1);
          expect(UserService.Permit.RequestAllStations).toEqual(true);
          expect(UserService.currentMobidul).toBe('TestMobidul');
        });

        $httpBackend.flush();

      });

      it('should call HeaderService.refreshHeader() once its finished', function () {

        spyOn(HeaderService, 'refresh');

        UserService.restoreUserRole('TestMobidul')
        .then(function () {
          expect(HeaderService.refresh).toHaveBeenCalled();
        });

        $httpBackend.flush();

      });

    });

    describe('error', function () {

      it('should return an error if no role comes back from backend', function () {

        $httpBackend.expectGET('/RoleForMobidul/NoRoleMobidul')
        .respond(200, {});

        UserService.restoreUserRole('NoRoleMobidul')
        .then(function(role){
        }, function (error) {
          expect(error).toBeDefined();
        });

        $httpBackend.flush();

      });
    });
  });
});