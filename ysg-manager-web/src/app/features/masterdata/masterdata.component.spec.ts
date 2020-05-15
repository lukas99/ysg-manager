import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterdataComponent } from './masterdata.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../../core/core.module';

describe('MasterdataComponent', () => {
  let component: MasterdataComponent;
  let fixture: ComponentFixture<MasterdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MasterdataComponent],
      imports: [CoreModule, SharedModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
