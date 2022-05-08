import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//TODO change provider on telemetry.component.ts
import { TelemetryService } from './telemetry.factory';
import { TelemetryComponent } from './telemetry.component';

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  providers: [TelemetryService],
  declarations: [TelemetryComponent]
})
export class TelemetryModule { }
