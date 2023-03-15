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
  counterBackup = 0;
  running = false;
  editing = false;
  private intervalId: any;
  private startText = 'Start';

  @Input() time = 0;
  @Output() timeChange = new EventEmitter<number>();

  @Output() runningChange = new EventEmitter<boolean>();
  @Output() editingChange = new EventEmitter<boolean>();

  @Input() disabled = false;

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

  editTime() {
    if (!this.running) {
      this.editing = true;
      this.emitEditingValue();
      this.counterBackup = this.counter;
    }
  }

  saveEditedTime() {
    this.editing = false;
    this.emitEditingValue();
    this.counterBackup = this.counter;
    this.emitTime();
  }

  discardEditedTime() {
    this.editing = false;
    this.emitEditingValue();
    this.counter = this.counterBackup;
  }

  private emitEditingValue() {
    this.editingChange.next(this.editing);
  }

  increaseByOneSecond() {
    this.counter = this.counter + 1000;
  }

  decreaseByOneSecond() {
    // prevents a negative value
    if (this.counter >= 1000) {
      this.counter = this.counter - 1000;
    }
  }

  increaseByTenHundredths() {
    // 2.56 -> + 0.04
    // 2.60 -> + 0.10
    const secondHundredthsDigit = this.counter % 100;
    if (secondHundredthsDigit === 0) {
      this.counter = this.counter + 100;
    } else {
      this.counter = this.counter + (100 - secondHundredthsDigit);
    }
  }

  decreaseByTenHundredths() {
    // prevents a negative value
    if (this.counter >= 100) {
      // 2.56 -> - 0.06
      // 2.60 -> - 0.10
      const secondHundredthsDigit = this.counter % 100;
      if (secondHundredthsDigit === 0) {
        this.counter = this.counter - 100;
      } else {
        this.counter = this.counter - secondHundredthsDigit;
      }
    }
  }
}
