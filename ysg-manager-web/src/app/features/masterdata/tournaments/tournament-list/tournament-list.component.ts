import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';
import { Tournament } from '../../../../types';
import { Router } from '@angular/router';
import { TournamentsModuleService } from '../tournaments-module.service';

@Component({
  selector: 'ysg-tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {
  tournaments: Observable<Tournament[]> = EMPTY;
  displayedColumns: string[] = ['name', 'dateDescription', 'actions'];

  constructor(
    private tournamentsService: TournamentsService,
    private tournamentsModuleService: TournamentsModuleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournaments = this.tournamentsService.getTournaments();
  }

  edit(element: Tournament) {
    this.tournamentsModuleService.setSelectedTournament(element);
    this.router.navigateByUrl('/masterdata/tournaments/detail');
  }
}
