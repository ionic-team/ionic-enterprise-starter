import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { SessionVaultService } from '../services/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionVault: SessionVaultService,
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const hasSession = await this.sessionVault.hasSession();
      if (hasSession) {
        return this.unlock();
      } else {
        return this.routeToLogin();
      }
    } else {
      return await this.checkAuth();
    }
  }

  private async unlock() {
    try {
      await this.sessionVault.unlock();
      return await this.checkAuth();
    } catch (error) {
      // you could alert or otherwise set an error message
      // the most common failure is the user cancelling, so we just don't navigate
      console.error(error);
      return this.routeToLogin();
    }
  }

  private async checkAuth() {
    const authed = await this.authService.isAuthenticated();
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean {
    this.navCtrl.navigateRoot('/login');
    return false;
  }
}
