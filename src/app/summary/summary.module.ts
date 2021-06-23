import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SummaryComponent} from "./summary.component";
import {ChartComponent} from "./chart/chart.component";
import {ChartsModule} from "ng2-charts";
import {MiniCardComponent} from "./mini-card/mini-card.component";



@NgModule({
  declarations: [SummaryComponent, ChartComponent, MiniCardComponent],
  imports: [
    CommonModule,
    ChartsModule,
  ],
  exports: [SummaryComponent, ChartComponent, MiniCardComponent]
})
export class SummaryModule { }
