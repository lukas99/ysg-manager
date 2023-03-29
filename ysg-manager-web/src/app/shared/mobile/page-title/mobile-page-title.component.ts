import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ysg-mobile-page-title',
  templateUrl: './mobile-page-title.component.html',
  styleUrls: ['./mobile-page-title.component.css']
})
export class MobilePageTitleComponent {
  @Input('disableBackLink') disableBackLink = false;
  @Output() backClicked = new EventEmitter<any>();

  navigateBack() {
    this.backClicked.next({});
  }
}
