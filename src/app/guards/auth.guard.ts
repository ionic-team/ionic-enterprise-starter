import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { VaultService } from '../services/vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private vaultService: VaultService,
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const hasSession = await this.vaultService.hasSession();
      if (hasSession) {
        await this.vaultService.unlockVault();
        return await this.checkAuth();
      } else {
        return this.routeToLogin();
      }
    } else {
      return await this.checkAuth();
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
