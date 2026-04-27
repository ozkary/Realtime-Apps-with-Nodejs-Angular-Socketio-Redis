import { waitForAsync , TestBed, inject } from '@angular/core/testing';

import { TelemetryService } from './telemetry.service';

describe('TelemetryService', () => {
  beforeEach(waitForAsync ( () => {
    TestBed.configureTestingModule({
      providers: [TelemetryService]
    });
  }));

  it('should be created', inject([TelemetryService], (service: TelemetryService) => {
    expect(service).toBeTruthy();
  }));
});
