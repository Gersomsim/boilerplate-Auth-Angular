import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLogo } from './ui-logo';

describe('UiLogo', () => {
  let component: UiLogo;
  let fixture: ComponentFixture<UiLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiLogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
