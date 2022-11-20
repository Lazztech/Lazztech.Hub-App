import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [
    { data: [3, 3, 4, 2, 3, 4, 4], label: 'Housemates' },
    { data: [1, 0, 0, 1, 5, 6, 2], label: 'Visitors' },
  ];

  constructor() { }

}
