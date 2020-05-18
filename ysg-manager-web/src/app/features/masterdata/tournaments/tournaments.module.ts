import { NgModule } from '@angular/core';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsComponent } from './tournaments.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [TournamentsComponent],
  imports: [SharedModule, TournamentsRoutingModule]
})
export class TournamentsModule {}
