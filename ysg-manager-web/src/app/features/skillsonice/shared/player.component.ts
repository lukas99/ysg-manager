import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player, PlayerPosition } from '../../../types';

@Component({
  selector: 'ysg-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  positionSkater: PlayerPosition = PlayerPosition.SKATER;
  positionGoaltender: PlayerPosition = PlayerPosition.GOALTENDER;

  @Input() player!: Player;
  @Output() playerChange = new EventEmitter<Player>();

  shirtNumberChanged() {
    this.playerChange.next(this.player);
  }

  playerPositionSelected(isSkater: boolean) {
    if (isSkater) {
      this.player.position = PlayerPosition.SKATER;
    } else {
      this.player.position = PlayerPosition.GOALTENDER;
    }
    this.playerChange.next(this.player);
  }
}
