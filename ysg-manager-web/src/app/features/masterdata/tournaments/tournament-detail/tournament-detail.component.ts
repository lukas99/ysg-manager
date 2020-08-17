import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../types';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudListService } from '../../../../core/services/crud-list.service';

@Component({
  selector: 'ysg-tournament-detail',
  templateUrl: 'tournament-detail.component.html',
  styleUrls: ['tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {
  form!: FormGroup;
  tournament$: Observable<Tournament> = EMPTY;

  constructor(
    private tournamentsService: TournamentsService,
    private crudListService: CrudListService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      dateDescription: [''],
      _links: ['']
    });
    this.tournament$ = this.crudListService
      .getSelectedItem()
      .pipe(tap((tournament) => this.form.patchValue(tournament)));
  }

  save() {
    if (this.isFormValid()) {
      const tournament: Tournament = this.form.value;
      this.shouldUpdate(tournament)
        ? this.update(tournament)
        : this.create(tournament);
    }
  }

  private isFormValid() {
    return this.form.dirty && this.form.valid;
  }

  private shouldUpdate(tournament: Tournament) {
    return tournament._links && tournament._links.self;
  }

  private update(tournament: Tournament) {
    this.tournamentsService
      .updateTournament(tournament)
      .subscribe(() => this.navigateToOverview());
  }

  private create(tournament: Tournament) {
    this.tournamentsService
      .createTournament(tournament)
      .subscribe(() => this.navigateToOverview());
  }

  cancel() {
    this.navigateToOverview();
  }

  private navigateToOverview() {
    this.router.navigateByUrl('/masterdata/tournaments');
  }
}
