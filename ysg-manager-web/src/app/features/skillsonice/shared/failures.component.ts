import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ysg-failures',
  templateUrl: './failures.component.html',
  styleUrls: ['./failures.component.css']
})
export class FailuresComponent {
  @Input() failures: number = 0;
  @Output() failuresChange = new EventEmitter<number>();

  decreaseFailures() {
    this.failures = this.failures - 1;
    this.emitFailuresValue();
  }

  increaseFailures() {
    this.failures = this.failures + 1;
    this.emitFailuresValue();
  }

  private emitFailuresValue() {
    this.failuresChange.next(this.failures);
  }
}
