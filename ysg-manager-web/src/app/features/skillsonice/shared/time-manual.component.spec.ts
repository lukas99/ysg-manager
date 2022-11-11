import { TimeManualComponent } from './time-manual.component';

describe('TimeManuelComponent', () => {
  let component: TimeManualComponent;

  beforeEach(() => {
    component = new TimeManualComponent();
  });

  describe('ngOnInit', () => {
    it('sets component time to value of time', () => {
      component.time = 13.6;
      component.ngOnInit();
      expect(component.componentTime).toBe(13.6);
    });

    it('sets component time to undefined when input time is zero', () => {
      component.time = 0;
      component.ngOnInit();
      expect(component.componentTime).toBeUndefined();
    });
  });

  describe('keyUp', () => {
    it('emits the time', () => {
      let emittedTime;
      component.timeChange.subscribe((time) => (emittedTime = time));
      component.time = 13.6;
      component.ngOnInit();
      component.keyUp();
      expect(component.componentTime).toBe(13.6);
      expect(component.time).toBe(13.6);
      expect(emittedTime).toBe(13.6);
    });

    it('emits zero when component time is undefined', () => {
      let emittedTime;
      component.timeChange.subscribe((time) => (emittedTime = time));
      component.time = 0;
      component.ngOnInit();
      component.keyUp();
      expect(component.componentTime).toBeUndefined();
      expect(component.time).toBe(0);
      expect(emittedTime).toBe(0);
    });
  });

  describe('inputFieldLeft', () => {
    it('emits the rounded time', () => {
      let emittedTime;
      component.timeChange.subscribe((time) => (emittedTime = time));
      component.time = 13.8999;
      component.ngOnInit();
      component.inputFieldLeft();
      expect(component.componentTime).toBe(13.9);
      expect(component.time).toBe(13.9);
      expect(emittedTime).toBe(13.9);
    });

    it('emits zero when component time is undefined', () => {
      let emittedTime;
      component.timeChange.subscribe((time) => (emittedTime = time));
      component.time = 0;
      component.ngOnInit();
      component.inputFieldLeft();
      expect(component.componentTime).toBeUndefined();
      expect(component.time).toBe(0);
      expect(emittedTime).toBe(0);
    });
  });
});
