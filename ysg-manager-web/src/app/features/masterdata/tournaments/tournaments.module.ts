import { NgModule } from '@angular/core';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';

@NgModule({
  declarations: [TournamentListComponent, TournamentDetailComponent],
  imports: [SharedModule, TournamentsRoutingModule],
  providers: []
})
export class TournamentsModule {}
