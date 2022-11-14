import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let component: RatingComponent;

  beforeEach(() => {
    component = new RatingComponent();
  });

  it('initializes the rating with zero', () => {
    expect(component.rating).toBe(0);
  });

  it('increases the rating by 1 and emits the value', (done) => {
    component.rating = 80;

    component.ratingChange.subscribe((count) => {
      expect(count).toBe(81);
      done();
    });

    component.increaseRating();

    expect(component.rating).toBe(81);
  });

  it('decreases the rating by 1 and emits the value', (done) => {
    component.rating = 80;

    component.ratingChange.subscribe((count) => {
      expect(count).toBe(79);
      done();
    });

    component.decreaseRating();

    expect(component.rating).toBe(79);
  });

  it('sets a given rating and emits the value', (done) => {
    component.rating = 80;

    component.ratingChange.subscribe((count) => {
      expect(count).toBe(90);
      done();
    });

    component.setRating(90);

    expect(component.rating).toBe(90);
  });
});
