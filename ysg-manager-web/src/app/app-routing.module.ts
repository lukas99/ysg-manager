import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * The available routes of this app.
 */
const routes: Routes = [];

/**
 * The routing module of this app.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
