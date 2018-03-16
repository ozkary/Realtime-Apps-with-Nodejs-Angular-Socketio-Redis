import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {TelemetryService} from './telemetry.service';
import { TelemetryComponent } from './telemetry.component';

@NgModule({
  imports: [
    CommonModule,HttpClientModule
  ],
  providers: [TelemetryService],
  declarations: [TelemetryComponent]
})
export class TelemetryModule { }
