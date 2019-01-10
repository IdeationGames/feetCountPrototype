/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var isDebugging = false;     //change this to cancel all the consolelogs except for errors
//var lastGeoUpdateTime = 0;
var counterGeoUpdates = 0;
var lastGeoLocation ={lon:0,lat:0};
var traveledDistance = 0; //it initialises with 5m on the count allready
var stepCount = 0;
var stepCountInOneMinute = 0;
var stepCountAtTheStartOfTheMinute = 0;
var stepCountInOneMinuteTimer = Date.now();
var stepCountInLastMinuteGreaterThanFifty = false;
var calculateViaSteps = true;
var accuracyThreshold = 8;
var appStartTime;
var watchId;
var trainingStepCountAtTheStart = 0;
var trainingStartDistance = 0;
var isTrainingStarted = false;

var successStopPedo = function(){
    console.log("stoped Pedometer");
}
var failurStopPedo = function(){
    console.log("couldn't stop Pedometer");
}
//traveled distance sollte auch hier angezeigt werden 
var successHandlerPedometer = function (pedometerData) {
        if(calculateViaSteps){
            var distance = 0;
            distance = (pedometerData.numberOfSteps-stepCount)*0.77;
            traveledDistance += distance;
            if(isTrainingStarted){
                trainingStartDistance = trainingStartDistance>0?trainingStartDistance:traveledDistance;
                let trainingDistance = traveledDistance - trainingStartDistance;
                this.receivedEvent('newAverageSpeed',(trainingDistance/((Date.now()-appStartTime)/1000))*3600/1000);
                this.receivedEvent('newTrainingDistance',trainingDistance);
            }
            this.receivedEvent('newDistance',traveledDistance);
        }
        stepCount = pedometerData.numberOfSteps;
        stepCountInOneMinute = stepCount - stepCountAtTheStartOfTheMinute;
        let timestamp = Date.now();
        if(timestamp-stepCountInOneMinuteTimer>60000){
            stepCountInLastMinuteGreaterThanFifty=stepCountInOneMinute>50?true:false;
            stepCountInOneMinuteTimer = timestamp;
            stepCountInOneMinute = 0;
            stepCountAtTheStartOfTheMinute = stepCount;
        }
        this.receivedEvent('newStepData',stepCount);
        if(isTrainingStarted){
            trainingStepCountAtTheStart = (trainingStepCountAtTheStart>0)?trainingStepCountAtTheStart:pedometerData.numberOfSteps;
            this.receivedEvent('newTrainingStepData',(stepCount - trainingStepCountAtTheStart));
        }
        /*if(Date.now()-lastGeoUpdateTime >10000 && lastGeoUpdateTime != 0){
            lastGeoUpdateTime = 0;
            navigator.geolocation.getCurrentPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true});
        }*/
        // pedometerData.startDate; -> ms since 1970
        // pedometerData.endDate; -> ms since 1970
        //pedometerData.distance;
        // pedometerData.floorsAscended;counterGeoUpdates++;
        // pedometerData.floorsDescended;
};

var onErrorPedometer = function(error){
    console.log(error);
}

var successHandlerGeoLocation = function(position) {
    if(isDebugging){console.log(position.coords.accuracy)};
    //The user has to do at least 50 steps in a minute, if he won't move we don't need the geoLocation
    if(Date.now()-stepCountInOneMinuteTimer<60000 &&
        (stepCountInLastMinuteGreaterThanFifty || stepCountInOneMinute > 50)&&
        position.coords.accuracy<accuracyThreshold)
    {
        calculateViaSteps = false;
        if(counterGeoUpdates == 0){alert("now using GPS")};
        counterGeoUpdates++;
        var distanceSinceLastCall = 0;
        if(counterGeoUpdates%5==0){
            distanceSinceLastCall = getDistanceFromLatLonInM(lastGeoLocation.lat,
                lastGeoLocation.lon,
                position.coords.latitude,
                position.coords.longitude);
            traveledDistance += distanceSinceLastCall>42?0:distanceSinceLastCall;
        }
        this.receivedEvent('newDistance',traveledDistance);
        if(isTrainingStarted){
            trainingStartDistance = trainingStartDistance>0?trainingStartDistance:traveledDistance;
            let trainingDistance = traveledDistance - trainingStartDistance;
            this.receivedEvent('newAverageSpeed',(trainingDistance/((Date.now()-appStartTime)/1000))*3600/1000);
            this.receivedEvent('newTrainingDistance',trainingDistance);
            this.receivedEvent('newCurrentSpeed',position.coords.speed);
        }
        /*this.receivedEvent('newGeoLocation',
              //'Latitude: '          + position.coords.latitude          + '\n' +
              //'Longitude: '         + position.coords.longitude         + '\n' +
              //'Distance: '            + distanceSinceLastCall             + '\n' +
              //'TraveledDistance: '    + traveledDistance                 + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              //'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              //'Heading: '           + position.coords.heading           + '\n' +
              //'Speed: '             + position.coords.speed             + '\n' +//meter per second
              //'Timestamp: '         + position.timestamp                + '\n' +
              //'TimeBetweenUpdates: '+ (position.timestamp-lastGeoUpdateTime)               + '\n' +
              //'counter updates: '   +  counterGeoUpdates                + '\n');*/
        //lastGeoUpdateTime = position.timestamp;
        if(distanceSinceLastCall > 0){
            lastGeoLocation.lon = position.coords.longitude;
            lastGeoLocation.lat = position.coords.latitude;
        }
        if(isDebugging){console.log(position.timestamp+" "+counterGeoUpdates)};
    }else{
        calculateViaSteps = true;
    }
};

// onError Callback receives a PositionError object
function onErrorGeoLocation(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

var app = {
    // Application Consftructor
    initialize: function() {
        document.getElementById("start-button").addEventListener("click",startTracking.bind(this));
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        pedometer.startPedometerUpdates(successHandlerPedometer.bind(this), onErrorPedometer);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id,data) {
        var parentElement = document.getElementById(id);
        var updateElement;
        switch(id){
            case "newStepData":
                updateElement = parentElement.querySelector('.stepUpdate');
            break;
            case "newTrainingStepData":
                updateElement = parentElement.querySelector('.stepTrainingUpdate');
            break;
            /*case "newGeoLocation":
                updateElement = parentElement.querySelector('.geoLocationUpdate');*/
            break;
            case "newTrainingDistance":
                updateElement = parentElement.querySelector('.trainingDistanceUpdate');
            break;
            case "newDistance":
                updateElement = parentElement.querySelector('.distanceUpdate');
            break;
            case "newAverageSpeed":
                updateElement = parentElement.querySelector('.averageSpeedUpdate');
            break;
            case "newCurrentSpeed":
                updateElement = parentElement.querySelector('.currentSpeedUpdate');
            break;
        }
        updateElement.innerHTML = data;
        if(isDebugging){console.log('Received Event: ' + id)};
    }
};

function stopTracking(){
    isTrainingStarted = false;
    trainingStepCountAtTheStart = 0;
    trainingStartDistance = 0;
    navigator.geolocation.clearWatch(watchId);
    //pedometer.stopPedometerUpdates(successStopPedo, failurStopPedo);
    startButton.removeEventListener("click",stopTracking);
    startButton.addEventListener("click",startTracking);
}

function startTracking(){
    appStartTime = Date.now();
    isTrainingStarted = true;
    watchId = navigator.geolocation.watchPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true, timeout:30000});
    startButton = document.getElementById("start-button");
    startButton.removeEventListener("click",startTracking);
    startButton.addEventListener("click",stopTracking);
}

app.initialize();