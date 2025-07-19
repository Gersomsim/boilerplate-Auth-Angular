import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedEmailPage } from './verified-email-page';

describe('VerifiedEmailPage', () => {
  let component: VerifiedEmailPage;
  let fixture: ComponentFixture<VerifiedEmailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedEmailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
