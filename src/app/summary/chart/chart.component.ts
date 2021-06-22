import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective, Label} from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {ProjectsService} from "../../projects/projects.service";
import {Subscription} from "rxjs";
import {Project} from "../../projects/project";

@Component({
             selector: 'app-chart',
             templateUrl: './chart.component.html',
             styleUrls: ['./chart.component.css']
           })
export class ChartComponent implements OnInit, OnDestroy {
  @Input() key: string;
  @ViewChild(BaseChartDirective) chart;

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {display: false},
    title: {
      display: true
    },

  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    {data: [], label: '', backgroundColor: 'rgba(56, 145, 152, 0.5)'},
  ];
  private projects$: Subscription;

  constructor(private projectService: ProjectsService,
  ) {
  }

  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects()
                         .subscribe((projects) => {
                           let groupedProjects = this.groupListByKey(projects, this.key);
                           Object.entries(groupedProjects)
                                 .sort(([k1, v1], [k2, v2]) => v2 - v1)
                                 .slice(0, 10)
                                 .forEach(([key, value]) => {
                                   this.barChartLabels.push(key);
                                   this.barChartData[0].data.push(value);
                                 })
                           this.barChartOptions.title.text = `Projects by ${this.key}`;
                           this.chart.refresh();
                         });
  }

  ngOnDestroy() {
    this.projects$.unsubscribe();
  }

  private groupListByKey(projects: Project[], groupKey: string) {
    let groupedProjects: { [key: string]: number } = projects.reduce((acc, val) => {
      val[groupKey].forEach((key => {
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += 1;
      }));
      return acc;
    }, {});
    return groupedProjects;
  }
}
