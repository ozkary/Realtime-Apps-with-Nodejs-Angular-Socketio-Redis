import Plotly from 'plotly.js-dist-min';

const sampleData = [
    { dateTime: '2024-09-01 08:00', process: 'Process A', equipment: 'Machine 1', label: 'Width', value: 5.1, upperControl: 6.0, lowerControl: 4.0 },
    { dateTime: '2024-09-01 08:10', process: 'Process A', equipment: 'Machine 1', label: 'Width', value: 5.3, upperControl: 6.0, lowerControl: 4.0 },
    { dateTime: '2024-09-01 08:20', process: 'Process A', equipment: 'Machine 1', label: 'Width', value: 5.2, upperControl: 6.0, lowerControl: 4.0 },
    { dateTime: '2024-09-01 08:30', process: 'Process A', equipment: 'Machine 1', label: 'Width', value: 5.0, upperControl: 6.0, lowerControl: 4.0 },
    { dateTime: '2024-09-01 08:40', process: 'Process A', equipment: 'Machine 1', label: 'Width', value: 5.4, upperControl: 6.0, lowerControl: 4.0 },
    // Add more data points as needed
  ];
  
const trace1 = {
  x: sampleData.map(d => d.dateTime),
  y: sampleData.map(d => d.value),
  mode: 'lines+markers',
  name: 'Value',
  line: { color: 'blue' },
  marker: { color: 'blue', size: 8 }
};

const trace2 = {
  x: sampleData.map(d => d.dateTime),
  y: sampleData.map(d => d.upperControl),
  mode: 'lines',
  name: 'Upper Control Limit',
  line: { color: 'red', dash: 'dash' }
};

const trace3 = {
  x: sampleData.map(d => d.dateTime),
  y: sampleData.map(d => d.lowerControl),
  mode: 'lines',
  name: 'Lower Control Limit',
  line: { color: 'red', dash: 'dash' }
};

const layout = {
  title: 'Control Chart',
  xaxis: { title: 'Date Time' },
  yaxis: { title: 'Value' }
};

const data = [trace1, trace2, trace3];

Plotly.newPlot('myDiv', data, layout);
