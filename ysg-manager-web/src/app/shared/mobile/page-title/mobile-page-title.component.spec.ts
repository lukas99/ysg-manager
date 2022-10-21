import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePageTitleComponent } from './mobile-page-title.component';

describe('MobilePageTitleComponent', () => {
  let component: MobilePageTitleComponent;
  let fixture: ComponentFixture<MobilePageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobilePageTitleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
