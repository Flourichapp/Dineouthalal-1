import { TestBed } from '@angular/core/testing';

import { RouteAccessGuard } from './route-access.guard';

describe('RouteAccessGuard', () => {
  let guard: RouteAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RouteAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
