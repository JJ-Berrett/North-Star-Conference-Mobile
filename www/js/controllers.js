angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    }

  })

  .controller('SessionCtrl', function ($scope, sessionsSrvc) {

    $scope.test = "CAT";
    function getAllSessions() {
      sessionsSrvc.getSessions()
        .then(function (sessions) {
          $scope.sessions = sessions;
        })
    }

    getAllSessions()
  })

  .controller('SessionDetailCtrl', function ($scope, sessionsSrvc, $stateParams) {
    console.log($stateParams);
    $scope.test = 'TEST';

    $scope.session = sessionsSrvc.getSession($stateParams.id);

    $scope.addToSchedule = function (id) {
      var status = sessionsSrvc.addToSchedule(id);
      if (status.sessionId) {
        $scope.addedToSchedule = true;
      }
      if (status.sessionType) {
        $scope.hasBreakoutSession = true;
      }
      if (!status.sessionId && !status.sessionType) {
        $scope.alreadyInSchedule = true;
      }
    }
  })
  .controller('scheduleCtrl', function ($scope, sessionsSrvc){

    function getSchedule(){
      var scheduledSessions = sessionsSrvc.getSchedule();
      if(scheduledSessions){
        $scope.scheduledSessions = scheduledSessions;
        $scope.noSchedule = false;
      }
      else{
        $scope.noSchedule = true;
      }
    }
    $scope.removeFromSchedule = function (id) {
      sessionsSrvc.removeFromSchedule(id);
      getSchedule();
    };

    $scope.$on('$ionicView.enter', function(e) {
      getSchedule()
      });
  });


