import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ysg-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  @Input() disabled = false;

  decreaseRating() {
    this.rating = this.rating - 1;
    this.emitRatingValue();
  }

  increaseRating() {
    this.rating = this.rating + 1;
    this.emitRatingValue();
  }

  setRating(rating: number) {
    this.rating = rating;
    this.emitRatingValue();
  }

  private emitRatingValue() {
    this.ratingChange.next(this.rating);
  }
}
