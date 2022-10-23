import { MobilePageTitleComponent } from './mobile-page-title.component';
import { Router } from '@angular/router';

describe('MobilePageTitleComponent', () => {
  let component: MobilePageTitleComponent;
  let router: Router;

  beforeEach(() => {
    router = <any>{ navigateByUrl: jest.fn() };
    component = new MobilePageTitleComponent(router);
  });

  it('navigate back', () => {
    const backRoute = 'skillsonice/skillselection';
    component.backRoute = backRoute;
    component.navigateBack();

    expect(router.navigateByUrl).toHaveBeenCalledWith(backRoute);
  });
});
