import { TestBed } from '@angular/core/testing';

import { KeyService } from './key.service';

describe('KeyService', () => {
  let service: KeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
