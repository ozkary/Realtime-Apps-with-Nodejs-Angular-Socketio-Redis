import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

//TODO change provider (api/socket) on telemetry.component.ts
import { TelemetryService } from './telemetry.factory';
import { TelemetryComponent } from './telemetry.component';
import { ScorecardComponent} from '../../components/scorecard/scorecard.component';

@NgModule({ 
    declarations: [
        TelemetryComponent,
        ScorecardComponent
    ], 
    imports: [CommonModule], 
    providers: [TelemetryService, provideHttpClient(withInterceptorsFromDi())] 
})
export class TelemetryModule { }
