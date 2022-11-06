import { FailuresComponent } from './failures.component';

describe('FailuresComponent', () => {
  let component: FailuresComponent;

  beforeEach(() => {
    component = new FailuresComponent();
  });

  it('initializes the failures count with zero', () => {
    expect(component.failures).toBe(0);
  });

  it('increases the failures count and emits the value', (done) => {
    component.failures = 3;

    component.failuresChange.subscribe((count) => {
      expect(count).toBe(4);
      done();
    });

    component.increaseFailures();

    expect(component.failures).toBe(4);
  });

  it('decreases the failures count and emits the value', (done) => {
    component.failures = 3;

    component.failuresChange.subscribe((count) => {
      expect(count).toBe(2);
      done();
    });

    component.decreaseFailures();

    expect(component.failures).toBe(2);
  });
});
