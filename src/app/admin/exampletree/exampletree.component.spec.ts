import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampletreeComponent } from './exampletree.component';

describe('ExampletreeComponent', () => {
  let component: ExampletreeComponent;
  let fixture: ComponentFixture<ExampletreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampletreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampletreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
