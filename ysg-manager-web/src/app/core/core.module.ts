import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { SharedModule } from '../shared/shared.module';
import { TournamentPickerComponent } from './tournament-picker/tournament-picker.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { AuthConfigModule } from '../auth/auth-config.module';

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

    // authentication
    AuthConfigModule,

    // ngx-translate
    TranslateModule.forRoot({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        useHttpBackend: true
      })
    }),

    // angular2-hotkeys
    HotkeyModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  exports: [LoginComponent, LanguagePickerComponent, TournamentPickerComponent]
})
export class CoreModule {}
