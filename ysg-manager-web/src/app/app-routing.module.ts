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
import { OktaAuth, OktaAuthOptions } from '@okta/okta-auth-js';

const config: OktaAuthOptions = {
  clientId: '0oaavzvotnqkm2vUe4x6',
  issuer: 'https://dev-280604.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  scopes: ['openid', 'profile'],
  pkce: true
};
const oktaAuth = new OktaAuth(config);

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
    path: 'tournaments',
    loadChildren: () =>
      import('./features/masterdata/tournaments/tournaments.module').then(
        (m) => m.TournamentsModule
      )
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./features/masterdata/teams/teams.module').then(
        (m) => m.TeamsModule
      )
  },
  {
    path: 'players',
    loadChildren: () =>
      import('./features/masterdata/players/players.module').then(
        (m) => m.PlayersModule
      )
  },
  {
    path: 'skills',
    loadChildren: () =>
      import('./features/skillsdata/skills/skills.module').then(
        (m) => m.SkillsModule
      )
  },
  {
    path: 'skillsonice',
    loadChildren: () =>
      import('./features/skillsonice/skills-on-ice.module').then(
        (m) => m.SkillsOnIceModule
      )
  },
  {
    path: 'skillresults',
    loadChildren: () =>
      import('./features/skillsdata/skill-results/skill-results.module').then(
        (m) => m.SkillResultsModule
      )
  },
  {
    path: 'skillratings',
    loadChildren: () =>
      import('./features/skillsdata/skill-ratings/skill-ratings.module').then(
        (m) => m.SkillRatingsModule
      )
  },
  {
    path: 'skillrankings',
    loadChildren: () =>
      import('./features/skillsdata/skill-rankings/skill-rankings.module').then(
        (m) => m.SkillRankingsModule
      )
  },
  {
    path: 'skilltournamentrankings',
    loadChildren: () =>
      import(
        './features/skillsdata/skill-tournament-rankings/skill-tournament-rankings.module'
      ).then((m) => m.SkillTournamentRankingsModule)
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
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
