import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsDataComponent } from './skills-data.component';

describe('SkillsDataComponent', () => {
  let component: SkillsDataComponent;
  let fixture: ComponentFixture<SkillsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsDataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
