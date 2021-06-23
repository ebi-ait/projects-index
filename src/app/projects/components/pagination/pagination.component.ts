import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface PaginationEvent {
  itemsPerPage: number;
  currentPage: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges {
  totalPages: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() page = new EventEmitter<PaginationEvent>();

  constructor() {}

  ngOnInit(): void {
    this.calculateTotalPages();

    this.changePage(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateTotalPages();
  }

  private calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(pageNumber: number): void {
    if (
      (pageNumber - 1) * this.itemsPerPage > this.totalItems ||
      pageNumber < 1
    ) {
      return;
    }
    console.log(pageNumber);

    this.page.emit({
      currentPage: pageNumber,
      itemsPerPage: this.itemsPerPage,
    });
  }
}
