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
    private sessionVault: SessionVaultService
  ) {
    super({
      ...(Capacitor.isNativePlatform() ? auth0NativeConfig : auth0WebConfig),
      tokenStorageProvider: sessionVault.getVault(),
    });
  }

  async onLoginSuccess(response) {
    await this.sessionVault.setValue('session', response);
    await this.sessionVault.initializeUnlockMode();
    await this.router.navigate(['/']);
  }

  async logout() {
    await this.sessionVault.clear();
    return await super.logout();
  }

  async onLogout() {
    await this.sessionVault.setUnlockMode('NeverLock');
    return await this.router.navigate(['login']);
  }
}
