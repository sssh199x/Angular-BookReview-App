import {Component, inject} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {RouterLink, RouterLinkActive,} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {BookReviewService} from '../book-review.service';
import {BooksList} from './book-list.model';
import {finalize} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-book-list',
  imports: [MatListModule, RouterLink, RouterLinkActive, HeaderComponent, MatPaginator, MatProgressSpinner,],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  // Full list of books
  private allBooks: BooksList[] = [];
  // Books displayed on current page
  books: BooksList[] = [];

  error: string | null = null;
  isLoading: boolean = false;

  //Pagination Properties
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25];
  pageIndex: number = 0;
  totalBooks: number = 0;


  private bookReviewService: BookReviewService = inject(BookReviewService);

  ngOnInit() {
    this.getBooksList();
  }

  getBooksList() {
    this.isLoading = true;
    this.error = null;
    return this.bookReviewService.getBooks()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: books => {
          this.allBooks = books.reading_log_entries;
          this.totalBooks = books.reading_log_entries.length;
          this.updatePaginatedBooks();
          // this.isLoading = false; //This line of code is handled by .pipe(finalize(...)) at once
          console.log(this.books);
        }, error: err => {
          // Use the error message from the BookReviewService
          this.error = err.message;
          // this.isLoading = false; //This line of code is handled by .pipe(finalize(...)) at once
        },
      });
  }
  // Handle page change event
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedBooks();
  }

  // Update books based on current page and page size
  private updatePaginatedBooks() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.books = this.allBooks.slice(startIndex, endIndex);
  }


}
