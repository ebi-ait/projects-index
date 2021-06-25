import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SummaryComponent} from "./summary.component";
import {ChartComponent} from "./chart/chart.component";
import {ChartsModule} from "ng2-charts";
import {MiniCardComponent} from "./mini-card/mini-card.component";
import {SummaryService} from "./summary.service";

@NgModule({
            declarations: [
              ChartComponent,
              MiniCardComponent,
              SummaryComponent,
            ],
            imports: [
              CommonModule,
              ChartsModule,
            ],
            exports: [
              ChartComponent,
              MiniCardComponent,
              SummaryComponent,
            ],
            providers: [SummaryService]

          })
export class SummaryModule {
}
