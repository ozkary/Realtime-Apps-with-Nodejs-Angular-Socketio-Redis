import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as Plotly from 'plotly.js';

//app data from api or socket
//TODO change provider on telemetry.component.ts
//import { Telemetry, TelemetryService} from './telemetry.service';          //api service
import { Telemetry, TelemetryService} from './telemetry-socket.service'; //socket service

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit {
  public telemetry: Observable<Telemetry[]>;
  public itemCount: number;
  private svcTelemetry: TelemetryService;
  private  telemetrySubscription: Subscription;
  private plotTemperature: Plotly.PlotlyHTMLElement;
  private plotSound: Plotly.PlotlyHTMLElement;

  //chart elements
  @ViewChild('chartTemperature')
  private chartTemp: ElementRef; //get an element reference

  @ViewChild('chartSound')
  private chartSound: ElementRef; //get an element reference

  constructor(svc: TelemetryService) {
    this.svcTelemetry = svc;
   }

  ngOnInit() {
    this.telemetry = this.svcTelemetry.telemetry; //data stream form service
    this.svcTelemetry.init();
    this.telemetrySubscription = this.telemetry.subscribe(data => {
      if (data && data.length > 0) {
        this.buildCharts(data);
      }

    }); //process the new data;
  }

  ngOnDestroy() {
    // prevent memory leak
    //on the template the async pipe auto-unsubscribe
    this.telemetrySubscription.unsubscribe();
  }

  /**
   * creates the temperature line-graph
   */
  public async buildCharts(data: Telemetry[]) {
    const elmTmpChart = this.chartTemp.nativeElement;
    const elmSndChart = this.chartSound.nativeElement;

      const traceProps: any = {
            mode: 'lines+markers',
            type: 'scatter',
            text: [],
            marker: {
                color: 'blue',
                size: 14,
                symbol: 'circle'
            }
            //,showlegend: true
      };

      const temperature: Partial<Plotly.PlotData>[] = [{
        x: data.map(dim => formatDate(dim.processed)),
        y: data.map(dim => dim.temperature)
      }];

      const sound:  Partial<Plotly.PlotData>[]  = [{
        x: data.map(dim => formatDate(dim.processed)),
        y: data.map(dim => dim.sound),
      }];

      function formatDate(dt) {
          const d = (new Date(dt));
          d.setHours(d.getHours() - (d.getTimezoneOffset() / 60));
          return d.toISOString();
      }

      const layout: any = {
        margin: { t: 0 }
      };

     Plotly.purge(elmTmpChart);
     // if (!this.plotTemperature) {
        Object.assign(temperature, traceProps);
        this.plotTemperature = await Plotly.plot(elmTmpChart, temperature, layout,
                        { displayModeBar: false, displaylogo: false, scrollZoom: true } );
    //  } else {        
    //    Plotly.extendTraces(elmTmpChart, temperature, [0]);
        //Plotly.extendTraces(p, {text: [temperature.text], y: [[ newY ]], x: [[ newX ]]}, [0])
    //  }

      Plotly.purge(elmSndChart);
     // if (!this.plotSound) {
        Object.assign(sound, traceProps);
        this.plotSound = await Plotly.plot( elmSndChart, sound, layout,
                            { displayModeBar: false, displaylogo: false, scrollZoom: true } );
     // } else {
     //   Plotly.extendTraces(elmSndChart, sound, [0]);
     // }
  }

}
