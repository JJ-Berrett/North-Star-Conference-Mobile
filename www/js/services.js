angular.module('services', [])
  .service("sessionsSrvc", function ($http, $localStorage) {

    if(!$localStorage.sessions){
      $localStorage.sessions = [];
    }
    if(!$localStorage.schedule){
      $localStorage.schedule = [];
    }
    var schedule = $localStorage.schedule;

    this.getSessions = function () {
      return $http.get('https://northstarconferenceadmin.herokuapp.com/api/sessions')
    };

    this.setSessions = function (_sessions) {
      $localStorage.sessions = _sessions;
    };

    this.getSession = function (id) {
      return $localStorage.sessions.find(function (session) {
        return session.id === parseInt(id);
      })
    };

    this.addToSchedule = function (id) {
      var response = {};
      console.log(JSON.stringify($localStorage.sessions));
      var scheduledSession = $localStorage.sessions.find(function (session) {
        console.log(JSON.stringify(session));
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
			var i = array.length;
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
			console.log(question);
			return $http.post('https://northstarconferenceadmin.herokuapp.com/api/questions', question)
				.then(function (res) {
					return res;
				})
		}

  });