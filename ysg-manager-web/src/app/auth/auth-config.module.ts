import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

/**
 * See:
 * https://github.com/damienbod/angular-auth-oidc-client
 * https://www.angular-auth-oidc-client.com
 */
@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://lemur-10.cloud-iam.com/auth/realms/ysg-manager',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'ysg-manager-web',
        scope: 'openid profile offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        logLevel: LogLevel.Debug
      }
    })
  ],
  exports: [AuthModule]
})
export class AuthConfigModule {}
