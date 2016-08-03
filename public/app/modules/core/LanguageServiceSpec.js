describe('LanguageService', function () {
  var LanguageService, $log;

  beforeEach(angular.mock.module('Mobilot'));

  beforeEach(inject(function ($injector) {
    LanguageService = $injector.get('LanguageService');
    $log = $injector.get('$log');
  }));

  it('should exist', function () {
    expect(LanguageService).toBeDefined();
  });

  describe('.getCurrentLanguage()', function () {
    
    it('should exist', function () {
      expect(LanguageService.getCurrentLanguage).toBeDefined();
    });

    it('should return en_US if set to english', function () {
      LanguageService.switchLanguage(LanguageService.LANGUAGES.ENGLISH);
      expect(LanguageService.getCurrentLanguage()).toEqual('en_US');
    });
    
  });
  
  describe('.switchLanguage()', function () {

    it('should exist', function () {
      expect(LanguageService.switchLanguage).toBeDefined();
    });

    it('should change the current language to english if called correctly', function () {
      var english = LanguageService.LANGUAGES.ENGLISH;
      LanguageService.switchLanguage(english);
      expect(LanguageService.getCurrentLanguage()).toEqual(english);
    });

    it('should log an error if the language is not known and don\'t change anything', function () {
      var fooLanguage = 'foo_BAR';

      $log.reset();

      LanguageService.switchLanguage(fooLanguage);

      expect(LanguageService.getCurrentLanguage() != fooLanguage && $log.error.logs[0]).toBeTruthy();
    })

  });

});