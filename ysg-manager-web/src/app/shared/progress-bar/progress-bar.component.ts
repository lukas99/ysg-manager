import { Component, Input } from '@angular/core';

/**
 * Provides a progress bar which can be hidden but then keeps it's space.
 */
@Component({
  selector: 'ysg-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() showProgress = false;
}
