angular.module('services', [])
  .service("sessionsSrvc", function ($http) {

    var sessions = [];
    var schedule = [];

    this.getSessions = function () {
      return $http.get('https://northstarconferenceadmin.herokuapp.com/api/sessions')
    };

    this.setSessions = function (_sessions) {
      sessions = _sessions;
    };

    this.getSession = function (id) {
      return sessions.find(function (session) {
        return session.id === parseInt(id);
      })
    };

    this.addToSchedule = function (id) {
      var response = {};
      var scheduledSession = sessions.find(function (session) {
        return session.id === parseInt(id);
      });

      var sessionId = schedule.find(function (session) {
        return session.id === scheduledSession.id
      });

      var sessionType = schedule.find(function (session) {
        return session.sessiontype === scheduledSession.sessiontype
      });


      if (!sessionId && !sessionType) {
        response.sessionId = true;
        schedule.push(scheduledSession);
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

    this.removeFromSchedule = function (sessionId) {
      removeSessionFromSchedule(schedule, "id", sessionId)
    };

    function removeSessionFromSchedule(array, id, sessionId) {
      var i = array.length;
      while (i--) {
        if (array[i]
          && array[i].hasOwnProperty(id)
          && (arguments.length > 2 && array[i][id] === parseInt(sessionId.id))) {

          array.splice(i, 1);
        }
      }
    }
  });