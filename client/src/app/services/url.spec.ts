import { Url } from './url';
import { TestBed } from '@angular/core/testing';

describe('Url', () => {
  let service: Url;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Url);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
