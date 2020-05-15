import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Contains reusable components, pipes and directives (declarables) that will be used by lazy
 * features.
 *
 * Shared module will be imported by many lazy loaded features and because of that it should
 * NEVER implement any services (providers: [ ]) and only contain declarables (components,
 * directives and pipes) and modules (which only contain declarables).
 *
 * The reason for that is that every lazy loaded module would get its own service instance
 * which is almost never what we want because in most cases we expect services to be global
 * singletons!
 *
 * If we want create “shared” services used in many parts of our application we should
 * implement them in the /core folder and use providedIn: 'root' syntax without putting them
 * in providers: [ ] of any module
 */
@NgModule({
  declarations: [],
  imports: [
    // angular
    CommonModule,

    // material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    // angular
    CommonModule,

    // material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [] // should stay empty
})
export class SharedModule {}
