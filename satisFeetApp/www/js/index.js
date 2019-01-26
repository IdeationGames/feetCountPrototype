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
/*

NEXT STEP
überprüfen das trainingsdistance und schritte mit der normalen distan übereinstimt

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
let isTrainingStarted = false;
let instance;
let appStartTime;
let trainingStepCountAtTheStart = 0;
let trainingStartDistance = 0;
let watchId;
let trackingTimer;

function stopTracking(){
    console.log("stopTracking");
    isTrainingStarted = false;
    trainingStepCountAtTheStart = 0;
    trainingStartDistance = 0;
    navigator.geolocation.clearWatch(watchId);
    //pedometer.stopPedometerUpdates(successStopPedo, failurStopPedo);
    startButton = document.getElementById("run");
    /*startButton.removeEventListener("click",stopTracking);
    startButton.addEventListener("click",startTracking);*/
    startButton.style.display ="flex";
    document.getElementById("current-run").style.display = "none";
}

function startTracking(){
    console.log("startTracking");
    appStartTime = Date.now();
    isTrainingStarted = true;
    watchId = navigator.geolocation.watchPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true, timeout:30000});
    startButton = document.getElementById("run");
    /*startButton.removeEventListener("click",startTracking);
    startButton.addEventListener("click",stopTracking);*/
    startButton.style.display ="none";
    document.getElementById("current-run").style.display = "flex";
    trackingTimer = setInterval(function(){
        t = Date.now() - appStartTime;
        document.getElementById("trainingTime").innerHTML = Math.round(t/1000);
    },1000);
}
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
    },

    // Update DOM on a Received Event
    receivedEvent: function(id,data) {
        var updateElement = document.getElementById(id);
        //var updateElement;
        if(updateElement !== null){
            /*switch(id){
                case "newStepData":
                    updateElement = parentElement.querySelector('.stepUpdate');
                break;
                case "newTrainingStepData":
                    updateElement = parentElement.querySelector('.stepTrainingUpdate');
                break;
                /*case "newGeoLocation":
                    updateElement = parentElement.querySelector('.geoLocationUpdate');*/
                /*break;
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
            }*/
            updateElement.innerHTML = data;
        }
        if(isDebugging){console.log('Received Event: ' + id)};
    }
};
permanentStorage.setItem("app",app);

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
            //load the homescreen scripts
            if(file == "homescreenKopie"){
                bodyAll = document.getElementById("all");
                let s = document.createElement('script');
                let s2 = document.createElement('script');
                s.type = 'text/javascript';
                s.src = "js/homescreen.js";
                s2.type = s.type;
                s2.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js";
                bodyAll.appendChild(s);
                bodyAll.appendChild(s2);
            }
        }
  };
  xhttp.open("GET", file+".html", true);
  xhttp.send();
}
app.initialize();