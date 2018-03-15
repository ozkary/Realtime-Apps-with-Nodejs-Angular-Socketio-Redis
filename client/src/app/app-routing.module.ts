import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelemetryComponent } from '@app.features/telemetry/telemetry.component';

const appRoutes: Routes = [
  { path: '', component: TelemetryComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,
    {enableTracing:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
