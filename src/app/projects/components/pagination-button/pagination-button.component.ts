import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-button',
  templateUrl: './pagination-button.component.html',
  styleUrls: ['./pagination-button.component.css'],
})
export class PaginationButtonComponent implements OnInit {
  constructor() {}

  @Input() pageNumber: number | string;
  @Input() isCurrent: boolean;
  @Input() extraClasses: string;
  @Output() paginate: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {}

  onClick(): void {
    this.paginate.emit(this.pageNumber);
  }
}
