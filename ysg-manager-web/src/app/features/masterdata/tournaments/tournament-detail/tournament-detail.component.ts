import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../types';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'ysg-tournament-detail',
  templateUrl: 'tournament-detail.component.html',
  styleUrls: ['tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {
  tournament$: Observable<Tournament> = EMPTY;

  constructor(private tournamentsService: TournamentsService) {}

  ngOnInit(): void {
    this.tournament$ = this.tournamentsService.getSelectedTournament();
  }
}
