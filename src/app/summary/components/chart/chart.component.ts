import {Component, Input, OnInit} from '@angular/core';
import {Label} from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {ProjectCount} from "../../summary.service";

const DefaultMaxChartEntries = 7;

@Component({
             selector: 'app-chart',
             templateUrl: './chart.component.html',
             styleUrls: ['./chart.component.css']
           })
export class ChartComponent implements OnInit {
  @Input() key: string;
  @Input() list: ProjectCount[];
  @Input() maxEntries: number = DefaultMaxChartEntries;

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {display: true},
    title: {
      display: true
    },
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'project-count-axis',
          position: 'left',
          gridLines: { display:false },
        },
        {
          id: `key-count-axis`,
          position: 'right',
          ticks: { callback:(value)=>`${parseInt(value+'')/1000000}M` },
          gridLines: { display:false}
        }
      ]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    {data: [], label: 'Project Count', backgroundColor: '#2A4B8C'},
    {data: [], label: `Key Count`, backgroundColor: '#4B89BF', yAxisID: 'key-count-axis'},
  ];

  constructor() {}

  ngOnInit(): void {
    this.barChartOptions.title.text = `By ${this.key}`;
    this.list.forEach(projectCount=> {
      this.barChartData[0].data.push(projectCount.count);
      this.barChartData[1].data.push(projectCount.cellCount);
      this.barChartData[1].label = `${this.key} Count`;
      this.barChartLabels.push(projectCount.group);
    })
  }

 }
