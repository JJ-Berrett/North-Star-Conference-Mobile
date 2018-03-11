angular.module('services', [])
  .service("sessionsSrvc", function ($http, $localStorage, $rootScope) {

    if (!$localStorage.sessions) {
      $localStorage.sessions = [];
    }
    if (!$localStorage.mentors) {
      $localStorage.mentors = [];
    }
    if (!localStorage.notifications) {
      $localStorage.notifications = [];
    }

    
    this.getSessions = function () {
      return $http.get('https://northstarconferenceadmin.herokuapp.com/api/sessions').then(res => {
        
        for (let i = 0; i < res.data.length; i++) {
          let session = res.data[i];
          let sessionDay;
          let sessionOrder;
          switch (session.sessiontype) {
            case "keynote 1":
            sessionOrder = 0;
            sessionDay = "Friday";
            break;
            case "breakout 1":
            sessionOrder = 1;
            sessionDay = "Friday";
            break;
            case "breakout 2":
            sessionOrder = 2;
            sessionDay = "Friday";
            break;
            case "breakout 3":
            sessionOrder = 3;
            sessionDay = "Friday";
            break;
            case "keynote 2":
            sessionOrder = 4;
            sessionDay = "Friday";
            break;
            case "keynote 3":
            sessionOrder = 5;
            sessionDay = "Saturday";
            break;
            case "breakout 4":
            sessionOrder = 6;
            sessionDay = "Saturday";
            break;
            case "breakout 5":
            sessionOrder = 7;
            sessionDay = "Saturday";
            break;
            case "breakout 6":
            sessionOrder = 8;
            sessionDay = "Saturday";
            break;
            case "keynote 4":
            sessionOrder = 9;
            sessionDay = "Saturday";
            break;
          };
          session.sessionOrder = sessionOrder;
          session.sessionDay = sessionDay;
        };
        console.log(res);
        return res;
      });
    };
    
    if (!$localStorage.schedule) {
      $localStorage.schedule = [];
      this.getSessions().then(res => {
        let sessions = res.data;
        this.setSessions(sessions);
        
        for (let i = 0; i < sessions.length; i++) {
          if (sessions[i].sessiontype.replace('keynote ', '').length < 2) {
            this.addToSchedule(sessions[i].id)
          }
        };
      });
    }

    let schedule = $localStorage.schedule;
    
    this.setSessions = function (_sessions) {
      $localStorage.sessions = _sessions;
    };

    this.setMentors = function (_mentors) {
      $localStorage.mentors = _mentors;
    };

    this.getSession = function (id) {
      let session = $localStorage.sessions.find(function (session) {
        return session.id === parseInt(id);
      });
      let sessionDay;
      switch (session.sessiontype) {
        case "keynote 1":
          sessionOrder = 0;
          sessionDay = "Friday";
          break;
        case "breakout 1":
          sessionOrder = 1;
          sessionDay = "Friday";
          break;
        case "breakout 2":
          sessionOrder = 2;
          sessionDay = "Friday";
          break;
        case "breakout 3":
          sessionOrder = 3;
          sessionDay = "Friday";
          break;
        case "keynote 2":
          sessionOrder = 4;
          sessionDay = "Friday";
          break;
        case "keynote 3":
          sessionOrder = 5;
          sessionDay = "Saturday";
          break;
        case "breakout 4":
          sessionOrder = 6;
          sessionDay = "Saturday";
          break;
        case "breakout 5":
          sessionOrder = 7;
          sessionDay = "Saturday";
          break;
        case "breakout 6":
          sessionOrder = 8;
          sessionDay = "Saturday";
          break;
        case "keynote 4":
          sessionOrder = 9;
          sessionDay = "Saturday";
          break;
      };
      return Object.assign({}, session, { sessionDay, sessionOrder });
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

      let notification = {
        id: data.payload.notificationID,
        title: data.payload.title,
        body: data.payload.body,
        timestamp: new Date()
      };

      notifications.push(notification);

      $localStorage.notifications = notifications;
      $rootScope.$broadcast('badgeEvent');
    };

    this.getNotifications = function () {
      return $localStorage.notifications;
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
      $rootScope.$broadcast('badgeEvent');
    };

  });
