import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  BrowserVault,
  IdentityVaultConfig,
  Vault,
} from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root',
})
export class VaultFactoryService {
  constructor() {}

  create(config: IdentityVaultConfig): Vault | BrowserVault {
    return Capacitor.isNativePlatform()
      ? new Vault(config)
      : new BrowserVault(config);
  }
}
