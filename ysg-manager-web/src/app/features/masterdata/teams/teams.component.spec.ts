import { TeamsComponent } from './teams.component';

describe('TeamsComponent', () => {
  let component: TeamsComponent;

  beforeEach(() => {
    component = new TeamsComponent();
  });

  describe('ngOnInit', () => {
    it('initializes without error', () => {
      component.ngOnInit();
    });
  });
});
