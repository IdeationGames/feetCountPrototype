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
let counterGeoUpdates = 0;
let lastGeoLocation ={lon:0,lat:0};
let accuracyThreshold = 8;
let successHandlerGeoLocation = function(position) {
    if(isDebugging){console.log(position.coords.accuracy)};
    //The user has to do at least 50 steps in a minute, if he won't move we don't need the geoLocation
    if(Date.now()-stepCountInOneMinuteTimer<60000 &&
        (stepCountInLastMinuteGreaterThanFifty || stepCountInOneMinute > 50)&&
        position.coords.accuracy<accuracyThreshold)
    {
        calculateViaSteps = false;
        if(counterGeoUpdates == 0 && isDebugging){alert("now using GPS")};
        counterGeoUpdates++;
        var distanceSinceLastCall = 0;
        if(counterGeoUpdates%5==0){
            distanceSinceLastCall = getDistanceFromLatLonInM(lastGeoLocation.lat,
                lastGeoLocation.lon,
                position.coords.latitude,
                position.coords.longitude);
            counterGeoUpdatesveledDistance += distanceSinceLastCall>42?0:distanceSinceLastCall;
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