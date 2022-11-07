import { PointsComponent } from './points.component';

describe('PointsComponent', () => {
  let component: PointsComponent;

  beforeEach(() => {
    component = new PointsComponent();
  });

  it('initializes the points count with zero', () => {
    expect(component.points).toBe(0);
  });

  it('increases the points count and emits the value', (done) => {
    component.points = 3;

    component.pointsChange.subscribe((count) => {
      expect(count).toBe(4);
      done();
    });

    component.increasePoints();

    expect(component.points).toBe(4);
  });

  it('decreases the points count and emits the value', (done) => {
    component.points = 3;

    component.pointsChange.subscribe((count) => {
      expect(count).toBe(2);
      done();
    });

    component.decreasePoints();

    expect(component.points).toBe(2);
  });

  it('increases the points count by 3 and emits the value', (done) => {
    component.points = 3;

    component.pointsChange.subscribe((count) => {
      expect(count).toBe(6);
      done();
    });

    component.increasePointsBy3();

    expect(component.points).toBe(6);
  });

  it('decreases the points count and emits the value', (done) => {
    component.points = 3;

    component.pointsChange.subscribe((count) => {
      expect(count).toBe(0);
      done();
    });

    component.decreasePointsBy3();

    expect(component.points).toBe(0);
  });
});
