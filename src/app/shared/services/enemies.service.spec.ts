import { TestBed } from '@angular/core/testing';

import { EnemiesService } from './enemies.service';

describe('EnemiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnemiesService = TestBed.get(EnemiesService);
    expect(service).toBeTruthy();
  });
});
