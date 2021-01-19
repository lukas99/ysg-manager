import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent
} from '@okta/okta-angular';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/authentication/auth.interceptor';

const oktaConfig = {
  clientId: '0oaavzvotnqkm2vUe4x6',
  issuer: 'https://dev-280604.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  scopes: ['openid', 'profile'],
  pkce: true
};

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
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'masterdata',
    loadChildren: () =>
      import('./features/masterdata/masterdata.module').then(
        (m) => m.MasterdataModule
      )
  },
  {
    path: 'skillsdata',
    loadChildren: () =>
      import('./features/skillsdata/skills-data.module').then(
        (m) => m.SkillsDataModule
      )
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
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    OktaAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
