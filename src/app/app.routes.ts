import {Routes} from '@angular/router';
import {BookListComponent} from './book-list/book-list.component';
import {BookDetailsComponent} from './book-details/book-details.component';
import {ReviewFormComponent} from './review-form/review-form.component';
import {ErrorPageComponent} from './error-page/error-page.component';

export const routes: Routes = [
  {path: '', component: BookListComponent, title: 'Book List'},
  {path: 'book/:id', component: BookDetailsComponent, title: 'Book Details'},
  {path: 'review/:id', component: ReviewFormComponent, title: 'Review Details'},
  // Explicit error page route
  { path: 'error-page', component: ErrorPageComponent, title: 'Error Page' },


  // Wildcard route for 404 - must be the last route!
  {path: '**' ,redirectTo: 'error-page'},
];

