import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Tournament } from '../../../../types';
import { Router } from '@angular/router';
import { TournamentsModuleService } from '../tournaments-module.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ysg-tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {
  refreshToken$ = new BehaviorSubject(undefined);
  tournaments$: Observable<Tournament[]> = EMPTY;
  displayedColumns: string[] = ['name', 'dateDescription', 'actions'];

  constructor(
    private tournamentsService: TournamentsService,
    private tournamentsModuleService: TournamentsModuleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournaments$ = this.refreshToken$.pipe(
      switchMap(() => this.tournamentsService.getTournaments())
    );
  }

  edit(element: Tournament) {
    this.tournamentsModuleService.setSelectedTournament(element);
    this.navigateToDetailView();
  }

  create() {
    this.tournamentsModuleService.setEmptyTournament();
    this.router.navigateByUrl('/masterdata/tournaments/detail');
  }

  private navigateToDetailView() {
    this.router.navigateByUrl('/masterdata/tournaments/detail');
    console.log('test');
  }

  delete(element: Tournament) {
    this.tournamentsService
      .deleteTournament(element)
      .subscribe(() => this.refreshToken$.next(undefined));
  }
}
