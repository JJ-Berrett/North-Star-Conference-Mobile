angular.module('services', [])
  .service("sessionsSrvc", function ($http, $localStorage, $rootScope) {

    if (!$localStorage.sessions) {
      $localStorage.sessions = [];
    }
    if (!$localStorage.schedule) {
      $localStorage.schedule = [];
    }
    if (!$localStorage.mentors) {
      $localStorage.mentors = [];
    }
    if (!localStorage.notifications) {
      $localStorage.notifications = [];
    }
    if (!localStorage.badges) {
      $localStorage.badge = 0;
    }

    $localStorage.notifications = [
      {
        id: 1,
        title: 'Test 1',
        body: 'This is an example message that will be in the notifications object',
        timestamp: 'Sun Feb 25 2018 19:52:25'
      },
      {
        id: 3,
        title: 'Test number 3',
        body: 'This is an example message that will be in the notifications object',
        timestamp: 'Sun Feb 25 2018 19:30:40'
      },
      {
        id: 2,
        title: 'Test 2 Test 2 Test 2 Test 2 Test 2 Test 2 Test 2 Test 2 Test 2',
        body: 'This is an example message that will be in the notifications object',
        timestamp: 'Sun Feb 25 2018 19:40:30'
      },
      {
        id: 4,
        title: 'Test number 4',
        body: 'This is an example message that will be in the notifications object',
        timestamp: 'Sun Feb 25 2018 19:52:50'
      }
    ];

    let schedule = $localStorage.schedule;

    this.getSessions = function () {
      return $http.get('https://northstarconferenceadmin.herokuapp.com/api/sessions')
    };

    this.setSessions = function (_sessions) {
      $localStorage.sessions = _sessions;
    };

    this.setMentors = function (_mentors) {
      $localStorage.mentors = _mentors
    };

    this.getSession = function (id) {
      return $localStorage.sessions.find(function (session) {
        return session.id === parseInt(id);
      })
    };

    this.addToSchedule = function (id) {
      let response = {};
      let scheduledSession = $localStorage.sessions.find(function (session) {
        return session.id === parseInt(id);
      });

      let sessionId = schedule.find(function (session) {
        return session.id === scheduledSession.id
      });

      let sessionType = schedule.find(function (session) {
        return session.sessiontype === scheduledSession.sessiontype
      });


      if (!sessionId && !sessionType) {
        response.sessionId = true;
        schedule.push(scheduledSession);
        $localStorage.schedule = schedule;
      }
      else if (sessionId && sessionType) {
        response.sessionId = false;
      }
      else if (sessionType && !sessionId) {
        response.sessionType = true;
      }
      return response;
    };

    this.getSchedule = function () {
      if (schedule.length > 0) {
        return schedule
      }
      else {
        return false;
      }
    };

    this.submitReview = function (session) {
      return $http.post('https://northstarconferenceadmin.herokuapp.com/api/review', session)
        .then(function (res) {
          return res;
        })
    };

    function removeSessionFromSchedule(array, id, sessionId) {
      let i = array.length;
      while (i--) {
        if (array[i]
          && array[i].hasOwnProperty(id)
          && (arguments.length > 2 && array[i][id] === parseInt(sessionId.id))) {

          array.splice(i, 1);
        }
      }
    }

    this.removeFromSchedule = function (sessionId) {
      removeSessionFromSchedule(schedule, "id", sessionId);
      $localStorage.schedule = schedule;
    };

    this.sendQuestion = function (question) {
      return $http.post('https://northstarconferenceadmin.herokuapp.com/api/questions', question)
        .then(function (res) {
          return res;
        })
    };

    this.getMentors = function () {
      return $http.get('https://northstarconferenceadmin.herokuapp.com/api/mentors')
    };

    this.getMentor = function (id) {
      return $localStorage.mentors.find(function (mentor) {
        return mentor.id === parseInt(id);
      })
    };

    this.addNotification = function (data) {
      let notifications = $localStorage.notifications;
      let badge = $localStorage.badge;

      let notification = {
        id: data.notification.payload.notificationId,
        title: data.notification.payload.title,
        body: data.notification.payload.body,
        timestamp: new Date().now()
      };

      notifications.push(notification);
      $localStorage.notifications = notifications;
      badge++;

      $localStorage.badge = badge;
      $rootScope.$broadcast('badgeEvent');
    };

    this.getNotifications = function () {
      let { notifications } = $localStorage;
      for (let i = 0; i < notifications.length; i++) {
        let { timestamp } = notifications[i];
        let arr = timestamp.split(/ /);
        let month = (new Date(timestamp)).getMonth(); // "feb" does not work..
        let date = arr[2];
        let year = arr[3];
        let time = arr[4].split(/:/);
        let hour = time[0];
        let minute = time[1];
        let second = time[2];
        let fullDate = new Date(year, month, date, hour, minute, second);
        let timeString = fullDate.toDateString().replace(/( \d{4})/, ",") + " " + fullDate.toLocaleTimeString().replace(/:\d{2} /, " ");
        notifications[i].fullDate = fullDate;
        notifications[i].timeString = timeString;
      }
      return notifications;
    };

    this.removeNotification = function (id) {
      let notifications = $localStorage.notifications;
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].id === id) {
          notifications.splice(i, 1);
        }
        $rootScope.$broadcast('badgeEvent');
      }
      $localStorage.notifications = notifications;
    };

    this.clearNotifications = function () {
      $localStorage.notifications = [];
      $rootScope.$broadcast('badgeEvent');
    };

  });
