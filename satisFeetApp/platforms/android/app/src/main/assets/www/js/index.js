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
var lastGeoUpdateTime = 0;
var counterGeoUpdates = 0;
var successHandlerPedometer = function (pedometerData) {
        this.receivedEvent('newStepData',pedometerData.numberOfSteps);
        if(Date.now()-lastGeoUpdateTime >10000 && lastGeoUpdateTime != 0){
            lastGeoUpdateTime = 0;
            navigator.geolocation.getCurrentPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true});
        }
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
    counterGeoUpdates++;
    this.receivedEvent('newGeoLocation','Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n' +
          'TimeBetweenUpdates: '+ (position.timestamp-lastGeoUpdateTime)               + '\n' +
          'counter updates: '   +  counterGeoUpdates                + '\n');
    lastGeoUpdateTime = position.timestamp;
    console.log(position.timestamp+" "+counterGeoUpdates);
};

// onError Callback receives a PositionError object
function onErrorGeoLocation(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

var app = {
    // Application Consftructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
       /* setInterval(*/pedometer.startPedometerUpdates(successHandlerPedometer.bind(this), onErrorPedometer)/*, 500)*/;
       var watchId = /*setInterval(*/navigator.geolocation.watchPosition(successHandlerGeoLocation.bind(this), onErrorGeoLocation,{enableHighAccuracy: true, timeout:30000})/*,500)*/;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id,data) {
        var parentElement = document.getElementById(id);
        var updateElement;
        switch(id){
            case "newStepData":
                updateElement = parentElement.querySelector('.stepUpdate');
            break;
            case "newGeoLocation":
                updateElement = parentElement.querySelector('.geoLocationUpdate');
            break;
        }
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //var distanceUpdateElement = parentElement.querySelector('.distanceUpdate');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        updateElement.innerHTML = data;
        //distanceUpdateElement.innerHTML = distance;
        console.log('Received Event: ' + id);
    }
};

app.initialize();