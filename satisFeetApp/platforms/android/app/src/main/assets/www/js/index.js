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
var successHandler = function (pedometerData) {
        this.receivedEvent('newStepData',pedometerData.numberOfSteps);
        // pedometerData.startDate; -> ms since 1970
        // pedometerData.endDate; -> ms since 1970
        //pedometerData.distance;
        // pedometerData.floorsAscended;
        // pedometerData.floorsDescended;
};
var onError = function(){
    console.log("error");
}
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
       /* setInterval(*/pedometer.startPedometerUpdates(successHandler.bind(this), onError)/*, 500)*/;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id,stepCount) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        var stepUpdateElement = parentElement.querySelector('.stepUpdate');
        //var distanceUpdateElement = parentElement.querySelector('.distanceUpdate');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        stepUpdateElement.innerHTML = stepCount;
        //distanceUpdateElement.innerHTML = distance;
        console.log('Received Event: ' + id);
    }
};

app.initialize();