import { PlayerComponent } from './player.component';
import { Player, PlayerPosition } from '../../../types';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let ngZone: any;

  beforeEach(() => {
    ngZone = {};
    component = new PlayerComponent(ngZone);
  });

  it('emits the player when the shirt number has changed', (done) => {
    let playerModel = {} as Player;
    component.player = playerModel;

    component.playerChange.subscribe((player) => {
      expect(player).toBe(playerModel);
      done();
    });

    component.shirtNumberChanged();
  });

  it('emits the player when the player position was set to SKATER', (done) => {
    let playerModel = { position: PlayerPosition.GOALTENDER } as Player;
    component.player = playerModel;

    component.playerChange.subscribe((player) => {
      expect(player).toBe(playerModel);
      expect(player).toEqual({ position: PlayerPosition.SKATER } as Player);
      done();
    });

    component.playerPositionSelected(true);
  });

  it('emits the player when the player position was set to GOALTENDER', (done) => {
    let playerModel = { position: PlayerPosition.SKATER } as Player;
    component.player = playerModel;

    component.playerChange.subscribe((player) => {
      expect(player).toBe(playerModel);
      expect(player).toEqual({ position: PlayerPosition.GOALTENDER } as Player);
      done();
    });

    component.playerPositionSelected(false);
  });
});
