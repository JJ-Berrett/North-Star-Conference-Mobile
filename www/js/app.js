"use strict";
angular.module('starter', ['ionic', 'controllers', 'services', 'ionic-toast', 'ngStorage', 'ngCordova'])
	.run(function ($ionicPlatform, sessionsSrvc) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleLightContent();
			}

      window.plugins.OneSignal
        .startInit("d8ca736c-86df-4151-9df8-2fbfecf81436")
        .handleNotificationReceived(sessionsSrvc.addNotification)
        .endInit();
    });
	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

		$stateProvider
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})
			.state('tab.home', {
				url: '/home',
				views: {
					'home-tab': {
						templateUrl: 'templates/home.html',
						controller: 'HomeCtrl'
					}
				}
			})
      .state('tab.notifications', {
        url: '/notifications',
        views: {
          'notification-tab': {
            templateUrl: 'templates/notifications.html',
            controller: 'NotificationCtl'
          }
        }
      })
			.state('tab.sessions', {
				url: '/sessions',
				views: {
					'sessions-tab': {
						templateUrl: 'templates/sessions.html',
						controller: 'SessionCtrl'
					}
				}
			})
			.state('tab.session-detail', {
				url: '/sessions/:id',
				views: {
					'sessions-tab': {
						templateUrl: 'templates/session-detail.html',
						controller: 'SessionDetailCtrl'
					}
				}
			})
			.state('tab.rateSession', {
				url: '/rateSession/:id',
				views: {
					'sessions-tab': {
						templateUrl: 'templates/rate-session.html',
						controller: 'ratingCtrl'
					}
				}
			})
      .state('tab.speaker-detail', {
        url: '/speakerDetail/:id',
        views: {
          'sessions-tab': {
            templateUrl: 'templates/speaker-detail.html',
            controller: 'SpeakerDetailCtrl'
          }
        }
      })
      .state('tab.schedule-speaker-detail', {
        url: '/speakerDetail/:id',
        views: {
          'schedule-tab': {
            templateUrl: 'templates/schedule-speaker-detail.html',
            controller: 'SpeakerDetailCtrl'
          }
        }
      })
      .state('tab.schedule-rateSession', {
        url: 'rateSession/:id',
        views: {
          'schedule-tab': {
            templateUrl: 'templates/schedule-rate-session.html',
            controller: 'ratingCtrl'
          }
        }
      })
      .state('tab.schedule-session-detail', {
        url: '/sessions/:id',
        views: {
          'schedule-tab': {
            templateUrl: 'templates/schedule-session-detail.html',
            controller: 'SessionDetailCtrl'
          }
        }
      })
			.state('tab.schedule', {
				url: '/schedule',
				views: {
					'schedule-tab': {
						templateUrl: 'templates/schedule.html',
						controller: 'scheduleCtrl'
					}
				}
			})
			.state('tab.other', {
				url: '/other',
				views: {
					'other-tab': {
						templateUrl: 'templates/other.html',
						controller: 'otherCtrl'
					}
				}
			})
			.state('tab.map', {
				url: '/other/map',
				views: {
					'other-tab': {
						templateUrl: 'templates/map.html',
						controller: 'otherCtrl'
					}
				}
			})
			.state('tab.session-questions', {
				url: '/other/session-questions',
				views: {
					'other-tab': {
						templateUrl: 'templates/session-questions.html',
						controller: 'SessionCtrl'
					}
				}
			})
			.state('tab.question', {
				url: '/other/question/:id',
				views: {
					'other-tab': {
						templateUrl: 'templates/question.html',
						controller: 'QuestionCtrl'
					}
				}
			})
      .state('tab.mentors', {
        url: '/other/mentors',
        views: {
          'other-tab': {
            templateUrl: 'templates/mentors.html',
            controller: 'MentorCtrl'
          }
        }
      })
      .state('tab.mentor-detail', {
        url: '/other/mentor-detail/:id',
        views: {
          'other-tab': {
            templateUrl: 'templates/mentor-detail.html',
            controller: 'MentorDetailCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/tab/home');

	});
