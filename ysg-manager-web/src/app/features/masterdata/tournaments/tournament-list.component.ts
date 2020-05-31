import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';
import { Tournament } from '../../../types';

@Component({
  selector: 'ysg-tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {
  tournaments: Observable<Tournament[]> = EMPTY;
  displayedColumns: string[] = ['name', 'dateDescription', 'actions'];

  constructor(private tournamentsService: TournamentsService) {}

  ngOnInit(): void {
    this.tournaments = this.tournamentsService.getTournaments();
  }
}
