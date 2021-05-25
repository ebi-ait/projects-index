import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {interval} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Input()
  organs: string[];

  @Input()
  technologies: string[];

  @Output()
  selectedOrgan = new EventEmitter<string>();

  @Output()
  selectedTechnology = new EventEmitter<string>();

  @Output()
  selectedDataLocation = new EventEmitter<string>()

  @Output()
  valueSearched = new EventEmitter<string>();

  dataLocations = ["HCA Data Portal", "GEO", "ENA", "ArrayExpress", "EGA"];

  constructor() { }

  ngOnInit(): void {

  }

  onOrganChange($event) {
    this.selectedOrgan.emit($event.target.value);

  }

  onTechnologyChange($event) {
    this.selectedTechnology.emit($event.target.value);
  }

  onDataLocationChange($event) {
    this.selectedDataLocation.emit($event.target.value);
  }

  triggerSearch($event) {
    // interval(500).subscribe(x => {
     this.valueSearched.emit($event.target.value);
    // });
  }

}
