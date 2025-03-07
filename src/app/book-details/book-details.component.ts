import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookReviewService} from '../book-review.service';
import {BooksList} from '../book-list/book-list.model';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgOptimizedImage
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private bookService: BookReviewService = inject(BookReviewService);

  bookId: number = 0;
  book: BooksList | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  imageLoaded: boolean = false;
  isHighResolution: boolean = false;
  coverImageUrl: string = '';

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.params['id']);
    this.fetchBookDetails();
  }

  fetchBookDetails() {
    if (!this.bookId) {
      this.error = 'Invalid book ID';
      return;
    }

    this.isLoading = true;
    this.bookService.getBookById(this.bookId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (book) => {
          this.book = book;
          if (!book) {
            this.error = 'Book not found';
          } else if (book.work.cover_id) {
            // Start with small thumbnail
            this.coverImageUrl = `https://covers.openlibrary.org/b/id/${book.work.cover_id}-S.jpg`;
          }
        },
        error: (err) => {
          this.error = err.message || 'Failed to load book details';
        }
      });
  }

  onImageLoad() {
    // If we've loaded the small image, now load the large one
    if (!this.isHighResolution && this.book?.work.cover_id) {
      this.isHighResolution = true;
      this.coverImageUrl = `https://covers.openlibrary.org/b/id/${this.book.work.cover_id}-L.jpg`;
    } else {
      // The high resolution image has loaded
      setTimeout(() => {
        this.imageLoaded = true;
      }, 300); // Small delay for smoother transition
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  navigateToReview() {
    this.router.navigate(['/review', this.bookId]);
  }
}
