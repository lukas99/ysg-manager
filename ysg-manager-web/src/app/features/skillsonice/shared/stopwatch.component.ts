import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

/**
 * See https://stackblitz.com/edit/angular-stopwatch?embed=1&file=app/timer/timer.component.ts
 */
@Component({
  selector: 'ysg-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit, OnDestroy {
  counter = 0;
  running = false;
  private intervalId: any;
  private startText = 'Start';

  @Input() time = 0;
  @Output() timeChange = new EventEmitter<number>();

  @Output() runningChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.counter = this.time * 1000;
  }

  startTimer() {
    this.running = !this.running;
    this.emitRunningValue();
    if (this.running) {
      this.startText = 'Stop';
      const startTime = this.getNow() - (this.counter || 0);
      this.intervalId = setInterval(() => {
        this.counter = this.getNow() - startTime;
        this.emitTime();
      });
    } else {
      this.startText = 'Resume';
      clearInterval(this.intervalId);
    }
  }

  getNow() {
    return Date.now();
  }

  private emitTime() {
    const seconds = this.counter / 1000;
    this.timeChange.next(Number(seconds.toFixed(2)));
  }

  clearTimer() {
    this.running = false;
    this.emitRunningValue();
    this.startText = 'Start';
    this.counter = 0;
    this.timeChange.next(0);
    clearInterval(this.intervalId);
  }

  private emitRunningValue() {
    this.runningChange.next(this.running);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
