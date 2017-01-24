angular.module('starter', ['ionic', 'ionic.cloud', 'controllers', 'services', 'ionic-toast', 'ngStorage'])
	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleLightContent();
			}
		});
	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicCloudProvider,  $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top


    $ionicCloudProvider.init({
			"core": {
				"app_id": "ec05e39b"
			},
			"push": {
				"sender_id": "1095842076318",
				"pluginConfig": {
					"ios": {
						"badge": true,
						"sound": true
					},
          'android': {
            'iconColor': '#343434'
          }
				}
			}
		});

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
