import { StopwatchComponent } from './stopwatch.component';
import { skip, take } from 'rxjs/operators';

describe('StopwatchComponent', () => {
  let component: StopwatchComponent;

  beforeEach(() => {
    component = new StopwatchComponent();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ngOnInit converts the input time to milliseconds', () => {
    component.time = 2.25;
    component.ngOnInit();
    expect(component.counter).toBe(2250);
  });

  it('starts and stops the stopwatch', () => {
    jest
      .spyOn(component, 'getNow')
      .mockReturnValueOnce(1667685641000)
      .mockReturnValueOnce(1667685643000); // + 2000 ms

    expect(component.time).toBe(0);
    expect(component.running).toBeFalsy();

    component.runningChange
      .pipe(take(1))
      .subscribe((isRunning) => expect(isRunning).toBeTruthy());
    component.startTimer(); // start
    jest.advanceTimersByTime(2000);

    expect(component.running).toBeTruthy();
    expect(component.counter).toBe(2000);

    component.runningChange
      .pipe(skip(1))
      .subscribe((isRunning) => expect(isRunning).toBeFalsy());
    component.startTimer(); // pause

    expect(component.running).toBeFalsy();

    component.clearTimer();

    expect(component.running).toBeFalsy();
    expect(component.counter).toBe(0);
  });

  it('emits the time in seconds', () => {
    jest.useRealTimers();

    var actualTime;
    component.timeChange.subscribe((time) => (actualTime = time));

    component.counter = 2556;
    component['emitTime']();
    expect(actualTime).toBe(2.56); // rounded
  });
});
