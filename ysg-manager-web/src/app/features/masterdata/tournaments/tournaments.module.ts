import { NgModule } from '@angular/core';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentListComponent } from './tournament-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [TournamentListComponent],
  imports: [SharedModule, TournamentsRoutingModule]
})
export class TournamentsModule {}
