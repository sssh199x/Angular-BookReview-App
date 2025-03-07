import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule,} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'book-review-app';
  isErrorPage = false;

  private router: Router = inject(Router);

  ngOnInit() {
    // Check on init for current route
    this.checkIfErrorPage(this.router.url);

    //Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        this.checkIfErrorPage(event.url);
      }
    );
  }

  checkIfErrorPage(url: string) {
    // Check if current route matches any error route pattern
    this.isErrorPage = url.includes('error-page') || url === '/404';
  }


}
