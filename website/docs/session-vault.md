---
sidebar_label: "Session Vault"
---

# Creating the Session Vault

The purpose of the `KeyVaultService` is purely to utilize `SecureStorage` to house the encryption key. Reason-being, the encryption key is often needed prior to the user unlocking the vault. The `SessionVaultService`, on the other hand, can be safely secured behind the vault lock.

## Define Key Vault Configuration

Again, we first need to define a configuration for the vault. The `key` for vault will be slightly different than the `KeyVaultService` used. The other properties provide additional configuration for how this particular vault may behave:

```typescript title="src/app/services/session-vault.service.ts"
...

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
  ...
}
```

You will notice that the `SessionVaultService` also starts out with the type of `SecureStorage`. This is due to the fact that we do not want the initial configuration to fail if the user's device does not have security set up.

<iframe
  src="https://www.loom.com/embed/a0094161d06743dd8c424f8f02976256"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

## Initialize the Vault

We still need to initialize the `SessionVaultService` when the application starts up. This can be done in the `AppModule` via Angular's `APP_INITIALIZER` depencency injection token:

```typescript title="src/app/app.module.ts"
import { APP_INITIALIZER, NgModule } from '@angular/core';
...

const appInitFactory =
  (sessionVault: SessionVaultService): (() => Promise<void>) =>
  () =>
    sessionVault.init();

@NgModule({
  declarations: [AppComponent],
  // ...
  providers: [
    ...
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [SessionVaultService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

<iframe
  src="https://www.loom.com/embed/0083b37ecb9c4d5b97e092b7d4ad08a7"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

Since the `APP_INITIALIZER` is a `Promise` and needs to call a public function within the `SessionVaultService`, a separate `init()` function was created. This will tranform the `SessionVaultService` initialization to look as follows:

```typescript title="src/app/services/session-vault.service.ts"
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
}
```

With that, the session vault is in place and properly initialized when the app boots up!

## Update Session Vault's Unlock Mode

<iframe
  src="https://www.loom.com/embed/491ac6491182485ba87a99c77765454d"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

As previously mentioned, we started the `SessionVaultService` out by using the `SecureStorage` `type` property. However, what we need to do is update both the `type` and `deviceSecurityType` after the user successfully logs in. This is to ensure we are adding as much security to the vault as we can. This involves calling an `initializeUnlockMode` function upon successful login and modify the vault's config.

```typescript title="src/app/services/session-vault.service.ts"
...

export type UnlockMode = 'Device' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

...

export class SessionVaultService {
  ...

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
```

## Define Helper Vault Functions

<iframe
  src="https://www.loom.com/embed/4f3f903db1844180a6a039aafee5de90"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

The `SessionVaultService` will be used to store the logged in user's data and will require helper functions to perform tasks throughout the application. As such, we will update the `SessionVaultService` to include those functions we will need throughout further development and use of the application:

```typescript title="src/app/services/session-vault.service.ts"
...

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

...
```

You can see that these additional functions will assist in checking for a session vault's existance, returning the state of the vault's lock, locking/unlocking the vault, clearing the vault, and getting/setting values within the session vault.

<!-- Further, we have added logic to hide the screen when the app is in the background to further secure the user's data. -->

## Next Up

Our enterprise app is progressing nicely. With the session vault fully configured we make some updates to the `AuthenticationService`.
