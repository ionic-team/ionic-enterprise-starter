import { TestBed } from '@angular/core/testing';

import { SessionVaultService } from './session-vault.service';

describe('SessionVaultService', () => {
  let service: SessionVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
