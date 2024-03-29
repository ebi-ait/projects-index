import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ProjectCount } from '../../services/summary.service';

const DefaultMaxChartEntries = 7;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() key: string;
  @Input() list: ProjectCount[];
  @Input() maxEntries: number = DefaultMaxChartEntries;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true },
    },
    scales: {
      x: {},
      'project-count-axis': {
        position: 'left',
        grid: { display: false },
      },
      'cell-count-axis': {
        position: 'right',
        ticks: {
          callback: (value) => `${parseInt(value + '', 10) / 1000000}M`,
        },
        grid: { display: false },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Project Count',
        backgroundColor: '#2A4B8C',
        hoverBackgroundColor: '#7682b2',
        yAxisID: 'project-count-axis',
      },
      {
        data: [],
        label: `Cell Count`,
        backgroundColor: '#4B89BF',
        hoverBackgroundColor: '#8dafd4',
        yAxisID: 'cell-count-axis',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.barChartOptions.plugins.title.text = `By ${this.key}`;
    this.list.forEach((projectCount) => {
      this.barChartData.datasets[0].data.push(projectCount.count);
      this.barChartData.datasets[1].data.push(projectCount.cellCount);
      this.barChartData.labels.push(projectCount.group);
    });
  }
}
