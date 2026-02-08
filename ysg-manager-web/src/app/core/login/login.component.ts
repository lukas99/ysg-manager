import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-login',
  templateUrl: 'login.component.html',
  styleUrls: [],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private destroy = new Subject<void>();

  constructor(private oidcSecurityService: OidcSecurityService) {}

  async ngOnInit() {
    // Subscribe to authentication state changes
    this.oidcSecurityService
      .isAuthenticated()
      .pipe(takeUntil(this.destroy))
      .subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  protected signIn() {
    this.oidcSecurityService.authorize();
  }

  protected signOut() {
    this.oidcSecurityService.logoff().subscribe((_) => {});
  }
}
