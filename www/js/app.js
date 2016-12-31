// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.cloud', 'controllers', 'services', 'ionic-toast'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {

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
          }
        }
      }
    });


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

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
      url:'/other',
      views: {
        'other-tab': {
          templateUrl: 'templates/other.html',
          controller: 'otherCtrl'
        }
      }
    })
    .state('tab.map', {
      url:'/other/map',
      views: {
        'other-tab': {
          templateUrl: 'templates/map.html',
          controller: 'otherCtrl'
        }
      }
    })
  ;



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
