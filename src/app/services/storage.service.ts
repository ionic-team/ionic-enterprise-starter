import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage/ngx';
import { Storage } from '@ionic/storage-angular';
import { VaultService } from './vault.service';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
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
