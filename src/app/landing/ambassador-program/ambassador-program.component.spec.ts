import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadorProgramComponent } from './ambassador-program.component';

describe('AmbassadorProgramComponent', () => {
  let component: AmbassadorProgramComponent;
  let fixture: ComponentFixture<AmbassadorProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbassadorProgramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbassadorProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
