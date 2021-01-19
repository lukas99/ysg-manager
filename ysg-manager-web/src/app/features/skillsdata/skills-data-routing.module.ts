import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkillsDataComponent } from './skills-data.component';

const routes: Routes = [
  {
    path: '',
    component: SkillsDataComponent,
    children: [
      {
        path: 'skills',
        loadChildren: () =>
          import('./skills/skills.module').then((m) => m.SkillsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsDataRoutingModule {}
