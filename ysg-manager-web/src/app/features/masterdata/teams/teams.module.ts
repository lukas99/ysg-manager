import { NgModule } from '@angular/core';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [TeamsComponent],
  imports: [SharedModule, TeamsRoutingModule]
})
export class TeamsModule {}
