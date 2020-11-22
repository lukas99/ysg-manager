import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { SharedModule } from '../shared/shared.module';
import { TournamentPickerComponent } from './tournament-picker/tournament-picker.component';

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

    // ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslationLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [LoginComponent, LanguagePickerComponent, TournamentPickerComponent]
})
export class CoreModule {}
