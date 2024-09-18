import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

//TODO change provider (api/socket) on telemetry.component.ts
import { TelemetryServiceFactory } from './telemetry.factory';
import { TelemetryComponent } from './telemetry.component';
import { ScorecardComponent} from '../../components/scorecard/scorecard.component';
import { environment } from '@env/environment';
import { ServiceType } from './telemetry.models';

@NgModule({ 
    declarations: [
        TelemetryComponent,
        ScorecardComponent
    ], 
    imports: [CommonModule], 
    // providers: [TelemetryService, provideHttpClient(withInterceptorsFromDi())] 
    providers: [    
        provideHttpClient(withInterceptorsFromDi()),
        {
                provide: 'TelemetryService',
                useFactory: (httpClient: HttpClient) => {
                    const serviceType = 'api' as ServiceType ; //api | socket environment.serviceType as ServiceType; 
                    return TelemetryServiceFactory.createService(serviceType, httpClient);
                },
                deps: [HttpClient]
        }
    ]
    
})
export class TelemetryModule { }
