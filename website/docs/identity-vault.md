---
sidebar_label: "Encrypting App Data"
sidebar_position: 9
---

# Encrypting Your App's Data

Ionic Secure Storage creates the ultimate protection when paired with [Ionic Identity Vault](https://ionic.io/products/identity-vault). Identity Vault is an all-in-one frontend identity management system that combines security best practices and the latest in biometric authentication options for Ionic apps running on iOS and Android.

The Vault manages secure user identity and session tokens, ensuring sensitive data is encrypted at rest, stored only in secure locations on the device, and unlocked only with biometric identity (TouchID/FaceID). Always-on Session Management safeguards data even when not using your app, with background screen protection for sensitive data and apps, and automatic logout based on inactivity time.

## Installing Identity Vault

Identity Vault is added to your app in the same fashion as Auth Connect and Secure Storage:

```bash
npm install @ionic-enterprise/identity-vault
npx cap sync
```

Given our usage of Capacitor with this example as well, we will also need to update the iOS project's `Info.plist` file. The addition of the required FaceID Usage Description will look as follows:

```xml title="ios/App/App/Info.plist"
...
<key>NSFaceIDUsageDescription</key>
<string>Use Face ID to authenticate yourself and login</string>
...
```

For Android SDK 30+, this is configured in the build.gradle file for Capacitor. Capacitor 2 and above is supported. If using Capacitor 3, ensure Capacitor dependencies are >=3.0.2.

## Creating Key and Vault Services

Similarly to using Auth Connect and Secure Storage as well, we can create a service that defines the vault and methods that abstract all of the logic we need in order to interact with the vault:

```bash
ionic g service services/vault
```

Within this newly created `VaultService` we will need to use an encryption key. The logic to generate this key will be abstracted out into its own `KeyService`. This is generated as follows:

```bash
ionic g service services/key
```

Now that the services have been generated, we can step through creating the individual parts of each.

## Creating Encryption Key

You will notice in the section to follow that one of the vault's helper functions, `getEncryptionKey()`, uses the `KeyService`. The vault, which we will soon create, stores values by key, which is done by our `set()` function:

```typescript title="src/app/services/vault.service.ts"
...

private async set(key: string, value: string): Promise<void> {
  await this.vault.setValue(key, value);
}

...
```

Next, create the `getEncryptionKey()` function to retrieve the encryption key from on-device storage. If the key was previously stored in Identity Vault, return it. Otherwise, use the `KeyService` to obtain an encryption key, then save it into Identity Vault using the `set()` function we just made:

```typescript title="src/app/services/vault.service.ts"
public async getEncryptionKey(): Promise<string> {
  let dbKey = await this.vault.getValue(this.encryptionKey);

  if (!dbKey) {
    dbKey = await this.keyService.get();
    this.set(this.encryptionKey, dbKey);
  }
  return dbKey;
}
```

The `get()` function within the `KeyService` will look as follows:

```typescript title="src/app/services/key.service.ts"
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class KeyService {
  // Generate an encryption key on the fly unique to the current app user
  // Reference: https://stackoverflow.com/a/2117523/180424
  async get(): Promise<string> {
    // generate a UUID v4
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 || 0;
      const v = c === "x" ? r : (r && 0x3) || 0x8;
      return v.toString(16);
    });
  }
}
```

The above shows the approach of auto-generating a unique encryption key on demand, tied to the authenticated user. However, another approach could be to retrieve the key from a server through an API call.

### Define Vault Configuration

First things first, we need to define a configuration for the vault. The `key` gives the vault a name. The other properties provide a default behavior for our vault. The configuration shown below is not all inclusive, [there are additional properties](https://ionic.io/docs/identity-vault/interfaces/identityvaultconfig) that can be used. Further, the vault can also be dynamically through app usage if that suits your app's needs:

```typescript title="src/app/services/vault.service.ts"
...

const config: IdentityVaultConfig = {
  key: "io.ionic.enterprisestarter",
  type: VaultType.DeviceSecurity,
  deviceSecurityType: DeviceSecurityType.Both,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 3,
  unlockVaultOnLoad: true,
};

@Injectable({ providedIn: 'root' })
export class VaultService {
  ...
}
```

### Define Data Storage Key

Next, we define a key for storing data. All data within the vault is stored as a key-value pair and you can store multiple key-value pairs within a single vault:

```typescript title="src/app/services/vault.service.ts"
...
export class VaultService {
  private encryptionKey = 'encryption-key';

  ...
}
```

### Create the Vault

With the vault config defined, and a storage key that will be used to identity the data we need to grab from the vault, we can create the vault in our service:

```typescript title="src/app/services/vault.service.ts"
...
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
```

The service additionally contains functions that will assist in checking for a session's existance, locking/unlocking the vault, clearing the vault, and setting a session within the vault. Further, we have added logic to hide the screen when the app is in the background to further secure the user's data.

Note that we are using the `BrowserVault` class when the application is running on the web. The `BrowserVault` allows us to continue to use our normal web-based development workflow. Again, Capacitor was used to here to determine which type of device the app is running on and configure the vault appropriately.

### Initialize the Vault

We still need to initialize the `VaultService` when the application starts up. This can be done in the `AppModule` via Angular's `APP_INITIALIZER` depencency injection token:

```typescript title="src/app/app.module.ts"
import { APP_INITIALIZER, NgModule } from '@angular/core';
...

const appInitFactory =
  (vaultService: VaultService): (() => Promise<void>) =>
  () =>
    vaultService.init();

@NgModule({
  declarations: [AppComponent],
  // ...
  providers: [
    ...
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [VaultService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

With that, the vault is in place and properly initialized when the app boots up!

## Secure Storage with Encryption

Bringing encryption full-circle, we can now utilize the `VaultService` to upgrade the app's database key:

```typescript title="src/app/services/storage.service.ts"
...
export class StorageService {
  private storage: Storage;
  private database: SQLiteObject;

  constructor(
    private ngStorage: Storage,
    private sqlite: SQLite,
    private vaultService: VaultService
  ) {
    this.init();
  }

  private async init() {
    // Obtain encryption key
    const encryptionKey = await this.vaultService.getEncryptionKey();

    // Initialize Ionic Storage for web and basic native support
    await this.ngStorage.defineDriver(IonicSecureStorageDriver);
    await this.ngStorage.setEncryptionKey(encryptionKey);
    this.storage = await this.ngStorage.create();

    if (Capacitor.isNativePlatform()) {
      // Create or open a table
      try {
        const db = await this.sqlite.create({
          name: 'enterprisestarter.db',
          location: 'default',
          // Key/Password used to encrypt the database
          // Strongly recommended to use Identity Vault to manage this
          key: encryptionKey,
        });

        this.database = db;

        // Create our initial schema
        await db.executeSql(
          '', // Example: 'CREATE TABLE IF NOT EXISTS software(name, company, type, version)'
          []
        );
      } catch (e) {
        console.error('Unable to initialize database', e);
      }
    }
  }
}
```

This shows how with Secure Storage and Identity Vault used in tandem developers can safely store and manage their encryption key on device, and enable biometric authentication to secure sensitive data against theft, loss, or jailbreaking.

## Next Up

Our enterprise app is progressing nicely. To get it over the finish line, we can make some quick updates to the `AuthenticationService`.
