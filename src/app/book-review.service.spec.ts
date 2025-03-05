import { TestBed } from '@angular/core/testing';

import { BookReviewService } from './book-review.service';

describe('BookReviewService', () => {
  let service: BookReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
