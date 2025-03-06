import {Component, inject, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {RouterLink, RouterLinkActive,} from '@angular/router';
import {BookReviewService} from '../book-review.service';
import {BooksList} from './book-list.model';
import {finalize} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PaginatorComponent} from '../paginator/paginator.component';
import {SearchComponent} from '../search/search.component';

@Component({
  selector: 'app-book-list',
  imports: [MatListModule, RouterLink, RouterLinkActive, MatProgressSpinner, PaginatorComponent, SearchComponent,],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private bookReviewService: BookReviewService = inject(BookReviewService);

  // Books displayed on current page
  paginatedBooks: BooksList[] = [];
  error: string | null = null;
  isLoading: boolean = false;
  isSearchActive: boolean = false;

  ngOnInit() {
    this.paginatedBooks = this.bookReviewService.resetPagination();
    this.getBooksList();
  }

  getBooksList() {
    this.isLoading = true;
    this.error = null;
    return this.bookReviewService.getBooks()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: books => {
         this.paginatedBooks= this.bookReviewService.processBooks(books);
          // this.isLoading = false; //This line of code is handled by .pipe(finalize(...)) at once
          console.log(JSON.stringify(this.paginatedBooks, null, 2));
        },
        error: err => {
          // Use the error message from the BookReviewService
          this.error = err.message;
          // this.isLoading = false; //This line of code is handled by .pipe(finalize(...)) at once
        },
      });
  }

  // Handle page change event
  onPageChange(event: PageEvent) {
   this.paginatedBooks= this.bookReviewService.handlePageChange(event);
  }

  // Handle search results
  onSearchResults(results: BooksList[]) {
    this.isSearchActive = results.length !== this.bookReviewService.getPaginatedBooks().length;
    this.paginatedBooks = results;
  }



}
