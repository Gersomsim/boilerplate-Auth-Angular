import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLink } from './register-link';

describe('RegisterLink', () => {
  let component: RegisterLink;
  let fixture: ComponentFixture<RegisterLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
