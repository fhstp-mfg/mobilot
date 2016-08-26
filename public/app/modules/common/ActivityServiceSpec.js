describe('ActivityService', function () {

  var ActivityService, mockStateManager, $log, $httpBackend, $interval;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(function () {

    mockStateManager = {
      getParams: function(){
        return {
          mobidulCode: 'mobidulCode'
        };
      }
    };

    module(function ( $provide ) {
      $provide.value('StateManager', mockStateManager);
    });
  });

  beforeEach(inject(function($injector){
    ActivityService = $injector.get('ActivityService');
    $log = $injector.get('$log');
    $httpBackend = $injector.get('$httpBackend');
    $interval = $injector.get('$interval');
  }));


  it('should exist', function () {
    expect(ActivityService).toBeDefined();
  });

  describe('.commitActivity()', function () {

    it('should exist', function () {
      expect(ActivityService.commitActivity).toBeDefined();
    });

    it('should push an activity to the storage and return true', function () {

      var activity = {
        type: ActivityService.TYPES.APP_EVENT,
        name: ActivityService.APP_EVENTS.USER_POSITION,
        payload: {
          foo: 'bar'
        }
      };

      var respond = ActivityService.commitActivity(activity);

      expect(ActivityService._activityStore.pop().payload.foo == 'bar' && respond).toBeTruthy();
    });

    it('should return false and log an error if activity is incorrect', function () {

      var activity = {
        type: ActivityService.TYPES.APP_EVENT,
        name: 'wrong name',
        payload: {
          foo: 'bar'
        }
      };

      $log.reset();

      var respond = ActivityService.commitActivity(activity);

      expect( ! respond && $log.error.logs[0]).toBeTruthy();

    });

  });

  describe('.pushActivity()', function () {

    beforeEach(function () {

      $httpBackend.expectPOST('/mobidulCode/PushActivity', '[{"type":"APP_EVENT","name":"USER_POSITION","payload":{"foo":"bar"}}]')
      .respond(200, {
        success: true
      });

      var activity = {
        type: ActivityService.TYPES.APP_EVENT,
        name: ActivityService.APP_EVENTS.USER_POSITION,
        payload: {
          foo: 'bar'
        }
      };

      ActivityService.commitActivity(activity);
    });

    it('should exist', function () {
     expect(ActivityService.pushActivity).toBeDefined();
    });

    it('should return a success promise', function () {
      ActivityService.pushActivity()
      .then(function ( response ) {
        expect(response.success).toBe(true);
      });

      $httpBackend.flush();
    });

    it('should clear the activity storage', function () {

      ActivityService.pushActivity()
      .then(function(){
        expect(ActivityService._activityStore[0]).not.toBeDefined();
      });

      $httpBackend.flush();
    });

  });

  describe('.startPushInterval()', function () {

    beforeEach(function () {

      $httpBackend.whenPOST('/mobidulCode/PushActivity')
      .respond(200, {
        success: true
      });

      var activity = {
        type: ActivityService.TYPES.APP_EVENT,
        name: ActivityService.APP_EVENTS.USER_POSITION,
        payload: {
          foo: 'bar'
        }
      };

      ActivityService.commitActivity(activity);
    });

    it('should exist', function () {
      expect(ActivityService.startPushInterval).toBeDefined();
    });

    it('should start an interval that calls pushActivity()', function () {
      spyOn(ActivityService, 'pushActivity').and.callThrough();

      ActivityService.startPushInterval();

      $interval.flush(ActivityService.PUSH_INTERVAL);

      expect(ActivityService.pushActivity).toHaveBeenCalled();
      $httpBackend.flush();
    });

  });

  describe('.stopPushInterval()', function () {

    beforeEach(function () {

      $httpBackend.whenPOST('/mobidulCode/PushActivity')
      .respond(200, {
        success: true
      });

      var activity = {
        type: ActivityService.TYPES.APP_EVENT,
        name: ActivityService.APP_EVENTS.USER_POSITION,
        payload: {
          foo: 'bar'
        }
      };

      ActivityService.commitActivity(activity);

      ActivityService.startPushInterval();

      spyOn(ActivityService, 'pushActivity').and.callThrough();

    });

    it('should exist', function () {
      expect(ActivityService.stopPushInterval).toBeDefined();
    });

    it('should call pushActivity() one last time', function () {
      ActivityService.stopPushInterval();
      expect(ActivityService.pushActivity).toHaveBeenCalled();
      $httpBackend.flush();
    });

    it('should cancel the interval', function () {

      ActivityService.stopPushInterval();

      $interval.flush(ActivityService.PUSH_INTERVAL);

      //called times 2 because the function calls it once as well
      expect(ActivityService.pushActivity).not.toHaveBeenCalledTimes(2);
    })

  });

});