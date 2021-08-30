import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Output() button1Click = new EventEmitter<void>();
  @Output() button2Click = new EventEmitter<void>();

  onButton1Click(): void {
    this.button1Click.emit();
  }

  onButton2Click(): void {
    this.button2Click.emit();
  }
}
