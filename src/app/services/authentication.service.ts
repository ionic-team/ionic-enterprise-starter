import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { IonicAuth } from '@ionic-enterprise/auth';
import {
  auth0NativeConfig,
  auth0WebConfig,
} from '../../environments/environment';
import { SessionVaultService } from './session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends IonicAuth {
  constructor(
    private router: Router,
    private vaultService: SessionVaultService
  ) {
    // Determine whether to run on mobile or the web
    super({
      ...(Capacitor.isNativePlatform() ? auth0NativeConfig : auth0WebConfig),
      tokenStorageProvider: vaultService.getVault(),
    });
  }

  // Event fired by Auth Connect upon successful login to auth provider.
  async onLoginSuccess(response) {
    console.log(response);
    await this.vaultService.setValue('session', response);
    await this.vaultService.initializeUnlockMode();
    await this.router.navigate(['/']);
  }

  async logout() {
    await this.vaultService.clear();
    return await super.logout();
  }

  async onLogout() {
    await this.vaultService.setUnlockMode('NeverLock');
    return await this.router.navigate(['login']);
  }
}
