import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Input()
  organs: string[];

  @Input()
  technologies: string[];

  @Input()
  hca_bionetworks: string[];

  @Output()
  selectedOrgan = new EventEmitter<string>();

  @Output()
  selectedTechnology = new EventEmitter<string>();

  @Output()
  selectedDataLocation = new EventEmitter<string>();

  @Output()
  selectedHcaBioNetwork = new EventEmitter<string>();

  @Output()
  valueSearched = new EventEmitter<string>();

  dataLocations = Object.values(ProjectsService.allowedLocations);

  constructor() {}

  ngOnInit(): void {}

  onOrganChange($event) {
    this.selectedOrgan.emit($event.target.value);
  }

  onTechnologyChange($event) {
    this.selectedTechnology.emit($event.target.value);
  }

  onDataLocationChange($event) {
    this.selectedDataLocation.emit($event.target.value);
  }

  onBionetworkChange($event) {
    debugger;
    this.selectedHcaBioNetwork.emit($event.target.value);
  }

  triggerSearch($event) {
    this.valueSearched.emit($event.target.value);
  }
}
