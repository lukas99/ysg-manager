import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { SharedModule } from '../shared/shared.module';
import { TournamentPickerComponent } from './tournament-picker/tournament-picker.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth, OktaAuthOptions } from '@okta/okta-auth-js';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

const config: OktaAuthOptions = {
  clientId: '0oaavzvotnqkm2vUe4x6',
  issuer: 'https://dev-280604.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  scopes: ['openid', 'profile'],
  pkce: true
};
const oktaAuth = new OktaAuth(config);

/**
 * Import HttpClient with TranslateHttpLoader to load translation files using this factory method.
 */
export function TranslationLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/**
 * Core module with all the core application wide singleton services which will be loaded eagerly
 * and we will need from straight from application startup and will be used throughout the whole
 * application.
 */
@NgModule({
  declarations: [
    LoginComponent,
    LanguagePickerComponent,
    TournamentPickerComponent
  ],
  imports: [
    SharedModule,

    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,

    // okta
    OktaAuthModule,

    // ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslationLoaderFactory,
        deps: [HttpClient]
      }
    }),

    // angular2-hotkeys
    HotkeyModule.forRoot()
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  exports: [
    OktaAuthModule,
    LoginComponent,
    LanguagePickerComponent,
    TournamentPickerComponent
  ]
})
export class CoreModule {}
