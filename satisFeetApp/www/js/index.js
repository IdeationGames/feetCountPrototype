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
let permanentStorage = window.localStorage;
let isDebugging = true;     //change this to cancel all the consolelogs except for errors
//var lastGeoUpdateTime = 0;
let traveledDistance = 0; //it initialises with 5m on the count allready
let stepCount = 0;
let stepCountInOneMinute = 0;
let stepCountAtTheStartOfTheMinute = 0;
let stepCountInOneMinuteTimer = Date.now();
let stepCountInLastMinuteGreaterThanFifty = false;
let calculateViaSteps = true;
let appStartTime;
let watchId;
let trainingStepCountAtTheStart = 0;
let trainingStartDistance = 0;
let isTrainingStarted = false;

//bodyA.insertAdjacentHTML('beforeend', '<span>testitest tets</span>');
let app = {
    // Application Consftructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        pedometer.startPedometerUpdates(successHandlerPedometer.bind(this), onErrorPedometer);
        document.getElementById("start-button").addEventListener("click",startTracking.bind(this));
    },

    // Update DOM on a Received Event
    receivedEvent: function(id,data) {
        var parentElement = document.getElementById(id);
        var updateElement;
        if(parentElement !== null){
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
        }
        if(isDebugging){console.log('Received Event: ' + id)};
    }
};
permanentStorage.setItem("app",app);

function stopTracking(){
    isTrainingStarted = false;
    trainingStepCountAtTheStart = 0;
    trainingStartDistance = 0;
    navigator.geolocation.clearWatch(watchId);
    //pedometer.stopPedometerUpdates(successStopPedo, failurStopPedo);
    startButton.removeEventListener("click",stopTracking);
    startButton.addEventListener("click",startTracking);
    startButton.innerHTML = "Start";
}

function startTracking(){
    appStartTime = Date.now();
    isTrainingStarted = true;
    watchId = navigator.geolocation.watchPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true, timeout:30000});
    startButton = document.getElementById("start-button");
    startButton.removeEventListener("click",startTracking);
    startButton.addEventListener("click",stopTracking);
    startButton.innerHTML = "Stop";
}

function changeView(file){
    body = document.getElementById("all");
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            body.innerHTML =
            this.responseText;
        }
  };
  xhttp.open("GET", file+".html", true);
  xhttp.send();
}

app.initialize();