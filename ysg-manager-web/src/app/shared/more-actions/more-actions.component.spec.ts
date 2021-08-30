import { MoreActionsComponent } from './more-actions.component';

describe('MoreActionsComponent', () => {
  let component: MoreActionsComponent;

  beforeEach(() => {
    component = new MoreActionsComponent();
  });

  it('emits the click event of button 1', () => {
    let eventReceived = false;
    component.button1Click.subscribe(() => (eventReceived = true));

    component.onButton1Click();

    expect(eventReceived).toBeTruthy();
  });

  it('emits the click event of button 2', () => {
    let eventReceived = false;
    component.button2Click.subscribe(() => (eventReceived = true));

    component.onButton2Click();

    expect(eventReceived).toBeTruthy();
  });
});
