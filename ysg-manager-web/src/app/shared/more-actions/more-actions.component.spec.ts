import { MoreActionsComponent } from './more-actions.component';

describe('MoreActionsComponent', () => {
  let component: MoreActionsComponent;

  beforeEach(() => {
    component = new MoreActionsComponent();
  });

  it('emits the click event of button 1', () => {
    let eventReceived = false;
    component.button1Click.subscribe(()=>eventReceived = true);

    component.onButton1Click();

    expect(eventReceived).toBeTruthy();
  });
});
