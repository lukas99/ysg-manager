import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Core module with all the core application wide singleton services which will be loaded eagerly
 * and we will need from straight from application startup and will be used throughout the whole
 * application.
 */
@NgModule({
  declarations: [LoginComponent],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule
  ],
  exports: [LoginComponent]
})
export class CoreModule {}
