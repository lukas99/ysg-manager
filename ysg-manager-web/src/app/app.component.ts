import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { takeUntil } from 'rxjs/operators';

/**
 * The main component of this app which contains the basic layout structure.
 */
@Component({
  selector: 'ysg-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private destroy = new Subject<void>();

  constructor(public oktaAuth: OktaAuthService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
      );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
