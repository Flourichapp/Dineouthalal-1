import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionsComponent } from './subcriptions.component';

describe('SubcriptionsComponent', () => {
  let component: SubcriptionsComponent;
  let fixture: ComponentFixture<SubcriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
