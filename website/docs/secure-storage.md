---
sidebar_label: "Securing App Data"
sidebar_position: 8
---

# Securing Your App's Data

In any Enterprise application, users are bound to perform transactions to store data. This could inlcude authentication information, app settings, data your SaaS is providing, etc. Thus, it is crucial that this information is stored securely on whichever platform the user is operating on. [Ionic Secure Storage](https://ionic.io/products/secure-storage) provides this utility.

Ionic Secure Storage is a cross-platform local database system for high performance, secure data storage on iOS and Android. It provides full SQL query and relational data support through [SQLite](https://www.sqlite.org/index.html), as well as key/value support for simpler use cases when used with the [Ionic Storage](https://github.com/ionic-team/ionic-storage) utility library. Full encryption support (using 256-bit AES) is provided out of the box for security sensitive applications.

<iframe
  src="https://www.loom.com/embed/ecd290e065aa42db8bbffc06cf1a5677"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

## Installing Secure Storage

Just as Auth Connect was installed, we will perform a similar command to get Secure Storage installed and sync'ed with the native app properties:

```bash
npm install @ionic-enterprise/secure-storage
npx cap sync
```

## Key Value Support

While Ionic Secure Storage provides a powerful SQLite-backed data store, it also has support for key/value functionality for simpler use cases or when data will fit in memory and querying can be done in JavaScript. Key/value support is provided by the companion [`@ionic/storage`](https://github.com/ionic-team/ionic-storage) utility which provides a generic storage API that works across multiple platforms, abstracting away storage engine details and providing a simple API with low overhead.

Support for encryption and SQLite is available when running on iOS and Android and using the Ionic Secure Storage driver for `@ionic/storage`. We will touch on that in greater detail soon.

In order to use key/value storage in our app as well, we first need to install like Angular specific library:

```bash
npm install @ionic/storage-angular
```

## Creating a Storage Service

After making Secure Storage available to the application, including key/value support, we will setup a service to handle our storage logic.

First, we generate the service:

```bash
ionic g service services/storage
```

<iframe
  src="https://www.loom.com/embed/66d11da5d7d4471b82f88df02f3cd03f"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

In the newly created service, we first initial the `storage` object and specify the order in which we prefer to use the storage drivers. Next, we will add logic to support storage natively on iOS and Android, as well as support for storage on the web and simple use cases.

```typescript title="src/app/services/storage.service.ts"
import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import IonicSecureStorageDriver from "@ionic-enterprise/secure-storage/driver";
import { SQLite, SQLiteObject } from "@ionic-enterprise/secure-storage/ngx";
import { Drivers } from "@ionic/storage";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private storage: Storage;
  private database: SQLiteObject;

  constructor(private ngStorage: Storage, private sqlite: SQLite) {
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
    // Initialize Ionic Storage for web and basic native support
    await this.ngStorage.defineDriver(IonicSecureStorageDriver);
    this.storage = await this.ngStorage.create();

    if (Capacitor.isNativePlatform()) {
      // Create or open a table
      try {
        const db = await this.sqlite.create({
          name: "enterprisestarter.db", // The name of your database
          location: "default",
          // Key/Password used to encrypt the database
          // Strongly recommended to use Identity Vault to manage this
          key: "password",
        });

        this.database = db;

        // Create our initial schema
        await db.executeSql(
          "", // Example: 'CREATE TABLE IF NOT EXISTS software(name, company, type version)'
          []
        );
      } catch (e) {
        console.error("Unable to initialize database", e);
      }
    }
  }
}
```

## Next up

To ensure your app's data is as secure as possible, it is best to also use encryption. We will now go ahead and add an extra layer of protection for your users.
