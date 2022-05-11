/**
 * Factory to determine which service to export
 * API integration: use telemetry.service
 * WebSocket integration: use telemetry-socket.service
 */

//TODO factory to change between API or socket service

// API service
// export { TelemetryService} from './telemetry.service';

// socket service
export { TelemetryService } from './telemetry-socket.service';

// export the models
export { Telemetry } from './telemetry.models';

