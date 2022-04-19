import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { takeUntil } from 'rxjs/operators';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';

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

  constructor(
    private authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth
  ) {}

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state changes
    this.authStateService.authState$
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (authState: AuthState) =>
          (this.isAuthenticated = !!authState.isAuthenticated)
      );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
