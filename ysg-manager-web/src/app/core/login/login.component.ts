import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'ysg-login',
  templateUrl: 'login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit, OnDestroy {
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
