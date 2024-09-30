const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    "name": "telemetry",
    "columns": {
        "telemetryId": {
            "primary": true,
            "type": "int",
            "generated": true
        },
        "deviceId": {
            "type": "varchar"
        },
        "temperature": {
            "type": "numeric"
        },
        "humidity": {
            "type": "numeric"
        },   
        "sound": {
            "type": "numeric"
        },    
        "processed": {
            "type": "datetime"
        },
        "created": {
            "type": "datetime"
        }         
    }
});