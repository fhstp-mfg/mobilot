///////////////////
///// MOBILOT /////
///////////////////

angular
  .module('Mobilot')
  .config([   '$logProvider', '$stateProvider', '$urlRouterProvider', '$translateProvider',
    function ( $logProvider,   $stateProvider,   $urlRouterProvider,   $translateProvider )
    {
      /// debugging
      var isDeveloperEnv = document.location.hostname != 'mobilot.at';
      console.info('Debugging: ' + isDeveloperEnv);

      $logProvider.debugEnabled( isDeveloperEnv );


      // Language Settings
      $translateProvider.useStaticFilesLoader({
        prefix: 'assets/lang/lang-',
        suffix: '.json'
      });

      $translateProvider.determinePreferredLanguage();
      $translateProvider.fallbackLanguage('en_US');
      $translateProvider.useSanitizeValueStrategy('escapeParameters');
      $translateProvider.useLocalStorage();

      /// redirects

      $urlRouterProvider
        .when('/map', '/')
        .when('/map/', '/')
        .when('//map', '/')
        .when('//map/', '/')

        // TODO: this is somehow ignored
        .when('/:mobidulCode/list', '/:mobidulCode/list/all')
        .when('/:mobidulCode/list/', '/:mobidulCode/list/all')

        // .when('/:mobidulCode/:stationCode/',          '/:mobidulCode/:stationCode')

        // .when('/:mobidulCode//edit',              '/:mobidulCode')
        // .when('/:mobidulCode//edit/basis',            '/:mobidulCode')
        // .when('/:mobidulCode/:stationCode/edit',        '/:mobidulCode/:stationCode/edit/basis')
        // .when('/:mobidulCode/:stationCode/edit/',        '/:mobidulCode/:stationCode/edit/basis')
        // .when('/:mobidulCode/:stationCode/edit/basis/',  '/:mobidulCode/:stationCode/edit/basis')
        // .when('/:mobidulCode/:stationCode//edit/basis/', '/:mobidulCode/:stationCode/edit/basis')

        .otherwise('/');


      /// states

      $stateProvider

        ////////////////
        ///// home /////
        ////////////////

        .state('home', {
          url : '/',
          views : {
            // 'loader' : {
            //   templateUrl : 'app/modules/common/LoaderPartial.html',
            //   controller  : 'CoreController as core'
            // },
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/home/HomeView.html',
              controller  : 'HomeController as home'
            }
          }
        })

          ////////////////////////////////
          ///// meine mobidule login /////
          ////////////////////////////////

          .state('home.login', {
            url : 'home/login',
            views : {
              'login' : {
                templateUrl : 'app/modules/login/LoginView.html',
                controller  : 'LoginController as login'
              }
            }
          })

        /////////////////
        ///// login /////
        /////////////////

        .state('login', {
          url : '/login',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/login/LoginView.html',
              controller  : 'LoginController as login'
            }
          }
        })

        ////////////////////
        ///// register /////
        ////////////////////

        .state('register', {
          url : '/register',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/login/RegisterView.html',
              controller  : 'LoginController as login'
            }
          }
        })

        ////////////////////
        ///// activate /////
        ////////////////////

        .state('activate', {
          url : '/activate',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/login/ActivateView.html',
              controller  : 'LoginController as login'
            }
          }
        })

        ///////////////////
        ///// profile /////
        ///////////////////

        .state('profile', {
          url : '/profile',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/profile/ProfileView.html',
              controller  : 'ProfileController as profile'
            }
          }
        })

        ////////////////
        ///// play /////
        ////////////////

        .state('play', {
          url: '/play/:triggerScan',
          views: {
            'header': {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content': {
              templateUrl : 'app/modules/play/PlayView.html',
              controller  : 'PlayController as play'
            }
          }
        })

        ///////////////////
        ///// restore /////
        ///////////////////

        .state('restore', {
          url : '/restore',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/login/RestoreView.html',
              controller  : 'LoginController as login'
            }
          }
        })

        /////////////////////////
        ///// restore reset /////
        /////////////////////////

        .state('reset', {
          url : '/restore/:token',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/login/ResetView.html',
              controller  : 'LoginController as login'
            }
          }
        })



        ///////////////////
        //// impressum ////
        ///////////////////

        .state('impressum', {
          url : '/impressum',
          views : {
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/mobidul/about/AboutPartial.html',
              controller: 'AboutController as about'
            }
          }
        })



        ///////////////////
        ///// mobidul /////
        ///////////////////

        // /:mobidulCode
        .state('mobidul', {
          url : '/:mobidulCode',
          views : {
            // 'loader' : {
            //   templateUrl : 'app/modules/common/LoaderPartial.html',
            //   controller  : 'CoreController as core'
            // },
            'header' : {
              templateUrl : 'app/modules/core/Header.html',
              controller  : 'HeaderController as header'
            },
            'content' : {
              templateUrl : 'app/modules/mobidul/MobidulView.html',
              controller  : 'MobidulController as mobidul'
            }
          }
        })

          ///////////////////
          ///// creator /////
          ///////////////////

          .state('mobidul.creator', {
            abstract : true,
            url : '/creator',
            views : {
              'header' : {
                templateUrl : 'app/modules/core/Header.html',
                controller  : 'HeaderController as header'
              },
              'mobidulContent' : {
                templateUrl : 'app/modules/creator/CreatorView.html',
                controller  : 'CreatorController as creator'
              },

            }
          })

            /////////////////////////
            ///// creator steps /////
            /////////////////////////

            .state('mobidul.creator.basis', {
              url : '/basis',
              views : {
                'creatorContent' : {
                  templateUrl : 'app/modules/creator/CreatorBasisPartial.html'
                }
              }
            })

            .state('mobidul.creator.categories', {
              url : '/categories',
              views : {
                'creatorContent' : {
                  templateUrl : 'app/modules/creator/CreatorCategoriesPartial.html'
                  //, controller  : 'CreatorCategoriesController as categories'
                }
              }
            })

            .state('mobidul.creator.menu', {
              url : '/menu',
              views : {
                'creatorContent' : {
                  templateUrl : 'app/modules/creator/CreatorMenuPartial.html'
                }
              }
            })

            .state('mobidul.creator.settings', {
              url : '/settings',
              views : {
                'creatorContent' : {
                  templateUrl : 'app/modules/creator/CreatorSettingsPartial.html'
                  //, controller  : 'CreatorSettingsController as settings'
                }
              }
            })

          ///////////////
          ///// map /////
          ///////////////

          // /:mobidulCode/map
          .state('mobidul.map', {
            url : '/map',
            views : {
              'mobidulContent' : {
                templateUrl : 'app/modules/mobidul/map/MapPartial.html',
                controller  : 'MapController as map'
              }
            }
          })

          // /:mobidulCode/about
          .state('mobidul.about', {
            url : '/about',
            views : {
              'mobidulContent' : {
                templateUrl : 'app/modules/mobidul/about/AboutPartial.html',
                controller: 'AboutController as about'
              }
            }
          })

          ///////////////////
          ///// station /////
          //////////////////

          // /:mobidulCode/list/:category
          .state('mobidul.list', {
            url : '/list/:category',
            views : {
              'mobidulContent' : {
                templateUrl : 'app/modules/mobidul/list/ListStationsPartial.html',
                controller  : 'ListStationsController as list'
              }
            }
          })

          // /:mobidulCode/:stationCode
          .state('mobidul.station', {
            url : '/{stationCode:(?!\/)[a-z0-9\-]{1,20}}',
            views : {
              'mobidulContent' : {
                templateUrl : 'app/modules/mobidul/station/StationView.html',
                controller  : 'StationController as station'
              }
            }
          })

            .state('mobidul.station.verify', {
              url : '/{verifier}',
              views : {
                'mobidulContent': {
                  templateUrl: 'app/modules/mobidul/station/StationView.html',
                  controller: 'StationController as station'
                }
              }
            })

            ///////////////////////////
            ///// station creator /////
            ///////////////////////////

            // /:mobidulCode/:stationCode/edit
            .state('mobidul.station.edit', {
              abstract : true,
              // url : '/edit',
              views : {
                'stationContent' : {
                  templateUrl : 'app/modules/mobidul/station/creator/StationCreatorView.html',
                  controller  : 'StationCreatorController as stationCreator'
                }
              }
            })

              // /:mobidulCode/:stationCode/edit/basis
              .state('mobidul.station.edit.basis', {
                url : '/edit/basis',
                views : {
                  'stationCreatorContent' : {
                    templateUrl : 'app/modules/mobidul/station/creator/StationCreatorBasisPartial.html',
                  }
                }
              })

              // /:mobidulCode/:stationCode/edit/place
              .state('mobidul.station.edit.place', {
                url : '/edit/place',
                views : {
                  'stationCreatorContent' : {
                    templateUrl : 'app/modules/mobidul/station/creator/StationCreatorPlacePartial.html',
                    controller  : 'MapController as map'
                  }
                }
              })

              // /:mobidulCode/:stationCode/edit/categories
              .state('mobidul.station.edit.categories', {
                url : '/edit/categories',
                views : {
                  'stationCreatorContent' : {
                    templateUrl : 'app/modules/mobidul/station/creator/StationCreatorCategoriesPartial.html',
                  }
                }
              })

              // /:mobidulCode/:stationCode/edit/settings
              .state('mobidul.station.edit.settings', {
                url : '/edit/settings',
                views : {
                  'stationCreatorContent' : {
                    templateUrl : 'app/modules/mobidul/station/creator/StationCreatorSettingsPartial.html',
                  }
                }
              })



          // /:mobidulCode/:stationCode/:media
          .state('mobidul.media', {
            url : '/media/:media',
            views : {
              'mobidulContent' : {
                templateUrl : 'app/modules/mobidul/station/media/MediaPartial.html',
                controller  : 'MediaController as media'
              }
            }
          });


      /// exceptional redirects

      $urlRouterProvider
        .when('/:mobidulCode/',     '/:mobidulCode/map')
        // NOTE: this redirect doesn't seem to work properly
        .when('/:mobidulCode',      '/:mobidulCode/map')
        .when('/:mobidulCode/map/', '/:mobidulCode/map');
    }
  ])

  ////////////////////////
  ///// CUSTOM THEME /////
  ////////////////////////

  .config([   '$mdThemingProvider',
    function ( $mdThemingProvider ) {
      var mobilotBlueMap =
        $mdThemingProvider
          .extendPalette('blue', {
            '500': '3797c4'
          });

      var mobilotGreyMap =
        $mdThemingProvider
        .extendPalette('grey', {
          '50': 'ffffff'
        });

      $mdThemingProvider
        .definePalette('mobilotBlue', mobilotBlueMap);

      $mdThemingProvider
      .definePalette('mobilotGrey', mobilotGreyMap);

      $mdThemingProvider
        .theme('default')
        .primaryPalette('mobilotBlue')
        .accentPalette('amber')
        .backgroundPalette('mobilotGrey');
    }
  ])

  //////////////////////
  ///// FOREST GUMP ////
  //////////////////////

  .run([      '$log', '$rootScope', 'StateManager', 'UserService', 'HeaderService',
    function ( $log,   $rootScope,   StateManager,   UserService,   HeaderService )
    {
      $log.debug('< mobilot >');
      $log.debug('Run Forest ! Run !');
      $log.debug('DEBUGGING ON');

      UserService.restoreUser();

      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          $log.debug('>>>>>>>>>>>>>>>');
          $log.debug('$$$ stateChangeStart callback');
          $log.debug('GOTO : ');
          $log.debug(toState);
          $log.debug(toParams);
          $log.debug('FROM : ');
          $log.debug(fromState);
          $log.debug(fromParams);
          $log.debug('---------------');

          if ( fromState )
            StateManager.set( toState, toParams );
          else
            // StateManager.reset();
            $log.error('TODO StateManager.reset() and figure out default previous route if necessary');


          if (
            toParams.mobidulCode &&
            toParams.mobidulCode !== StateManager.NEW_MOBIDUL_CODE
          ) {
            UserService.restoreUserRole( toParams.mobidulCode );
          }
        });


      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          $log.debug('$$$ stateChangeSuccess callback');
          $log.debug('###############');

          HeaderService.refresh();
        });
    }
  ]);

///////////////
///// END /////
///////////////
