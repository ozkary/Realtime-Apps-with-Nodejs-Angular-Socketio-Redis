import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import Plotly from 'plotly.js-dist-min';

//app data from api or socket
//TODO change provider on telemetry.component.ts
import { Telemetry, TelemetryService} from './telemetry.factory'; //socket service

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
   * creates the line-graphs
   */
  public async buildCharts(data: Telemetry[]) {
    const elmTmpChart = this.chartTemp.nativeElement;
    const elmSndChart = this.chartSound.nativeElement;

      const traceProps: Partial<Plotly.PlotData> = {
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

      function formatDate(dt) {
        const d = (new Date(dt));
        d.setHours(d.getHours() - (d.getTimezoneOffset() / 60));
        return d.toISOString();
      }

      const dateSeries = data.map(dim => formatDate(dim.processed));
      const tempSeries =  data.map(dim => dim.temperature);
      const soundSeries = data.map(dim => dim.sound);

      this.buildChart(elmTmpChart, dateSeries, tempSeries, 'Temperature', traceProps );
      this.buildChart(elmSndChart, dateSeries, soundSeries, 'Sound', traceProps );

      // const temperature: Partial<Plotly.PlotData>[] = [{
      //   x: dateSeries,
      //   y: tempSeries
      // }];

      // const sound:  Partial<Plotly.PlotData>[]  = [{
      //   x: dateSeries,
      //   y: soundSeries
      // }];

      // const layout = {
      //   margin: { t: 0 },
      //   title: ''
      // };

      // Plotly.purge(elmTmpChart);     
      // Object.assign(temperature, traceProps);
      // this.plotTemperature = await Plotly.plot(elmTmpChart, temperature, layout,
      //                 { displayModeBar: false, displaylogo: false, scrollZoom: true } );
    
      // Plotly.purge(elmSndChart);     
      // Object.assign(sound, traceProps);
      // this.plotSound = await Plotly.plot( elmSndChart, sound, layout,
      
  }

  public async buildChart(elmChart: HTMLElement, x: string[], y: number[], title = 'Chart', traceProps: Partial<Plotly.PlotData>) {

    const layout = {
      margin: { t: 0 },
      autosize: true,
      title: title
    };

    const series: Partial<Plotly.PlotData>[] = [{
      x: x,
      y: y
    }];

    Plotly.purge(elmChart);
        
    Object.assign(series, traceProps);
    const plot = await Plotly.newPlot(elmChart, series, layout,{ displayModeBar: false, displaylogo: false, scrollZoom: true } );

    // resize chart for responsiveness
    // Plotly.Plots.resize();
  }

}
