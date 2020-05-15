import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { Subject } from 'rxjs';
import { Tournament } from '../../../types';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-tournaments',
  templateUrl: 'tournaments.component.html',
  styleUrls: ['tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  private destroy = new Subject<void>();

  constructor(private tournamentsService: TournamentsService) {}

  ngOnInit(): void {
    this.tournamentsService
      .getTournaments()
      .pipe(takeUntil(this.destroy))
      .subscribe((touraments) => (this.tournaments = touraments));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
