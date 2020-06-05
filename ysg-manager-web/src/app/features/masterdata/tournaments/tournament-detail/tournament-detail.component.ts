import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../types';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TournamentsModuleService } from '../tournaments-module.service';

@Component({
  selector: 'ysg-tournament-detail',
  templateUrl: 'tournament-detail.component.html',
  styleUrls: ['tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {
  form: FormGroup | undefined;
  tournament$: Observable<Tournament> = EMPTY;

  constructor(
    private tournamentsService: TournamentsService,
    private tournamentsModuleService: TournamentsModuleService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [''],
      dateDescription: [''],
      _links: ['']
    });
    this.tournament$ = this.tournamentsModuleService
      .getSelectedTournament()
      .pipe(tap((tourament) => this.form?.patchValue(tourament)));
  }

  save() {
    this.tournamentsService
      .saveTournament(this.form?.value)
      .subscribe(() => this.navigateToOverview());
  }

  cancel() {
    this.navigateToOverview();
  }

  private navigateToOverview() {
    this.router.navigateByUrl('/masterdata/tournaments');
  }
}
