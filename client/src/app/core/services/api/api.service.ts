import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Rx'

@Injectable()
export class ApiService {
  private http;
  private data;

  constructor( http:Http) { 
    this.http = http;           
  }

 /**
  * gets the data from an api call
  *
  * @param request 
  */
  public getData(apiURl:string) : Observable<Response>{
    return this.http.get(apiURl)
          .map((res: Response) => res.json());
  }
}
