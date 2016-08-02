describe('AttachmentService', function () {
  var AttachmentService, $httpBackend;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(inject(function ($injector) {
    AttachmentService = $injector.get('AttachmentService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should exist', function () {
    expect(AttachmentService).toBeDefined();
  });

  describe('.saveTextInput()', function () {

    it('should exist', function () {
      expect(AttachmentService.saveTextInput).toBeDefined();
    });

    it('should make a successful http request to save the text', function () {

      $httpBackend.expectPOST('/mobidulCode/stationCode/saveText/abc-123', '{"payload":{"text":"test text"}}')
      .respond(200, {
        success: true
      });

      AttachmentService.saveTextInput('test text', 'mobidulCode', 'stationCode', 'abc-123')
      .then(function (response) {
        expect(response.success).toBe(true);
      });

      $httpBackend.flush();
    });
  });

  describe('.exportTextsFromComponent()', function () {

    it('should exist', function () {
      expect(AttachmentService.exportTextsFromComponent).toBeDefined();
    });

    it('should return the expected number of attachments and empty to be false', function () {
      $httpBackend.expectGET('/mobidulCode/stationCode/exportTexts/abc-123')
      .respond(200, {
        empty: false,
        attachments: [
          {
            payload:'"{"text":"first"}'
          },
          {
            payload:'"{"text":"second"}'
          },
          {
            payload:'"{"text":"third"}'
          }
        ]
      });

      AttachmentService.exportTextsFromComponent('mobidulCode', 'stationCode', 'abc-123')
      .then(function (response) {
        expect(response.attachments.length == 3 && ! response.empty).toBeTruthy();
      });

      $httpBackend.flush();
    });

    it('should return an empty array and empty to be true if there are no attachments', function () {
      $httpBackend.expectGET('/mobidulCode/stationCode/exportTexts/def-456')
      .respond(200, {
        empty: true,
        attachments: []
      });

      AttachmentService.exportTextsFromComponent('mobidulCode', 'stationCode', 'def-456')
      .then(function (response) {
        expect(response.attachments.length == 0 && response.empty).toBeTruthy();
      });

      $httpBackend.flush();
    });

  });

  describe('.exportPicturesOfComponent()', function () {

    it('should exist', function () {
      expect(AttachmentService.exportPicturesFromComponent).toBeDefined();
    });

    it('should download the export zip if pictures exist', function () {

      $httpBackend.expectGET('/stationCode/exportImages/abc-123')
      .respond(200, {
        empty: false,
        url:'export/abc-123.zip'
      });

      spyOn(AttachmentService, 'startDownloadFromUrl');

      AttachmentService.exportPicturesFromComponent('stationCode', 'abc-123')
      .then(function () {
        expect(AttachmentService.startDownloadFromUrl).toHaveBeenCalled();
      });

      $httpBackend.flush();

    });

    it('should show a dialog if there are no pictures', function () {
      $httpBackend.expectGET('/stationCode/exportImages/def-456')
      .respond(200, {
        empty: true
      });


      AttachmentService.exportPicturesFromComponent('stationCode', 'def-456')
      .then(function () {
        expect(angular.element(document).find('.md-dialog-container').length).toBe(1);
      });

      $httpBackend.flush();

    });

  });



});