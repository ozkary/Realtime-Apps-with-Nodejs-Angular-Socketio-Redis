import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class SocketioService {
  private serverUrl : string;
  private inMsgTag: string;
  private outMsgTag : string;
  private socket;

  /**
   * 
   * @param serverUrl 
   * @param inMsgTag 
   * @param outMsgTag 
   */  
  constructor(serverUrl:string, inMsgTag:string, outMsgTag:string) { 
    this.serverUrl = serverUrl;
    this.inMsgTag = inMsgTag;
    this.outMsgTag = outMsgTag;    
  }

  public connect(): Subject<MessageEvent>{
    this.socket = io(this.serverUrl);

    let observable = new Observable(obs => {
      this.socket.on(this.inMsgTag, (data) => {
        console.log(this.inMsgTag,data);
        obs.next(data);
      })

      return () =>{
        this.socket.disconnect();
      }
    })

    let observer = {
      next: (data:Object) => {
          this.socket.emit(this.outMsgTag, JSON.stringify(data));
      }
    }

    return Subject.create(observer,observable);

  }
}
