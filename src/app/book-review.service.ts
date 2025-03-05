import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Books, BooksList} from './book-list/book-list.model';
import {catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookReviewService {
  private readonly API_URL: string = 'https://openlibrary.org/people/mekBot/books/want-to-read.json';
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
  }



  // getBooksResponse(): Observable<Books> {
  //   return this.httpClient.get<Books>(this.API_URL).pipe(
  //     map(books => books),
  //   );
  // }
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
}
