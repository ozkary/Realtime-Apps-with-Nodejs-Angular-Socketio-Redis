import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//app imports
import {environment} from '../../../environments/environment';

//import/export the models
import { Telemetry } from './telemetry.models';
export { Telemetry } from './telemetry.models';

@Injectable()
export class TelemetryService {
  
  public telemetry: Observable<Telemetry[]>;  //the data from the API
  private baseUrl: string;
  private socket:any;
  
  private messages: {
    onCreated:string;
    onConnected:string;
  }
  
  private telemetrySubject: BehaviorSubject<Telemetry[]>; 

  //private storage manage by the service
  private storage: {
    telemetry: Telemetry[];              
  };

  constructor() {    
    this.baseUrl = environment.telemetry.socket.host;
    this.messages = {onConnected:'',onCreated:''};
    this.messages.onConnected = environment.telemetry.socket.onconnect;
    this.messages.onCreated = environment.telemetry.socket.oncreate;
    this.storage = {telemetry: []};    
    this.telemetrySubject = <BehaviorSubject<Telemetry[]>> new BehaviorSubject([]);
    this.telemetry = this.telemetrySubject.asObservable();
   }

   public init() {
      
      // var connectionOptions =  {
      //     "force new connection" : true,
      //     "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
      //     "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
      //     "transports" : ["websocket"]
      // };

      this.socket = io(this.baseUrl);
                 
      this.socket.on(this.messages.onConnected, (data) => {
            console.log(this.messages.onConnected,data);
            
            this.storage.telemetry = <Telemetry[]>data;  
            this.updateStorage();
      });
      
      this.socket.on(this.messages.onCreated, (data) => {
          console.log(this.messages.onCreated,data);
          this.storage.telemetry.push(data);       
          this.updateStorage();            
      });

      this.socket.on("error", (data) => {
        console.log("error",data);       
      });

      this.socket.on("connect", () => {
        console.log("connect");       
      });


      return () =>{
        this.socket.disconnect();
      }        
  }

  /**
   * updates the storage
   */
  private updateStorage(){    

    //limit to 20 data points
    if (this.storage.telemetry.length > 40){
      this.storage.telemetry.shift();
    }

    let clone = Object.assign({}, this.storage);
    this.telemetrySubject.next(clone.telemetry);  //emit the data 
  }
}
