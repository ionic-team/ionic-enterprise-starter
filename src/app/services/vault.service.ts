import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  BrowserVault,
  Device,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { KeyService } from './key.service';

const config: IdentityVaultConfig = {
  key: 'io.ionic.enterprisestarter',
  type: VaultType.DeviceSecurity,
  deviceSecurityType: DeviceSecurityType.Both,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 3,
  unlockVaultOnLoad: true,
};

@Injectable({ providedIn: 'root' })
export class VaultService {
  private encryptionKey = 'encryption-key';
  private vault: Vault | BrowserVault;

  constructor(private keyService: KeyService) {
    this.init();
  }

  public async init() {
    this.vault = Capacitor.isNativePlatform()
      ? new Vault(config)
      : new BrowserVault(config);

    if (Capacitor.isNativePlatform()) {
      await Device.setHideScreenOnBackground(true);
    }
  }

  public getVault() {
    return this.vault;
  }

  public async getEncryptionKey(): Promise<string> {
    let dbKey = await this.vault.getValue(this.encryptionKey);

    if (!dbKey) {
      dbKey = await this.keyService.get();
      this.set(this.encryptionKey, dbKey);
    }
    return dbKey;
  }

  public async hasSession() {
    const vaultIsEmpty = await this.vault.isEmpty();
    return !vaultIsEmpty;
  }

  public async lockVault() {
    await this.vault.lock();
  }

  public async unlockVault() {
    await this.vault.unlock();
  }

  public async clear() {
    await this.vault.clear();
  }

  private async set(key: string, value: string): Promise<void> {
    await this.vault.setValue(key, value);
  }
}
