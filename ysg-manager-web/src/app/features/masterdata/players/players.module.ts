import { NgModule } from '@angular/core';

import { PlayersRoutingModule } from './players-routing.module';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [PlayerListComponent, PlayerDetailComponent],
  imports: [SharedModule, PlayersRoutingModule]
})
export class PlayersModule {}
