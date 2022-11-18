import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import { Player, PlayerPosition } from '../../../types';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ysg-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements AfterViewInit {
  positionSkater: PlayerPosition = PlayerPosition.SKATER;
  positionGoaltender: PlayerPosition = PlayerPosition.GOALTENDER;

  @ViewChild('shirtNumber') shirtNumberInputField!: ElementRef;

  @Input() player!: Player;
  @Input() disablePositionToggle = false;
  @Output() playerChange = new EventEmitter<Player>();

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    if (!this.player.shirtNumber) {
      // without using ngZone, ExpressionChangedAfterItHasBeenCheckedError whould be thrown
      // when setting focus to input field. See https://stackoverflow.com/a/70841956
      this.ngZone.onMicrotaskEmpty
        .pipe(take(1))
        .subscribe(() => this.shirtNumberInputField.nativeElement.focus());
    }
  }

  shirtNumberChanged() {
    this.playerChange.next(this.player);
  }

  playerPositionSelected(isSkater: boolean) {
    // Setting mat-button-toggle-group only greys out the toggle group but the
    // click events are still firing. Therefore, prevent position change here.
    if (this.disablePositionToggle) {
      return;
    }

    if (isSkater) {
      this.player.position = PlayerPosition.SKATER;
    } else {
      this.player.position = PlayerPosition.GOALTENDER;
    }
    this.playerChange.next(this.player);
  }
}
