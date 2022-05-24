---
sidebar_label: 'Encrypting App Data'
sidebar_position: 9
---

# Encrypting Your App's Data

Ionic Secure Storage creates the ultimate protection when paired with [Ionic Identity Vault](https://ionic.io/products/identity-vault). Identity Vault is an all-in-one frontend identity management system that combines security best practices and the latest in biometric authentication options for Ionic apps running on iOS and Android.

The Vault manages secure user identity and session tokens, ensuring sensitive data is encrypted at rest, stored only in secure locations on the device, and unlocked only with biometric identity (TouchID/FaceID). Always-on Session Management safeguards data even when not using your app, with background screen protection for sensitive data and apps, and automatic logout based on inactivity time.

## Installing Identity Vault

<iframe
  src="https://www.loom.com/embed/8e54e56f66714351990ab1c939203024"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

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

<iframe
  src="https://www.loom.com/embed/0a39546bbaf446f4b52f0fd90cda2389"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

Similarly to using Auth Connect and Secure Storage, we can create a few services that define multiple vaults, assist in creating each vault, and provide storage keys:

```bash
ionic g service services/vault-factory
ionic g service services/key-vault
ionic g service services/session-vault
ionic g service services/key
```

The purpose of the newly created `VaultFactoryService` is to accept `IdentityVaultConfig` options with a `create()` function and return either a `Vault` or `BrowserVault` object. Since we will have multiple vaults in our app, this avoids code duplication and simplifies the process:

```typescript title="src/app/services/vault-factory.service.ts"
...
import { Capacitor } from '@capacitor/core';
import {
  BrowserVault,
  IdentityVaultConfig,
  Vault,
} from '@ionic-enterprise/identity-vault';

...
export class VaultFactoryService {
  constructor() {}

  create(config: IdentityVaultConfig): Vault | BrowserVault {
    return Capacitor.isNativePlatform()
      ? new Vault(config)
      : new BrowserVault(config);
  }
}

```

Note that we are using the `BrowserVault` class when the application is running on the web. The `BrowserVault` allows us to continue to use our normal web-based development workflow. Again, `Capacitor` was used to here to determine which type of device the app is running on and configure the vault appropriately.

With the `VaultFactoryService` create and the other services generated, we can step through creating the individual parts of each.

## Getting an Encryption Key

You will notice in the section to follow that one of the vault's helper functions, `getDatabaseKey()`, uses the `KeyService`. The purpose of the `getDatabaseKey()` function is to retrieve an encryption key from on-device storage. If the key was previously stored in the vault, return it. Otherwise, use the `KeyService` to obtain a new encryption key and save it into the vault using the `setValue()` function:

```typescript title="src/app/services/key-vault.service.ts"
public async getDatabaseKey(): Promise<string> {
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
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  // Generate an encryption key on the fly unique to the current app user
  // Reference: https://stackoverflow.com/a/2117523/180424
  async get(): Promise<string> {
    // generate a UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 || 0;
      const v = c === 'x' ? r : (r && 0x3) || 0x8;
      return v.toString(16);
    });
  }
}
```

:::note
The above shows the approach of auto-generating a unique encryption key on demand, tied to the authenticated user. However, another approach could be to retrieve the key from a server through an API call.
:::

### Define Key Vault Configuration

First things first, we need to define a configuration for the vault. The `key` gives the vault a name. The other properties provide a default behavior for our vault. The configuration shown below is not all inclusive, [there are additional properties](https://ionic.io/docs/identity-vault/interfaces/identityvaultconfig) that can be used. Further, the vault can also be dynamically through app usage if that suits your app's needs:

```typescript title="src/app/services/key-vault.service.ts"
...

const vaultConfig: IdentityVaultConfig = {
  key: 'io.ionic.enterprisestarterkeys',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  unlockVaultOnLoad: false,
};

@Injectable({ providedIn: 'root' })
export class KeyVaultService {
  ...
}
```

### Define Data Storage Key

Next, we define a key for storing data. All data within the vault is stored as a key-value pair and you can store multiple key-value pairs within a single vault if need be:

```typescript title="src/app/services/key-vault.service.ts"
...

const databaseKey = 'database-key';

...
export class VaultService {
  ...
}
```

### Create the Key Vault

<iframe
  src="https://www.loom.com/embed/ae5f216a16e8481ab27c00ecad01ce89"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

With the vault config defined, and a storage key that will be used to identity the data we need to grab from the vault, we can create the remainder of the key vault. The all encompassing result will look as follows:

```typescript title="src/app/services/key-vault.service.ts"
...
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
```

## Secure Storage with Encryption

<iframe
  src="https://www.loom.com/embed/37477397bef34cc79c7874ccec566c8f"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

Bringing encryption full-circle, we can now utilize the `KeyVaultService` to upgrade the app's storage with an appropriately encrypted database key:

```typescript title="src/app/services/storage.service.ts"
...
export class StorageService {
  private storage: Storage;
  private database: SQLiteObject;

  constructor(
    private ngStorage: Storage,
    private sqlite: SQLite,
    private keyVault: KeyVaultService
  ) {
    this.storage = new Storage({
      driverOrder: [
        Drivers.SecureStorage,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    });

    this.init();
  }

  private async init() {
    // Obtain encryption key
    const dbKey = await this.keyVault.getDatabaseKey();

    // Initialize Ionic Storage for web and basic native support
    await this.ngStorage.defineDriver(IonicSecureStorageDriver);
    await this.ngStorage.setEncryptionKey(dbKey);
    this.storage = await this.ngStorage.create();

    if (Capacitor.isNativePlatform()) {
      // Create or open a table
      try {
        const db = await this.sqlite.create({
          name: 'enterprisestarter.db',
          location: 'default',
          // Key/Password used to encrypt the database
          // Strongly recommended to use Identity Vault to manage this
          key: dbKey,
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

With the `KeyVaultService` created, we can flesh out the `SessionVaultService` we generated previously.
