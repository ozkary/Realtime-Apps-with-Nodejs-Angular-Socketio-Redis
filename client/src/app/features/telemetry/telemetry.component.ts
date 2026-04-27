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
  private svcTelemetry:ITelemetryService;
  private  telemetrySubscription: Subscription | undefined;
  public analysis: Observable<string> | undefined;
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
    this.itemCount = 0;
    this.telemetry = this.svcTelemetry.telemetry;
    console.log(this.svcTelemetry.analysis);
    this.analysis = this.svcTelemetry.analysis;
  }

  // constructor(private telemetryService: ITelemetryService) {
  //   const serviceType = environment.serviceType as ServiceType; //"socket"
  //   this.svcTelemetry = TelemetryServiceFactory.createService(serviceType);
  //  }

  ngOnInit() {
    // this.telemetry = this.svcTelemetry.telemetry; //data stream form service
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
    this.telemetrySubscription?.unsubscribe();
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
            mode: 'lines',
            type: 'scatter',
            text: [],
            connectgaps: false,
            marker: {
                color: '#337ab7',
                size: 8,
                symbol: 'none'
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

      this.buildChartWithControlLimits(elmTmpChart, dateSeries, tempSeries, 'Temperature', traceProps );
      this.buildChartWithControlLimits(elmSndChart, dateSeries, soundSeries, 'Sound', traceProps );
            
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

  public async buildChartWithControlLimits(elmChart: HTMLElement, x: Date[], y: number[], title = 'Chart', traceProps: Partial<Plotly.PlotData>) {

    // Step 1: Calculate Statistical Parameters ($\mu$ and $\sigma$)
    if (y.length < 2) {
        console.warn("Insufficient data to calculate $3\sigma$ for " + title);
        this.buildChart(elmChart, x, y, title, traceProps); // Fallback to standard chart
        return;
    }

    const mean = y.reduce((a, b) => a + b) / y.length;
    const standardDeviation = Math.sqrt(y.map(val => Math.pow(val - mean, 2)).reduce((a, b) => a + b) / (y.length - 1));

    // Step 2: Define the Control Limits (LCL, Mean, UCL) sigma 2 cover 95% normal variation
    const sigma = 2
    const lcl = mean - (sigma * standardDeviation);
    const ucl = mean + (sigma * standardDeviation);

    console.log(`${title} Stats: Mean=${mean.toFixed(2)}, $3\sigma$ Range=[${lcl.toFixed(2)} - ${ucl.toFixed(2)}]`);

    // Step 3: Define Layout with Horizontal Control Lines
    const layout = {
        margin: { l: 50, r: 50, t: 50, b: 50 }, autosize: true, height: 300, title: title, 
        xaxis: { type: 'date' as 'date' },
        yaxis: { title: title + ' Value' }, 
        // showlegend: true, // Show legend to allow toggling control lines
        shapes: [
            // Mean Line ($\mu$) - FIXED: Cast type as "line"
            {
                type: 'line' as 'line',
                x0: x[0], y0: mean, x1: x[x.length - 1], y1: mean,
                line: { color: '#fcd34d', width: 2, dash: 'dot' as Plotly.Dash} // Matching Yellow
            },
            // Upper Control Limit (UCL = +$3\sigma$) - FIXED: Cast type as "line"
            {
                type: 'line' as 'line',
                x0: x[0], y0: ucl, x1: x[x.length - 1], y1: ucl,
                line: { color: '#d9534f', width: 2, dash: 'solid' as Plotly.Dash}
            },
            // Lower Control Limit (LCL = -$3\sigma$) - FIXED: Cast type as "line"
            {
                type: 'line' as 'line',
                x0: x[0], y0: lcl, x1: x[x.length - 1], y1: lcl,
                line: { color: '#d9534f', width: 2, dash: 'solid' as Plotly.Dash}
            }
        ]
    };

    // Step 4: Define the Data Traces
    const chartData: Partial<Plotly.PlotData>[] = [];

    // The Telemetry Trace (Observed Data)
    const telemetryTrace: Partial<Plotly.PlotData> = {
        x: x, y: y, name: 'Telemetry Feed', marker: { color: 'blue' }, mode: 'lines+markers'
    };
    Object.assign(telemetryTrace, traceProps); // Apply shared formatting
    chartData.push(telemetryTrace);

    // Step 5: Render the Chart (No changes needed here)
    Plotly.purge(elmChart);
    const plot = await Plotly.newPlot(elmChart, chartData, layout, { displayModeBar: false, displaylogo: false, scrollZoom: false });
}

}
