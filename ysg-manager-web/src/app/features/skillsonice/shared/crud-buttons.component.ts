import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ysg-crud-buttons',
  templateUrl: './crud-buttons.component.html',
  styleUrls: ['./crud-buttons.component.css']
})
export class CrudButtonsComponent {
  @Input() deleteDisabled = false;
  @Input() cancelDisabled = false;
  @Input() saveDisabled = false;

  @Output() deleteClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();
  @Output() saveClicked = new EventEmitter<any>();

  constructor(private translateService: TranslateService) {}

  delete(): void {
    if (this.shouldDelete()) {
      this.deleteClicked.next({});
    }
  }

  shouldDelete(): boolean {
    const questionMsg = this.translateService.instant(
      'SKILLS_ON_ICE_DETAIL_DELETE_QUESTION'
    );
    return confirm(questionMsg);
  }

  cancel(): void {
    this.cancelClicked.next({});
  }

  save(): void {
    this.saveClicked.next({});
  }
}
