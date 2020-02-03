import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelupModalComponent } from './levelup-modal.component';

describe('LevelupModalComponent', () => {
  let component: LevelupModalComponent;
  let fixture: ComponentFixture<LevelupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
