import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { delay, filter, mapTo, takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';

/**
 * The main component of this app which contains the basic layout structure.
 *
 * Side navigation inspired by https://github.com/thisiszoaib/angular-responsive-sidebar
 */
@Component({
  standalone: false,
  selector: 'ysg-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isOnline = true;
  isAuthenticated = false;
  isAdmin = false;
  isSkillOperator = false;
  private destroy = new Subject<void>();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private observer: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeOnlineStatus();
    this.initializeAuthentication();
  }

  private initializeOnlineStatus() {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).subscribe((isOnline) => (this.isOnline = isOnline));
  }

  private initializeAuthentication(): void {
    this.oidcSecurityService
      .checkAuth()
      .pipe(takeUntil(this.destroy))
      .subscribe((loginResponse: LoginResponse) => {
        this.isAuthenticated = loginResponse.isAuthenticated;
        const jwt = jwtDecode(loginResponse.accessToken);
        this.isSkillOperator = this.hasRole(jwt, 'YSG_SKILL_OPERATOR');
        this.isAdmin = this.hasRole(jwt, 'YSG_ADMIN');
      });
  }

  private hasRole(jwt: JwtPayload, role: string): boolean {
    const roles: string[] = (jwt as any).realm_access.roles;
    return roles.includes(role);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), takeUntil(this.destroy))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        takeUntil(this.destroy),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}
