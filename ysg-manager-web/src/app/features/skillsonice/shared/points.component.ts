import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ysg-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent {
  @Input() allow3PointsAddition: boolean = false;
  @Input() points: number = 0;
  @Output() pointsChange = new EventEmitter<number>();

  decreasePoints() {
    this.points = this.points - 1;
    this.emitPointsValue();
  }

  decreasePointsBy3() {
    this.points = this.points - 3;
    this.emitPointsValue();
  }

  increasePoints() {
    this.points = this.points + 1;
    this.emitPointsValue();
  }

  increasePointsBy3() {
    this.points = this.points + 3;
    this.emitPointsValue();
  }

  private emitPointsValue() {
    this.pointsChange.next(this.points);
  }
}
