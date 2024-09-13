import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

//app imports
import { environment } from '../../../environments/environment';

//import/export the models
import { Telemetry } from './telemetry.models';
import { ControlEvent } from '@angular/forms';
export { Telemetry } from './telemetry.models';

@Injectable({
  providedIn: 'root'  // singleton service
})
export class TelemetryService {

  public telemetry: Observable<Telemetry[]>;  //the data from the API
  private baseUrl: string;
  private socket: io.Socket;
  public connectionState: BehaviorSubject<string> = new BehaviorSubject<string>('disconnected');

  private messages: {
    onCreated: string;
    onConnected: string;
  };

  private telemetrySubject: BehaviorSubject<Telemetry[]>;

  //private storage manage by the service
  private storage: {
    telemetry: Telemetry[];
  };  

  constructor() {
    this.baseUrl = environment.telemetry.socket.host;
    this.messages = {onConnected: '', onCreated: ''};
    this.messages.onConnected = environment.telemetry.socket.onconnect;
    this.messages.onCreated = environment.telemetry.socket.oncreate;
    this.storage = {telemetry: []};
    this.telemetrySubject = <BehaviorSubject<Telemetry[]>> new BehaviorSubject([]);
    this.telemetry = this.telemetrySubject.asObservable();    
   }

   public init() {

      this.socket = io.connect(this.baseUrl, {transports: ['websocket'], reconnection: true });

      this.socket.on(this.messages.onConnected, (data) => {
            console.log(this.messages.onConnected, data);

            this.storage.telemetry = <Telemetry[]>data;
            this.updateStorage();
            this.connectionState.next(this.messages.onConnected);
      });

      this.socket.on(this.messages.onCreated, (data) => {
          console.log(this.messages.onCreated, data);
          this.storage.telemetry.push(data);
          // const item: Telemetry[] = [];
          // item.push(data);
          this.updateStorage();
          this.connectionState.next(this.messages.onCreated);
      });

      this.socket.on('error', (data) => {
        console.log('error', data);
      });

      this.socket.on('connect', () => {
        console.log('socket connected');
        this.connectionState.next('connected');
      });

      this.socket.on('connect_error', (err) => {
        console.log('socket error', err);
        this.connectionState.next('error');

      });


      this.socket.on('disconnect', () => {
        console.log('socket disconnected');        
        this.connectionState.next('disconnected');
      });

      return () => {
        this.socket.disconnect();
      };
  }

  public close = () => {
    this.socket.disconnect();
  }

  /**
   * updates the storage
   */
  private updateStorage() {

    //limit the data points
    if (this.storage && this.storage.telemetry?.length > 25) {
      this.storage.telemetry.shift();
    }

    const clone = Object.assign({}, this.storage);
    
    if (clone && clone.telemetry){
      this.telemetrySubject.next(clone.telemetry);  //emit the data
    }
        
  }
}
