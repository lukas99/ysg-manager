import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from './confirmation-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;

  let dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  let dialogData: ConfirmationDialogData;

  beforeEach(() => {
    dialogRef = <any>{ close: jest.fn() };
    dialogData = <ConfirmationDialogData>{};
    component = new ConfirmationDialogComponent(dialogRef, dialogData);
  });

  it('closes the dialog when cancel button is pressed', () => {
    component.onCancelClick();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('closes the dialog when confirm button is pressed', () => {
    component.onConfirmClick();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
