import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  visibleButtons: number[];
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() page = new EventEmitter<PaginationEvent>();

  constructor() {}

  ngOnInit(): void {
    this.calculateTotalPages();

    this.changePage(1);
  }

  ngOnChanges(): void {
    this.calculateTotalPages();
    this.calculateVisibleButtons();
  }

  private calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  private calculateVisibleButtons() {
    switch (this.currentPage) {
      case 1:
        this.visibleButtons = [1, 2, 3];
        break;
      case this.totalPages:
        this.visibleButtons = [
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
        break;
      default:
        this.visibleButtons = [
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
        ];
    }
  }

  changePage(pageNumber: number): void {
    if (
      (pageNumber - 1) * this.itemsPerPage > this.totalItems ||
      pageNumber < 1
    ) {
      return;
    }

    this.page.emit({
      currentPage: pageNumber,
      itemsPerPage: this.itemsPerPage,
    });
  }
}
