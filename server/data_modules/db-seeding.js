/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * database seeding for initial load
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
*/

module.exports.init = init;

const max_points=20;

function init(){
    var data = [];
    var ts = new Date();
    var deviceId="0ZA-";

    for (var idx=0;idx<=max_points;idx++){
        let item = {};
        ts.setSeconds(idx*2);
        item.id = ts.getTime();
        item.deviceId = deviceId + getValue(100,150).toString();
        item.processed = ts.toISOString();
        item.temperature = getValue(30,40);
        item.humidity = getValue(60,69);
        item.sound = getValue(120,125);
        data.push(item);
    }               
    return data;        
 }

 //generates a random value
 function getValue(min, max){
     return  Math.floor(Math.random() * (max - min + 1)) + min;
 }