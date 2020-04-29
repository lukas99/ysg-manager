import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";

/**
 * The AppModule which will stay virtually empty for the whole life-time of the project,
 * everything that needs to be available from start will be added to the CoreModule.
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
