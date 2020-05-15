import { NgModule } from '@angular/core';
import { MasterdataRoutingModule } from './masterdata-routing.module';
import { MasterdataComponent } from './masterdata.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MasterdataComponent],
  imports: [SharedModule, MasterdataRoutingModule]
})
export class MasterdataModule {}
