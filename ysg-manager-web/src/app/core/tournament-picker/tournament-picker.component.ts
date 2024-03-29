import { Component, OnDestroy, OnInit } from '@angular/core';
import { TournamentsService } from '../services/tournaments.service';
import { Tournament } from '../../types';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Provides a menu to select the tournament to use by the app.
 */
@Component({
  selector: 'ysg-tournament-picker',
  templateUrl: 'tournament-picker.component.html',
  styleUrls: []
})
export class TournamentPickerComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();

  isEditable = false;
  tournaments: Tournament[] = [];
  selectedTournamentName = '';

  constructor(
    private tournamentService: TournamentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTournaments();
    this.loadCurrentRoute();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  private loadTournaments() {
    this.tournamentService
      .getTournaments()
      .pipe(takeUntil(this.destroy))
      .subscribe((tournaments) => (this.tournaments = tournaments));

    this.tournamentService
      .getApplicationTournament()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (tournament) => (this.selectedTournamentName = tournament.name)
      );
  }

  useTournament(tournament: Tournament) {
    this.tournamentService.setApplicationTournament(tournament);
    this.selectedTournamentName = tournament.name;
  }

  private loadCurrentRoute() {
    this.router.events
      .pipe(
        takeUntil(this.destroy),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((navigationEndEvent) => {
        const currentRoute = (<NavigationEnd>navigationEndEvent).url;
        this.isEditable = currentRoute === '/tournaments';
      });
  }
}
