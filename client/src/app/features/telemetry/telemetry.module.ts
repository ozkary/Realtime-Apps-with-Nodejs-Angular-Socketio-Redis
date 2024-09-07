import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

//TODO change provider on telemetry.component.ts
import { TelemetryService } from './telemetry.factory';
import { TelemetryComponent } from './telemetry.component';

@NgModule({ declarations: [TelemetryComponent], imports: [CommonModule], providers: [TelemetryService, provideHttpClient(withInterceptorsFromDi())] })
export class TelemetryModule { }
