import { TestBed } from '@angular/core/testing';

import { VaultFactoryService } from './vault-factory.service';

describe('VaultFactoryService', () => {
  let service: VaultFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaultFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
