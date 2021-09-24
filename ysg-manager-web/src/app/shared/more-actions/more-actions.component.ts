import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Provides actions by a button list.
 */
@Component({
  selector: 'ysg-more-actions',
  templateUrl: './more-actions.component.html',
  styleUrls: ['./more-actions.component.css']
})
export class MoreActionsComponent {
  @Input() button1Text!: string;
  @Input() button2Text!: string;

  @Input() button1Disabled = true;
  @Input() button2Disabled = true;

  @Output() button1Click = new EventEmitter<void>();
  @Output() button2Click = new EventEmitter<void>();

  onButton1Click(): void {
    this.button1Click.emit();
  }

  onButton2Click(): void {
    this.button2Click.emit();
  }
}
