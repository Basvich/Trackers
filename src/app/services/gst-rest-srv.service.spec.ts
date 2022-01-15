import { TestBed } from '@angular/core/testing';

import { GstRestSrvService } from './gst-rest-srv.service';

describe('GstRestSrvService', () => {
  let service: GstRestSrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstRestSrvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
