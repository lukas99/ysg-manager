import { NgModule } from '@angular/core';

import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';

@NgModule({
  declarations: [TeamListComponent, TeamDetailComponent],
  imports: [SharedModule, TeamsRoutingModule]
})
export class TeamsModule {}
