import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFieldErrors } from './ui-field-errors';

describe('UiFieldErrors', () => {
  let component: UiFieldErrors;
  let fixture: ComponentFixture<UiFieldErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFieldErrors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiFieldErrors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
