import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordLink } from './forgot-password-link';

describe('ForgotPasswordLink', () => {
  let component: ForgotPasswordLink;
  let fixture: ComponentFixture<ForgotPasswordLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
