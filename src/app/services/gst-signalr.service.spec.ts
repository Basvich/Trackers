import { TestBed } from '@angular/core/testing';

import { GstSignalrService } from './gst-signalr.service';

describe('GstSignalrService', () => {
  let service: GstSignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstSignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
