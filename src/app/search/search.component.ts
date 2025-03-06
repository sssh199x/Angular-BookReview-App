import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {BooksList} from '../book-list/book-list.model';
import {BookReviewService} from '../book-review.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-search',
  imports: [
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {


  private bookReviewService: BookReviewService = inject(BookReviewService);
  searchFormControl: FormControl = new FormControl();
  // To notify parent component when search results should update the displayed books
  @Output() searchResults = new EventEmitter<BooksList[]>();


  ngOnInit(): void {
    // Set up search with debounce
    this.searchFormControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => this.performSearch(term || ''))
    ).subscribe(filteredBooks => {
      this.searchResults.emit(filteredBooks);
    });
  }

  /**
   * Performs search on books collection based on user input
   * @param searchTerm The term to search for
   * @returns Filtered list of books matching the search criteria
   */


  private performSearch(searchTerm: string): BooksList[] {
    // If search term is empty, return to default pagination view
    if (!searchTerm || searchTerm === '') {
      return this.bookReviewService.resetPagination();
    }

    // Clean up and normalize the search term for more accurate matching:
    // 1. Trim whitespace from start and end
    // 2. Replace multiple spaces with single spaces
    // 3. Normalize accented characters and convert to lowercase
    const normalizedTerm = this.normalizeString(
      searchTerm.trim().replace(/\s+/g, ' ')
    );

    // Filter books where either title or any author name contains the search term
    return this.bookReviewService.allBooks.filter(book =>
      this.normalizeString(book.work.title).includes(normalizedTerm) ||
      book.work.author_names.some(author =>
        this.normalizeString(author).includes(normalizedTerm)
      )
    );
  }


  /**
   * Normalizes a string by removing accent marks, normalizing hyphens/dashes,
   * and converting to lowercase
   * @param str The string to normalize
   * @returns Normalized string for matching
   */

  private normalizeString(str: string): string {
    return str.toLowerCase()
      .normalize('NFD')                     // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '')      // Remove accent marks
      .replace(/[\u2010-\u2015\u2212]/g, '-') // Normalize various dash/hyphen characters to simple hyphen
      .replace(/\s*-\s*/g, '-');            // Remove spaces around hyphens
  }

  clearSearch(): void {
    this.searchFormControl.setValue('');
    // This will trigger valueChanges and emit the reset pagination
  }
}
