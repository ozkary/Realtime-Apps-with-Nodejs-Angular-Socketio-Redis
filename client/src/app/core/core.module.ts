import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { SocketioService } from './services/socketio/socketio.service';
import {ApiService} from './services/api/api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers:[SocketioService, 
              ApiService
            ]
})
export class CoreModule { }
