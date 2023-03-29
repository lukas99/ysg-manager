import { MobilePageTitleComponent } from './mobile-page-title.component';

describe('MobilePageTitleComponent', () => {
  let component: MobilePageTitleComponent;

  beforeEach(() => {
    component = new MobilePageTitleComponent();
  });

  it('navigate back', () => {
    let backClicked = false;
    component.backClicked.subscribe((clicked) => (backClicked = true));

    component.navigateBack();

    expect(backClicked).toBeTruthy();
  });
});
