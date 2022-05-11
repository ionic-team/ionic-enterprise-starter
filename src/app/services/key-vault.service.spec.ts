import { TestBed } from '@angular/core/testing';

import { KeyVaultService } from './key-vault.service';

describe('KeyVaultService', () => {
  let service: KeyVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
