angular.module('controllers', ['ionic.cloud'])

  .controller('HomeCtrl', function ($scope, $ionicPush) {
    $ionicPush.register()
      .then(function (t) {
        return $ionicPush.saveToken(t, true);
      })
      .then(function (t) {
        console.log('Token saved:', t.token);
      })
      .catch(function (err) {
        console.log('My Error ' + JSON.stringify(err))
      });

    // $scope.$on('cloud:push:notification', function (event, data) {
    // 	var msg = data.message;
    // 	alert(msg.text);
    // });
  })

  .controller('SessionCtrl', function ($scope, sessionsSrvc, ionicToast) {

    var sessionLength = 0;
    var sessionType;
    var sessions;
    $scope.sessions = {};

    function getAllSessions() {
      $scope.loading = true;
      sessionsSrvc.getSessions()
        .then(function (res) {
          sessions = res.data;
          sessionsSrvc.setSessions(sessions);
          return sessions;
        })
        .then(function (result) {
          var mappedSessions = [];
          sessions = result;

          //Create Mapped array with sessionType, SessionTime, then array of sessions
          result.map(function (session) {
            var isMapped = mappedSessions.find(function (mappedSession) {
              return mappedSession.sessionType === session.sessiontype;
            });

            if (!isMapped) {
              mappedSessions.push({
                sessionType: session.sessiontype,
                sessionTime: session.sessiontime,
                sessions: []
              })
            }
          });

          //Add sessions to the session object in the mapped session.
          result.map(function (session) {
            var mappedSession = mappedSessions.find(function (mappedSession) {
              return mappedSession.sessionTime === session.sessiontime;
            });
            if (mappedSession) {
              mappedSession.sessions.push(session);
            }
          });
          $scope.mappedSessions = mappedSessions;
          $scope.loading = false;
        })
    }

    function isInArray(value, array) {
      return array.indexOf(value);
    }

    getAllSessions()
  })

  .controller('SessionDetailCtrl', function ($scope, sessionsSrvc, $stateParams, ionicToast, $ionicModal) {
    $scope.session = sessionsSrvc.getSession($stateParams.id);

    $scope.addToSchedule = function (id) {
      var status = sessionsSrvc.addToSchedule(id);
      if (status.sessionId) {
        ionicToast.show('Added to your schedule!', 'middle', false, 1500);
      }
      if (status.sessionType) {
        ionicToast.show('You already have something for this session.', 'middle', false, 1500);
      }
      if (!status.sessionId && !status.sessionType) {
        ionicToast.show('Already in your schedule.', 'middle', false, 1500);
      }
    };

    $ionicModal.fromTemplateUrl('templates/map.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
      $scope.imgUrl = "img/map.png"
    }
  })

  .controller('scheduleCtrl', function ($scope, sessionsSrvc, ionicToast) {
    $scope.sendSms = function () {
      var message = 'My Schedule \n \n';
      schedule = sessionsSrvc.getSchedule();
      if (schedule) {
        for (var i = 0; i < schedule.length; i++) {
          message = message.concat("Breakout " + (i + 1) + ": " + schedule[i].title + "\n \n");
        }
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
          }
        };
        var number = '';
        sms.send(number, message, options);
      }
      else {
        ionicToast.show('Nothing in your schedule, please add before sharing', 'middle', false, 2500);
      }
    };


    function getSchedule() {
      var scheduledSessions = sessionsSrvc.getSchedule();
      if (scheduledSessions) {
        $scope.scheduledSessions = scheduledSessions;
        $scope.noSchedule = false;
      }
      else {
        $scope.noSchedule = true;
      }
    }

    $scope.removeFromSchedule = function (id) {
      sessionsSrvc.removeFromSchedule(id);
      getSchedule();
    };

    $scope.$on('$ionicView.enter', function (e) {
      getSchedule()
    });
  })

  .controller('ratingCtrl', function ($scope, sessionsSrvc, $stateParams) {
    $scope.session = sessionsSrvc.getSession($stateParams.id);
    $scope.submitReview = function (session) {

      if (session.likeFeedback || session.dislikeFeedback || session.generalFeedback) {
        var review = {
          sessionId: session.id,
          sessionTitle: session.title,
          sessionSpeaker: session.speaker,
          userName: session.userName || "",
          userEmail: session.userEmail || "",
          likeFeedback: session.likeFeedback || "",
          dislikeFeedback: session.dislikeFeedback || "",
          generalFeedback: session.generalFeedback || "",
          rating : session.rating || ""
        };

        sessionsSrvc.submitReview(review)
      }
    };
  })

  .controller('otherCtrl', function ($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/map.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
      $scope.imgUrl = "img/map.png"
    }
  })

  .controller('QuestionCtrl', function ($scope, sessionsSrvc, $stateParams, ionicToast, $state) {
    $scope.session = sessionsSrvc.getSession($stateParams.id);
    $scope.question = '';
    $scope.sendQuestion = function (question) {
      if (question == '') {
        ionicToast.show('Oops, you did not type anything!', 'middle', false, 1000);
      }
      else {
        var Question = {
          sessionId: $stateParams.id,
          question: question
        };
        sessionsSrvc.sendQuestion(Question);
        ionicToast.show('Your question has been submitted', 'middle', false, 1500);
        $scope.question = '';
        $state.go('tab.other');

      }
    };
  })

  .controller('MentorCtrl', function ($scope, sessionsSrvc, ionicToast, $state) {

    function getMentors() {
      sessionsSrvc.getMentors()
        .then(function (result) {

          sessionsSrvc.setMentors(result.data);

          var mappedMentors = [];
          var mentors = result.data;

          mentors.map(function (mentor) {
            var isMapped = mappedMentors.find(function (mappedMentor) {
              return mappedMentor.demographic === mentor.demographic;
            });

            if (!isMapped) {
              mappedMentors.push({
                demographic: mentor.demographic,
                mentors: []
              })
            }
          });

          //Add sessions to the session object in the mapped session.
          mentors.map(function (mentor) {
            var mappedMentor = mappedMentors.find(function (mappedMentor) {
              return mappedMentor.demographic === mentor.demographic;
            });
            if (mappedMentor) {
              mappedMentor.mentors.push(mentor);
            }
          });
          $scope.mappedMentors = mappedMentors;
          $scope.loading = false;
        })
    }

    getMentors();
  })

  .controller('MentorDetailCtrl', function ($scope, sessionsSrvc, $stateParams, ionicToast, $state) {
    console.log($stateParams.id);
    $scope.mentor = sessionsSrvc.getMentor($stateParams.id);
    if($scope.mentor.photo == "" || $scope.mentor.photo == "TBD"){
      $scope.mentor.photo = "http://conference.northstarlds.org/wp-content/uploads/2017/01/Blank.jpg"
    }

    $scope.sendSms = function (number) {
      var message = '';
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT'  // send SMS with the native android SMS messaging
          //intent: '' // send SMS without open any other app
        }
      };
      sms.send(number, message, options);
      $state.go('tab.other')
    }
  })

  .controller('SpeakerDetailCtrl', function ($scope, sessionsSrvc, $stateParams) {
    console.log($stateParams.id);
    $scope.speaker = sessionsSrvc.getSession($stateParams.id);

    if($scope.speaker.speakerphoto == "" || $scope.speaker.speakerphoto == "TBD"){
      $scope.speaker.speakerphoto = "http://conference.northstarlds.org/wp-content/uploads/2017/01/Blank.jpg"
    }

    if($scope.speaker.speakername == "" || $scope.speaker.speakername == "TBD"){
      $scope.speaker.speakername = "Speaker Not Yet Decided"
    }
    if($scope.speaker.speakerbio == "" || $scope.speaker.speakerbio == "TBD"){
      $scope.speaker.speakerbio = "No Bio"
    }


  });



