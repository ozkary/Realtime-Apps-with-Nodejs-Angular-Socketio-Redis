import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  //ngmodel directive

//custom modules
import {AppRoutingModule} from './app-routing.module'; //routing info
import {environment} from '../environments/environment';
import {TelemetryModule} from './features/telemetry/telemetry.module'; //telemetry module

//components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent     
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule ,
    TelemetryModule  
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }

//cli cmds
//ng generate module core
//ng generate s svcName -m=app.module --flat=false
//ng generate module filterManager --routing 
//ng serve --runs the app