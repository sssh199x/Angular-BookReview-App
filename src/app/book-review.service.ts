import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Books, BooksList} from './book-list/book-list.model';
import {catchError, map, Observable, of, throwError} from 'rxjs';
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

  // Get a specific book by ID (cover_id)
  getBookById(id: number): Observable<BooksList | null> {
    // If allBooks array is empty, fetch books first
    if (this.allBooks.length === 0) {
      return this.getBooks().pipe(
        map(books => {
          this.processBooks(books); // Process and store all books
          return this.findBookById(id);
        }),
        catchError(error => {
          console.error('Error fetching book details:', error);
          return throwError(() => new Error('Failed to load book details.Please try again later.'));
        })
      );
    }
    // If books are already loaded, return the matching book
    return of(this.findBookById(id));
  }


  // Helper method to find a book by ID
  private findBookById(id: number): BooksList | null {
    const book = this.allBooks.find(book => book.work.cover_id === id);
    return book || null;
  }

  // Populate the allBooks from get response.
  processBooks(books: Books) {
    this.allBooks = books.reading_log_entries;
    this.totalBooksLength = books.reading_log_entries.length;
    return this.getPaginatedBooks();
  }

  // Handle page change event
  handlePageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    return this.getPaginatedBooks();
  }

  getPaginatedBooks(): BooksList[] {
    const startIndex: number = this.pageIndex * this.pageSize;
    const endIndex: number = startIndex + this.pageSize;
    return this.allBooks.slice(startIndex, endIndex);
  }

  // Reset pagination to initial state
  resetPagination(): BooksList[] {
    this.pageIndex = 0;
    this.pageSize = 5;
    return this.getPaginatedBooks();
  }
}
