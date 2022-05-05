import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { IonicAuth } from '@ionic-enterprise/auth';
import {
  auth0NativeConfig,
  auth0WebConfig,
} from '../../environments/environment';
import { VaultService } from './vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends IonicAuth {
  constructor(private router: Router, private vaultService: VaultService) {
    // Determine whether to run on mobile or the web
    super({
      ...(Capacitor.isNativePlatform() ? auth0NativeConfig : auth0WebConfig),
      tokenStorageProvider: vaultService.getVault(),
    });
  }

  // Event fired by Auth Connect upon successful login to auth provider.
  async onLoginSuccess() {
    await this.router.navigate(['/']);
  }

  async logout() {
    await this.vaultService.clear();
    return await super.logout();
  }

  async onLogout() {
    return await this.router.navigate(['login']);
  }
}
