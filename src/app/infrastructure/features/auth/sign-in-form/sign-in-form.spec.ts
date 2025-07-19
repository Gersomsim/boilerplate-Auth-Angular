import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInForm } from './sign-in-form';

describe('SignInForm', () => {
  let component: SignInForm;
  let fixture: ComponentFixture<SignInForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
