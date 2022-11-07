import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ysg-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent {
  @Input() points: number = 0;
  @Output() pointsChange = new EventEmitter<number>();

  decreasePoints() {
    this.points = this.points - 1;
    this.emitPointsValue();
  }

  increasePoints() {
    this.points = this.points + 1;
    this.emitPointsValue();
  }

  private emitPointsValue() {
    this.pointsChange.next(this.points);
  }
}
