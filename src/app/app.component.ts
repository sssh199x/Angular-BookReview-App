import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterModule,} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {filter, map} from 'rxjs';

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
  private activatedRoute:ActivatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    // More robust router event handling that works with route data
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getRouteData(this.activatedRoute))
    ).subscribe(data => {
      // Check both URL and route data
      const currentUrl = this.router.url;
      this.isErrorPage = this.isErrorUrl(currentUrl) || (data && data.isErrorPage);
    });
  }



  private getRouteData(route: ActivatedRoute): any {
    let child = route;

    // Traverse to the deepest child route
    while (child.firstChild) {
      child = child.firstChild;
    }

    return child.snapshot.data;
  }


  private isErrorUrl(url: string): boolean {
    // More comprehensive check for error URLs
    return url.includes('error-page') ||
      url === '/404' ||
      (url !== '/' &&
        !url.startsWith('/book/') &&
        !url.startsWith('/review/'));
  }



}
