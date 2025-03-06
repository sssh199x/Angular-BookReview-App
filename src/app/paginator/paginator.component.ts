import {Component, EventEmitter, inject, Output} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {BookReviewService} from '../book-review.service';

@Component({
  selector: 'app-paginator',
  imports: [
    MatPaginator
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Output() pageChanged = new EventEmitter<PageEvent>();
  bookReviewService : BookReviewService = inject(BookReviewService);

  onPageChange(event: PageEvent) {
     this.pageChanged.emit(event);
  }




  get totalBooksLength():number {
    return this.bookReviewService.totalBooksLength;
  }

  get pageSize():number {
    return this.bookReviewService.pageSize;
  }

  get pageIndex():number {
    return this.bookReviewService.pageIndex;
  }
  get pageSizeOptions():number[] {
    return this.bookReviewService.pageSizeOptions;
  }

}
