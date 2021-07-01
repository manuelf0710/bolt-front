import { TestBed } from '@angular/core/testing';

import { SubmenusService } from './submenus.service';

describe('SubmenusService', () => {
  let service: SubmenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
