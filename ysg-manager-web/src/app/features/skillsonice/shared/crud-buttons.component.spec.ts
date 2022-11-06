import { CrudButtonsComponent } from './crud-buttons.component';
import { TranslateService } from '@ngx-translate/core';

describe('CrudButtonsComponent', () => {
  let component: CrudButtonsComponent;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = <any>{ instant: jest.fn() };
    component = new CrudButtonsComponent(translateService);
  });

  it('emits an event when save was clicked', (done) => {
    component.saveClicked.subscribe((clicked) => done());
    component.save();
  });

  it('emits an event when cancel was clicked', (done) => {
    component.cancelClicked.subscribe((clicked) => done());
    component.cancel();
  });

  it('emits an event when delete was clicked', (done) => {
    jest.spyOn(component, 'shouldDelete').mockReturnValue(true);
    component.deleteClicked.subscribe((clicked) => done());
    component.delete();
  });
});
