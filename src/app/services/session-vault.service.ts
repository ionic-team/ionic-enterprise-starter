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
import { Subject } from 'rxjs';
import { VaultFactoryService } from './vault-factory.service';

export type UnlockMode = 'Device' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

const vaultConfig: IdentityVaultConfig = {
  key: 'io.ionic.enterprisestarter',
  type: VaultType.SecureStorage,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 2,
  unlockVaultOnLoad: false,
};

@Injectable({ providedIn: 'root' })
export class SessionVaultService {
  private vault: Vault | BrowserVault;
  private lockedSubject: Subject<boolean>;

  constructor(private vaultFactory: VaultFactoryService) {
    this.init();
  }

  public async init() {
    this.vault = this.vaultFactory.create(vaultConfig);

    this.lockedSubject = new Subject();

    this.vault.onLock(() => this.lockedSubject.next(true));
    this.vault.onUnlock(() => this.lockedSubject.next(false));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public get locked() {
    return this.lockedSubject.asObservable();
  }

  public getVault() {
    return this.vault;
  }

  public async hasSession() {
    return !(await this.vault.isEmpty());
  }

  public async clear() {
    return this.vault.clear();
  }

  public async lock() {
    return this.vault.lock();
  }

  public async unlock() {
    return this.vault.unlock();
  }

  public async canUnlock(): Promise<boolean> {
    return (await this.hasSession()) && (await this.vault.isLocked());
  }

  getValue(key: string): Promise<any> {
    return this.vault.getValue(key);
  }

  setValue(key: string, value: any): Promise<void> {
    return this.vault.setValue(key, value);
  }

  public async initializeUnlockMode() {
    if (Capacitor.isNativePlatform()) {
      if (await Device.isSystemPasscodeSet()) {
        await this.setUnlockMode('Device');
      } else {
        await this.setUnlockMode('SessionPIN');
      }
    }
  }

  public setUnlockMode(unlockMode: UnlockMode): Promise<void> {
    let type: VaultType;
    let deviceSecurityType: DeviceSecurityType;

    switch (unlockMode) {
      case 'Device':
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Both;
        break;

      case 'SessionPIN':
        type = VaultType.CustomPasscode;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      case 'ForceLogin':
        type = VaultType.InMemory;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      case 'NeverLock':
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      default:
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
    }

    return this.vault.updateConfig({
      ...this.vault.config,
      type,
      deviceSecurityType,
    });
  }
}
