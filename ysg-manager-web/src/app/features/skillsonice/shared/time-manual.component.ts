import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ysg-time-manual',
  templateUrl: './time-manual.component.html',
  styleUrls: ['./time-manual.component.css']
})
export class TimeManualComponent implements OnInit {
  /**
   * Use different time internally to set it to undefined in case time has value zero.
   * So we do not have to initialize player time to undefined, but we can use zero there.
   * This allows us to make the input field empty in case time is zero, so that the user can start
   * typing the new time instead of deleting the zero first.
   */
  componentTime: number | undefined = undefined;

  @Input() time = 0;
  @Output() timeChange = new EventEmitter<number>();

  @Input() disabled = false;

  ngOnInit() {
    if (this.time > 0) {
      this.componentTime = this.time;
    }
  }

  keyUp() {
    // do not round after every key press, only when user leaves the input field
    this.time = this.getComponentTime();
    this.timeChange.next(this.time);
  }

  inputFieldLeft() {
    this.roundComponentTime();
    this.time = this.getComponentTime();
    this.timeChange.next(this.time);
  }

  private getComponentTime(): number {
    return !!this.componentTime ? Number(this.componentTime) : 0;
  }

  private roundComponentTime() {
    const cmpTime = this.getComponentTime();
    // let it undefined when user has left input field wihtout a change
    this.componentTime = !!cmpTime ? Number(cmpTime.toFixed(2)) : undefined;
  }
}
