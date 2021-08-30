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
      },
      {
        path: 'skillresults',
        loadChildren: () =>
          import('./skill-results/skill-results.module').then(
            (m) => m.SkillResultsModule
          )
      },
      {
        path: 'skillratings',
        loadChildren: () =>
          import('./skill-ratings/skill-ratings.module').then(
            (m) => m.SkillRatingsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsDataRoutingModule {}
