import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedEmail } from './verified-email';

describe('VerifiedEmail', () => {
  let component: VerifiedEmail;
  let fixture: ComponentFixture<VerifiedEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
