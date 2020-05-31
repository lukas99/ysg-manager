import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';
import { Tournament } from '../../../types';

@Component({
  selector: 'ysg-tournaments',
  templateUrl: 'tournaments.component.html',
  styleUrls: ['tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  tournaments: Observable<Tournament[]> = EMPTY;
  displayedColumns: string[] = ['name', 'dateDescription', 'actions'];

  constructor(private tournamentsService: TournamentsService) {}

  ngOnInit(): void {
    this.tournaments = this.tournamentsService.getTournaments();
  }
}
