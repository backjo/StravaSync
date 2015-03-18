"use strict";
let strava = require('strava-v3'),
    fitbit = require('fitbit-js'),
    moment = require('moment'),
    _ = require('underscore'),
    today = moment(),
    oauth= {oauth_token:process.env.oauth_token, oauth_token_secret: process.env.oauth_secret};

fitbit = fitbit(process.env.client_id, process.env.client_secret, "", "en_GB");

let syncWithFitbit = (stravaActivity) => {
    let params = {token: oauth};

    params.activityName = stravaActivity.name;
    params.manualCalories = Math.round(Number(stravaActivity.calories));
    params.startTime = moment(stravaActivity.start_date).format("HH:mm");
    params.date = moment(stravaActivity.start_date).format("YYYY-MM-DD");
    params.distance = stravaActivity.distance / 1000;
    params.durationMillis = (stravaActivity.moving_time * 1000);
    console.log(params);

    fitbit.apiCall("POST", "/user/-/activities.json", params, (err, resp, data) => {
        console.log(err);
        console.log(data);
    });

};

strava.activities.get({id: ""}, (err, data) => {
   _.forEach(data, (activity) => {
       let date = moment(activity.start_date_local);

       console.log();

       if(moment(date).isSame(today, 'day')) {
           strava.activities.get({id: activity.id}, (err, data) => {
               console.log(data);
               syncWithFitbit(data);
           });

       }

   });
});


