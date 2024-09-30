import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

//app imports
import {environment} from '../../../environments/environment';

//import/export the models
import { ITelemetryService, Telemetry } from './telemetry.models';
export { Telemetry } from './telemetry.models';

@Injectable()
export class TelemetryService implements ITelemetryService {

  public telemetry: Observable<Telemetry[]>;  //the data from the API
  private baseUrl: string;
  private http: HttpClient;
  private telemetrySubject: BehaviorSubject<Telemetry[]>;
  public connectionState: BehaviorSubject<string> = null;

  //private storage manage by the service
  private storage: {
    telemetry: Telemetry[];
  };

  constructor(http: HttpClient) {    
    this.http = http;
    this.baseUrl = environment.telemetry.serverUrl;
    this.storage = {telemetry: []};
    this.telemetrySubject = <BehaviorSubject<Telemetry[]>> new BehaviorSubject([]);
    this.telemetry = this.telemetrySubject.asObservable();
   }

   public init() {
      if (this.storage.telemetry.length === 0) {
        this.http.get(this.baseUrl)
                  .subscribe(data => {
                  this.storage.telemetry = <Telemetry[]>data;
                  const clone = Object.assign({}, this.storage);
                  this.telemetrySubject.next(clone.telemetry);  //emit the data
                },
                  error => console.log(error, 'Could not load data.')
                );
      }

  }

  public close = () => {
    return null;
  }


}
