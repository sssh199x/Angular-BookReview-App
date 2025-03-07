// app.component.ts
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterModule,} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {filter, map} from 'rxjs';

/**
 * Root component for the application
 * Handles conditional display of header based on route
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterModule,  // Required for router-outlet
    HeaderComponent,  // Import header component for standalone components
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'book-review-app';
  /**
   * Flag to determine if current page is an error page
   * When true: header will be hidden
   * When false: header will be shown
   */
  isErrorPage = false;

  // Using inject pattern for dependency injection
  private router: Router = inject(Router); // For accessing current URL and navigation events
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute); // Service to access route data

  /**
   * Initialize component and set up route change detection
   * This monitors navigation events to determine when to show/hide the header
   */
  ngOnInit() {
    // Set up subscription to router events to detect when navigation completes
    this.router.events.pipe(
      // Step 1: Filter for only NavigationEnd events
      // Only process events when navigation has fully completed
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),

      // Step 2: Transform the NavigationEnd event into route data
      // * The map function is receiving a NavigationEnd event as input
      // * Instead of using `map((event) => ...)` and using the event in our function
      // * We use `map(() => ...)` to deliberately ignore the input parameter
      // * This indicates we don't care about the event's specific properties
      // * We only care that navigation has completed, and now we want to get the current route data
      map(() => this.getRouteData(this.activatedRoute))
    ).subscribe(data => {
      console.log(data); // { isErrorPage: false, [Symbol(RouteTitle)]: 'Book List' }
      // Step 3: Process the route data to determine if we're on an error page
      const currentUrl = this.router.url;

      // Set error page flag based on two detection methods:
      // 1. URL pattern (like containing 'error-page')
      // 2. Route configuration data (isErrorPage property)
      this.isErrorPage = this.isErrorUrl(currentUrl) || (data && data.isErrorPage);
    });
  }

  /**
   * Get data from the currently active route
   * Traverses to the deepest child route to get most specific route data
   *
   * @param route The ActivatedRoute to start from (usually the root route:parent)
   * @returns The data object from the active route configuration
   */
  private getRouteData(route: ActivatedRoute): any {
    let child = route;

    // Angular routes can be nested (like /users/profile/settings)
    // This loop finds the most specific active route by traversing children
    while (child.firstChild) {
      child = child.firstChild;
    }

    // Return the route data from route configuration
    // This contains custom properties set in Routes array (like isErrorPage)
    return child.snapshot.data; // i.e : { isErrorPage: true }.


  }

  /**
   * Determine if a URL is an error page URL based on patterns
   * This provides a fallback in case route data detection fails
   *
   * @param url The current router URL to check
   * @returns true if URL matches error page patterns, false otherwise
   */
  private isErrorUrl(url: string): boolean {
    return url.includes('error-page') ||  // Explicit error page route
      url === '/404' ||                   // Standard 404 route
      (url !== '/' &&                     // Not home AND
        !url.startsWith('/book/') &&      // Not a book route AND
        !url.startsWith('/review/'));     // Not a review route
  }
}
