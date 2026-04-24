import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

//app imports
import { environment } from '../../../environments/environment';

//import/export the models
import { ITelemetryService, Telemetry } from './telemetry.models';
export { Telemetry } from './telemetry.models';

@Injectable({
  providedIn: 'root'  // singleton service
})
export class TelemetrySocketService implements ITelemetryService {

  public telemetry: Observable<Telemetry[]>;  //the data from the API
  public analysis: Observable<string>;
  private baseUrl: string;
  private socket: io.Socket | undefined;
  
  public connectionState: BehaviorSubject<string> = new BehaviorSubject<string>('disconnected');

  private messages: {
    onCreated: string;
    onConnected: string;
    onChat: string;
  };

  private telemetrySubject: BehaviorSubject<Telemetry[]>;
  private analysisSubject: BehaviorSubject<string>;

  //private storage manage by the service
  private storage: {
    telemetry: Telemetry[];
  };  

  constructor() {
    this.baseUrl = environment.telemetry.socket.host;
    this.messages = {onConnected: '', onCreated: '', onChat:'ai_chat'};
    this.messages.onConnected = environment.telemetry.socket.onconnect;
    this.messages.onCreated = environment.telemetry.socket.oncreate;
    this.storage = {telemetry: []};
    this.telemetrySubject = new BehaviorSubject<Telemetry[]>([]);
    this.telemetry = this.telemetrySubject.asObservable();    

    this.analysisSubject = new BehaviorSubject<string>('');
    this.analysis = this.analysisSubject.asObservable();
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

      this.socket.on(this.messages.onChat, (data) => {
          console.log(this.messages.onChat, data);
          this.analysisSubject.next(data);
          this.connectionState.next(this.messages.onChat);
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
        this.socket?.disconnect();
      };
  }

  public close = () => {
    this.socket?.disconnect();
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
