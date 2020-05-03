import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

/**
 * Core module with all the core application wide singleton services which will be loaded eagerly
 * and we will need from straight from application startup and will be used throughout the whole
 * application.
 */
@NgModule({
  declarations: [],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule
  ],
  exports: []
})
export class CoreModule {}
