/*!
    *
    * https://www.ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * Class factory to determine what service to support API/Socket
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    *
*/

/**
 * Factory to determine which service to export
 * API integration: use telemetry.service
 * WebSocket integration: use telemetry-socket.service
 */
import { ITelemetryService, ServiceType } from './telemetry.models';

// API service
import { TelemetryService} from './telemetry.service';

// socket service
import { TelemetrySocketService } from './telemetry-socket.service';
import { HttpClient } from '@angular/common/http';

// export the models
export { Telemetry, ITelemetryService } from './telemetry.models';

export class TelemetryServiceFactory {
    static createService(type: ServiceType, http?: HttpClient): ITelemetryService {
        if (type === 'api') {
            if (!http){
                throw new Error('HttpClient was not provided');
            }
            return new TelemetryService(http);
        } else if (type === 'socket') {
            return new TelemetrySocketService();
        } else {
            throw new Error('Invalid service type');
        }
    }
}
