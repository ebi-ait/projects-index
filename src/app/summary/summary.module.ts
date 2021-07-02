import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartComponent} from './components/chart/chart.component';
import {MiniCardComponent} from './components/mini-card/mini-card.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {SummaryService} from './services/summary.service';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {ChartsModule} from "ng2-charts";

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
          })
export class SummaryModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
