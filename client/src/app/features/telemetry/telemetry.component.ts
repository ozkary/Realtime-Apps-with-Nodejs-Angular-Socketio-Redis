import { Component, OnInit , OnDestroy , ViewChild, ElementRef, Inject} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import Plotly from 'plotly.js-dist-min';

//app data from api or socket
//TODO change provider on telemetry.component.ts
import { Telemetry,ITelemetryService, TelemetryServiceFactory} from './telemetry.factory'; //socket service
import { environment } from '@env/environment';
import { ServiceType } from './telemetry.models';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit, OnDestroy {
  public telemetry: Observable<Telemetry[]>;
  public itemCount: number;
  private svcTelemetry:ITelemetryService = null;
  private  telemetrySubscription: Subscription;
  // private plotTemperature: Plotly.PlotlyHTMLElement;
  // private plotSound: Plotly.PlotlyHTMLElement;

  public tmpValues: number[] = [];
  public sndValues: number[] = [];
  public hmdValues: number[] = [];

  //chart elements
  @ViewChild('chartTemperature')
  private chartTemp: ElementRef; //get an element reference

  @ViewChild('chartSound')
  private chartSound: ElementRef; //get an element reference

  constructor(@Inject('TelemetryService') private telemetryService: ITelemetryService) {
    this.svcTelemetry = telemetryService;
  }

  // constructor(private telemetryService: ITelemetryService) {
  //   const serviceType = environment.serviceType as ServiceType; //"socket"
  //   this.svcTelemetry = TelemetryServiceFactory.createService(serviceType);
  //  }

  ngOnInit() {
    this.telemetry = this.svcTelemetry.telemetry; //data stream form service
    this.svcTelemetry.init();
    this.telemetrySubscription = this.telemetry.subscribe(data => {
      if (data && data.length > 0) {
        this.tmpValues = data.map(item => item.temperature);
        this.sndValues = data.map(item => item.sound);
        this.hmdValues = data.map(item => item.humidity);
        this.buildCharts(data);
      }

    }); //process the new data;
  }

  ngOnDestroy() {
    // prevent memory leak
    //on the template the async pipe auto-unsubscribe
    this.telemetrySubscription.unsubscribe();
    if (this.svcTelemetry.close) {
      this.svcTelemetry.close();
    }
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
            connectgaps: false,
            marker: {
                color: 'blue',
                size: 14,
                symbol: 'circle'
            }
            //,showlegend: true
      };

      function formatDate(dt: Date): Date {
        const d = (new Date(dt));
        // d.setHours(d.getHours() - (d.getTimezoneOffset() / 60));        
        return d;
      }      
      
      function formatItem(item: Telemetry) : Telemetry{
        item.processed = formatDate(item.processed);
        return item;
      }

      const series  =  data.map(item => formatItem(item)).sort( (a,b) => a.processed.getTime() - b.processed.getTime());
            
      const dateSeries = series.map(dim => dim.processed)      
      const tempSeries =  series.map(dim => dim.temperature);
      const soundSeries = series.map(dim => dim.sound);

      this.buildChart(elmTmpChart, dateSeries, tempSeries, 'Temperature', traceProps );
      this.buildChart(elmSndChart, dateSeries, soundSeries, 'Sound', traceProps );
            
  }

  public async buildChart(elmChart: HTMLElement, x: Date[], y: number[], title = 'Chart', traceProps: Partial<Plotly.PlotData>) {

    const layout = {
      margin: { l: 50, r: 50, t: 50, b: 50 }, // Adjust margins as needed
      autosize: true,
      height: 300, // Limit the maximum height      
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
