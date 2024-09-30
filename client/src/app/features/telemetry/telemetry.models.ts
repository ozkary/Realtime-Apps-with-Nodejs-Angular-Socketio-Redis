import { Observable, BehaviorSubject } from 'rxjs';

export type ServiceType = 'api' | 'socket';

export interface Telemetry{
    deviceId:number;
    id: number;
    processed: Date;
    temperature: number;
    humidity: number;
    sound: number;
}
  
export interface ITelemetryService {
    telemetry: Observable<Telemetry[]>;
    connectionState: BehaviorSubject<string>;
    init(): void;
    close(): void;    
}
