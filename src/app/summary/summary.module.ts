import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SummaryComponent} from "./summary.component";
import {ChartComponent} from "./chart/chart.component";
import {ChartsModule} from "ng2-charts";



@NgModule({
  declarations: [SummaryComponent, ChartComponent],
  imports: [
    CommonModule,
    ChartsModule
  ],
  exports: [SummaryComponent, ChartComponent]
})
export class SummaryModule { }
