import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective, Label} from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {ProjectsService} from "../../projects/projects.service";
import {Subscription} from "rxjs";
import {Project} from "../../projects/project";

const DefaultMaxChartEntries = 7;

@Component({
             selector: 'app-chart',
             templateUrl: './chart.component.html',
             styleUrls: ['./chart.component.css']
           })
export class ChartComponent implements OnInit {
  @Input() key: string;
  @Input() list: any[];
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
        { id: 'project-count-axis', position: 'left'},
        { id: 'cell-count-axis', position: 'right'}
      ]
  }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    {data: [], label: 'Project Count', backgroundColor: '#2A4B8C'},
    {data: [], label: 'Cell Count', backgroundColor: '#4B89BF', yAxisID: 'cell-count-axis'},
  ];
  private projects$: Subscription;

  constructor(private projectService: ProjectsService,
  ) {
  }

  ngOnInit(): void {
    let groupedProjects = this.groupListByKey(this.list, this.key);
    this.sortByValue(groupedProjects)
        ?.slice(0, this.maxEntries)
        .forEach(([key, value]) => {
            this.barChartLabels.push(key);
            this.barChartData[0].data.push(value.count);
            this.barChartData[1].data.push(value.cellCount);
        });
    this.barChartOptions.title.text = `By ${this.key}`;
  }

  private sortByValue(groupedProjects: { [p: string]: any }) {
    return Object.entries(groupedProjects)
                 ?.sort(([k1, v1], [k2, v2]) => v2.count - v1.count);
  }

  private groupListByKey(list: any[], groupKey: string) {
    let groupedList: { [key: string]: number } = list?.reduce((acc, val) => {
      val[groupKey].forEach((key => {
        if (!acc[key]) {
          acc[key] = {count:0, cellCount:val.cellCount};
        }
        acc[key].count += 1;
        acc[key].cellCount += val.cellCount;
      }));
      return acc;
    }, {});
    return groupedList;
  }
}
