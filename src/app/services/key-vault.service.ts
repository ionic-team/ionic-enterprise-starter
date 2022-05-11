import { Injectable } from '@angular/core';
import {
  IdentityVaultConfig,
  VaultType,
  DeviceSecurityType,
  BrowserVault,
  Vault,
} from '@ionic-enterprise/identity-vault';
import { KeyService } from './key.service';
import { VaultFactoryService } from './vault-factory.service';

const vaultConfig: IdentityVaultConfig = {
  key: 'io.ionic.enterprisestarterkeys',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  unlockVaultOnLoad: false,
};

const databaseKey = 'database-key';
@Injectable({
  providedIn: 'root',
})
export class KeyVaultService {
  private vault: Vault | BrowserVault;

  constructor(
    private keyService: KeyService,
    private vaultFactory: VaultFactoryService
  ) {
    this.vault = this.vaultFactory.create(vaultConfig);
  }

  public async getDatabaseKey(): Promise<string> {
    let dbKey = await this.vault.getValue(databaseKey);

    if (!dbKey) {
      dbKey = await this.keyService.get();
      this.vault.setValue(databaseKey, dbKey);
    }
    return dbKey;
  }
}
