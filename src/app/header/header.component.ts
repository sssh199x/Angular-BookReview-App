import {Component, NgZone, OnDestroy} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
 private subtitles: string[] = [
    "Every Book Has a Story, Share Yours",
    "Discover Your Next Favorite Read",
    "Connect With Fellow Book Lovers",
    "Rate, Review, Recommend",
    "Your Bookshelf, Reimagined",
    "Turn Pages, Transform Lives",
    "Where Reading Adventures Begin",
    "Curate Your Literary Journey",
    "From Bestsellers to Hidden Gems",
    "Build Your Digital Reading List",
    "Find Your Next Page-Turner",
    "Join the Literary Conversation",
    "Track, Share, and Discover Books",
    "Your Personal Reading Companion",
    "Celebrate the Joy of Reading",
    "Books That Speak to You",
    "Expand Your Reading Horizons",
    "Stories Worth Sharing",
    "Read, Review, Repeat",
    "Literature at Your Fingertips"
  ];

  currentSubtitle: string = this.subtitles[0]
  private intervalId: any;




  constructor(private ngZone: NgZone) {
    // Run outside Angular zone to avoid triggering change detection every 3 seconds
    this.ngZone.runOutsideAngular(() => {
      let index:number = 0;
      this.intervalId = setInterval(() => {
        index = (index + 1) % this.subtitles.length;

        // Run this part inside Angular zone to update the view
        this.ngZone.run(() => {
          this.currentSubtitle = this.subtitles[index];
        });
      }, 3000);
    });
  }

  ngOnDestroy() {
    // Clean up to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }




}
