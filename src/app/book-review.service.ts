import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Books, BooksList} from './book-list/book-list.model';
import {catchError, map, Observable, throwError} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class BookReviewService {

  private readonly API_URL: string = 'https://openlibrary.org/people/mekBot/books/want-to-read.json';
  private httpClient: HttpClient = inject(HttpClient);


  // Full List of Books
  allBooks: BooksList[] = [];

  // Pagination Properties
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25];
  totalBooksLength: number = 0;



  getBooks(): Observable<Books> {
    return this.httpClient.get<Books>(this.API_URL).pipe(
      map(response => ({
        ...response,
        reading_log_entries: response.reading_log_entries || [],
      })),

      catchError(error => {
        console.error('Error fetching books:', error);
        return throwError(() => new Error('Failed to load books. Please try again later.'));
      })
    );
  }
  // Populate the allBooks from get response.
  processBooks(books:Books){
    this.allBooks = books.reading_log_entries;
    this.totalBooksLength = books.reading_log_entries.length;
    return  this.getPaginatedBooks();
  }

  // Handle page change event
  handlePageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    return this.getPaginatedBooks();
  }

  getPaginatedBooks(): BooksList[] {
    const startIndex:number = this.pageIndex * this.pageSize;
    const endIndex:number = startIndex + this.pageSize;
    return this.allBooks.slice(startIndex,endIndex);
  }

  // Reset pagination to initial state
  resetPagination(): BooksList[] {
    this.pageIndex = 0;
    this.pageSize = 5;
    return this.getPaginatedBooks();
  }





}
