import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Provides actions by a button list.
 */
@Component({
  selector: 'ysg-more-actions',
  templateUrl: './more-actions.component.html',
  styleUrls: []
})
export class MoreActionsComponent {
  @Input() button1Text!: string;
  @Output() button1Click = new EventEmitter<void>();

  onButton1Click(): void {
    this.button1Click.emit();
  }
}
