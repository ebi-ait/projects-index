import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface PaginationEvent {
  itemsPerPage: number;
  currentPage: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() items: any[];
  @Output() paginateItems: EventEmitter<PaginationEvent>;

  private itemsPerPage: number;
  private currentPage: number;
  private totalPages: number;

  constructor() {}

  ngOnInit(): void {
    this.itemsPerPage = 20;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
  }

  changePage($pageNumber: number): void {
    if (($pageNumber - 1) * this.itemsPerPage > this.items.length) {
      return;
    }

    this.paginateItems.emit({
      currentPage: $pageNumber,
      itemsPerPage: this.itemsPerPage,
    });

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
