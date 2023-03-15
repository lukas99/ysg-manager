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

  describe('time edit mode', () => {
    it('time edit mode is disabled first', () => {
      expect(component.editing).toBe(false);
    });

    it('cannot edit time when stopwatch is running', () => {
      component.running = true;
      component.editTime();
      expect(component.editing).toBe(false);
    });

    it('edits, saves and emits the modified time', () => {
      component.counter = 2000;

      var actualTime;
      component.timeChange.subscribe((time) => (actualTime = time));

      component.editTime();
      expect(component.editing).toBe(true);

      component.increaseByOneSecond();
      expect(component.counter).toBe(3000);

      component.saveEditedTime();
      expect(component.counter).toBe(3000);
      expect(component.editing).toBe(false);
      expect(actualTime).toBe(3.0);
    });

    it('edits, discards and does not emit the modified time', () => {
      component.counter = 2000;

      var actualTime;
      component.timeChange.subscribe((time) => (actualTime = time));

      component.editTime();
      expect(component.editing).toBe(true);

      component.increaseByOneSecond();
      expect(component.counter).toBe(3000);

      component.discardEditedTime();
      expect(component.counter).toBe(2000);
      expect(component.editing).toBe(false);
      expect(actualTime).toBeUndefined();
    });

    describe('emits the editing value', () => {
      it('when time edit mode is entered', () => {
        component.counter = 2000;

        var actualEditing;
        component.editingChange.subscribe(
          (editing) => (actualEditing = editing)
        );

        component.editTime();
        expect(actualEditing).toBe(true);
      });

      it('when edited time is saved', () => {
        component.counter = 2000;
        component.editing = true;

        var actualEditing;
        component.editingChange.subscribe(
          (editing) => (actualEditing = editing)
        );

        component.saveEditedTime();
        expect(actualEditing).toBe(false);
      });

      it('when edited time is discarded', () => {
        component.counter = 2000;
        component.editing = true;

        var actualEditing;
        component.editingChange.subscribe(
          (editing) => (actualEditing = editing)
        );

        component.discardEditedTime();
        expect(actualEditing).toBe(false);
      });
    });

    it('adds one second', () => {
      component.counter = 2000;
      component.increaseByOneSecond();
      expect(component.counter).toBe(3000);
    });

    describe('decreaseByOneSecond', () => {
      it('removes one second', () => {
        component.counter = 2000;
        component.decreaseByOneSecond();
        expect(component.counter).toBe(1000);
      });

      it('prevents the seconds to be negative', () => {
        component.counter = 500;
        component.decreaseByOneSecond();
        expect(component.counter).toBe(500);
      });
    });

    describe('increaseByTenHundredths', () => {
      it('adds 10 hundredths', () => {
        component.counter = 2000;
        component.increaseByTenHundredths();
        expect(component.counter).toBe(2100);
      });

      it('fills up to the next 10 hundredths', () => {
        component.counter = 2230;
        component.increaseByTenHundredths();
        expect(component.counter).toBe(2300);
      });
    });

    describe('decreaseByTenHundredths', () => {
      it('removes 10 hundredths', () => {
        component.counter = 2000;
        component.decreaseByTenHundredths();
        expect(component.counter).toBe(1900);
      });

      it('goes down to the previous 10 hundredths', () => {
        component.counter = 2230;
        component.decreaseByTenHundredths();
        expect(component.counter).toBe(2200);
      });

      it('prevents the hundredths to be negative', () => {
        component.counter = 90;
        component.decreaseByTenHundredths();
        expect(component.counter).toBe(90);
      });
    });
  });
});
