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
let successStopPedo = function(){
    console.log("stoped Pedometer");
}
let failurStopPedo = function(){
    console.log("couldn't stop Pedometer");
}
//traveled distance sollte auch hier angezeigt werden
let successHandlerPedometer = function (pedometerData) {
    console.log("Pedometer Success:" + pedometerData.numberOfSteps);
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
};

let onErrorPedometer = function(error){
    console.log("PdeometerError: "+error);
}