import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsComponent } from './tournaments.component';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TournamentsComponent', () => {
  let component: TournamentsComponent;
  let fixture: ComponentFixture<TournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentsComponent],
      imports: [SharedModule, HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
