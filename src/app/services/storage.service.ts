import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';
import { SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage/ngx';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { KeyVaultService } from './key-vault.service';

@Injectable({
  providedIn: 'root',
})
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
