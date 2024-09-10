import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

//app imports
import { environment } from '../../../environments/environment';

//import/export the models
import { Telemetry } from './telemetry.models';
export { Telemetry } from './telemetry.models';

@Injectable({
  providedIn: 'root'  // singleton service
})
export class TelemetryService {

  public telemetry: Observable<Telemetry[]>;  //the data from the API
  private baseUrl: string;
  private socket: any;

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

      this.socket = io(this.baseUrl);

      this.socket.on(this.messages.onConnected, (data) => {
            console.log(this.messages.onConnected, data);

            this.storage.telemetry = <Telemetry[]>data;
            this.updateStorage(null);
      });

      this.socket.on(this.messages.onCreated, (data) => {
          console.log(this.messages.onCreated, data);
          this.storage.telemetry.push(data);
          const item: Telemetry[] = [];
          item.push(data);
          this.updateStorage(item);
      });

      this.socket.on('error', (data) => {
        console.log('error', data);
      });

      this.socket.on('connect', () => {
        console.log('connect');
      });


      return () => {
        this.socket.disconnect();
      };
  }

  /**
   * updates the storage
   */
  private updateStorage(data: Telemetry[]) {

    //limit to 20 data points
    if (this.storage.telemetry.length > 40) {
      this.storage.telemetry.shift();
    }

    const clone = Object.assign({}, this.storage);

    if (data) {
      //this.telemetrySubject.next(data);  //emit the data
      this.telemetrySubject.next(clone.telemetry);  //emit the data
    } else {
      this.telemetrySubject.next(clone.telemetry);  //emit the data
    }
  }
}
