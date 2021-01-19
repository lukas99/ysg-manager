import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsDataComponent } from './skills-data.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SkillsDataComponent', () => {
  let component: SkillsDataComponent;
  let fixture: ComponentFixture<SkillsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsDataComponent],
      imports: [CoreModule, SharedModule, RouterTestingModule]
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
