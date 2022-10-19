import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';

/**
 * The main component of this app which contains the basic layout structure.
 *
 * Side navigation inspired by https://github.com/thisiszoaib/angular-responsive-sidebar
 */
@Component({
  selector: 'ysg-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private destroy = new Subject<void>();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private observer: BreakpointObserver,
    private router: Router
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
