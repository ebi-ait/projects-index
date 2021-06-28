import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartComponent} from "./chart/chart.component";
import {ChartsModule} from "ng2-charts";
import {MiniCardComponent} from "./mini-card/mini-card.component";
import {SummaryComponent} from "./summary.component";
import {SummaryService} from "./summary.service";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";

@NgModule({
            declarations: [
              ChartComponent,
              MiniCardComponent,
              SummaryComponent,
            ],
              imports: [
                  CommonModule,
                  ChartsModule,
                  FontAwesomeModule,
              ],
            exports: [
              ChartComponent,
              MiniCardComponent,
              SummaryComponent,
            ],
            providers: [SummaryService]

          })
export class SummaryModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
