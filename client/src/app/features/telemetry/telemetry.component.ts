import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import * as Plotly from 'plotly.js';

//app data from api or socket
import { Telemetry,TelemetryService} from './telemetry.service';
//import { Telemetry,TelemetryService} from './telemetry-socket.service';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit {
  public telemetry: Observable<Telemetry[]>;
  public itemCount : number;
  private svcTelemetry:TelemetryService;
  private  telemetrySubscription:Subscription;

  //chart elements
  @ViewChild('chartTemperature') 
  private chartTemp: ElementRef; //get an element reference

  @ViewChild('chartSound') 
  private chartSound: ElementRef; //get an element reference

  constructor(svc:TelemetryService) {
    this.svcTelemetry = svc;
   }

  ngOnInit() {
    this.telemetry = this.svcTelemetry.telemetry; //data stream form service
    this.svcTelemetry.init();
    this.telemetrySubscription = this.telemetry.subscribe(data => {      
      this.buildCharts(data)
    }); //process the new data;    
  }

  ngOnDestroy(){
    // prevent memory leak 
    //on the template the async pipe auto-unsubscribe
    this.telemetrySubscription.unsubscribe();
  }

  /**
   * creates the temperature line-graph
   */
  public buildCharts(data){
    const elmTmp = this.chartTemp.nativeElement;
    const elmSnd = this.chartSound.nativeElement;
    
      const temperature : Partial<Plotly.PlotData>[] = [{
        x: data.map(dim => formatDate(dim.processed)),
        y: data.map(dim => dim.temperature),
        mode: 'lines+markers',
        type: 'scatter',
        text: [],
        marker: {
            color: 'blue',
            size:14,
            symbol: 'circle'
        }       
        //,showlegend: true
      }];

      const sound:  Partial<Plotly.PlotData>[]  = [{
        x: data.map(dim => formatDate(dim.processed)),
        y: data.map(dim => dim.sound),
        mode: 'lines+markers',
        type: 'scatter',
        text: [],
        marker: {
            color: 'blue',
            size:14,
            symbol: 'circle'
        }       
        //,showlegend: true
      }];

      function formatDate(dt)
      {                 
          let d = (new Date(dt));
          d.setHours(d.getHours()-(d.getTimezoneOffset()/60));            
          return d.toISOString();  ;       
      }

      const layout = {
        margin: { t: 0 }
      }

      Plotly.purge(elmTmp);      
      Plotly.plot(elmTmp, temperature, layout,{ displayModeBar: false, displaylogo: false, scrollZoom: true } )
      
      Plotly.purge(elmSnd);
      Plotly.plot( elmSnd, sound, layout,{ displayModeBar: false, displaylogo: false, scrollZoom: true } )
  }


}
