import { Component, OnDestroy, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-login',
  templateUrl: 'login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit, OnDestroy {
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
