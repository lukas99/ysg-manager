import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * The available routes of this app.
 */
export const routes: Routes = [
  {
    // navigate to home if there was NO route
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./feature/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./feature/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    // redirect to home when a route doesn't exist (or or redirect to dedicated "not found" route)
    path: '**',
    redirectTo: 'home'
  }
];

/**
 * The routing module of this app.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
