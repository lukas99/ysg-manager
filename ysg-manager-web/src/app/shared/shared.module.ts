import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudDetailComponent } from './crud/crud-detail/crud-detail.component';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { CrudListComponent } from './crud/crud-list/crud-list.component';
import { MoreActionsComponent } from './more-actions/more-actions.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MobilePageTitleComponent } from './mobile/page-title/mobile-page-title.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

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
  declarations: [
    CrudListComponent,
    CrudDetailComponent,
    MoreActionsComponent,
    ConfirmationDialogComponent,
    MobilePageTitleComponent,
    ProgressBarComponent
  ],
  imports: [
    // angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    A11yModule, // for cursor focus configuration in forms

    // ngx-translate
    TranslateModule,

    // material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatProgressBarModule,

    // agGrid
    AgGridModule.withComponents([])
  ],
  exports: [
    // angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    A11yModule,

    // ngx-translate
    TranslateModule,

    // material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatProgressBarModule,

    // agGrid
    AgGridModule,

    // declared components
    CrudListComponent,
    CrudDetailComponent,
    MoreActionsComponent,
    MobilePageTitleComponent,
    ProgressBarComponent
  ],
  providers: [] // should stay empty
})
export class SharedModule {}
