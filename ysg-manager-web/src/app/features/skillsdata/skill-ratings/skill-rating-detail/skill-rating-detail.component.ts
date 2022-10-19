import { Component, OnInit } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { Player, Skill, SkillRating, Team } from '../../../../types';
import { SkillRatingsService } from '../../../../core/services/skill-ratings.service';
import { TeamsService } from '../../../../core/services/teams.service';
import { PlayersService } from '../../../../core/services/players.service';
import { SkillsService } from '../../../../core/services/skills.service';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import { SkillTypeService } from '../../../../core/services/skill-type.service';

@Component({
  selector: 'ysg-skill-rating-detail',
  templateUrl: './skill-rating-detail.component.html',
  styleUrls: []
})
export class SkillRatingDetailComponent implements OnInit {
  crudDetailOptions: CrudDetailOptions;

  selectedSkill!: Skill;

  teams!: Team[];
  players!: Player[];

  constructor(
    private skillRatingsService: SkillRatingsService,
    private teamsService: TeamsService,
    private playerService: PlayersService,
    private skillsService: SkillsService,
    private skillTypeService: SkillTypeService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.selectedSkill = this.skillsService.getSelectedItemValue();
    this.crudDetailOptions = {
      form: this.formBuilder.group({
        // fields only needed for form but not for model
        team: new UntypedFormControl(),
        player: new UntypedFormControl(),
        // fields also needed for model
        score: [{ value: '' }, Validators.required],
        _links: ['']
      }),
      crudService: skillRatingsService,
      routerListUrl: '/skillratings'
    };
  }

  ngOnInit(): void {
    this.initPlayerAndTeam();
    this.teamsService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  private initPlayerAndTeam() {
    this.crudDetailOptions.form.valueChanges
      .pipe(
        filter((skillRating) => skillRating._links.self?.href),
        take(1)
      )
      .subscribe((skillRating) =>
        this.updatePlayerAndTeamFormFields(skillRating)
      );
  }

  private updatePlayerAndTeamFormFields(skillRating: SkillRating) {
    const player = skillRating.player;
    const team = player.team;
    this.onTeamSelected(team);
    this.onPlayerSelected(player);
    this.crudDetailOptions.form.patchValue({ team, player });
    this.crudDetailOptions.form.controls.team.disable();
    this.crudDetailOptions.form.controls.player.disable();
  }

  onTeamSelected(selectedTeam: Team) {
    this.playerService.getPlayers(selectedTeam).subscribe((players) => {
      this.players = players.filter((player) =>
        this.skillTypeService.canRecordRatingForPlayerAndSkill(
          player,
          this.selectedSkill
        )
      );
    });
  }

  onPlayerSelected(selectedPlayer: Player) {
    const updatedLinks = {
      ...this.crudDetailOptions.form.value._links, // preserve existing links
      player: selectedPlayer._links.self
    };
    this.crudDetailOptions.form.patchValue({
      _links: updatedLinks
    });
  }

  compareObjects(object1: any, object2: any) {
    return (
      !!object1 &&
      !!object2 &&
      object1._links.self.href === object2._links.self.href
    );
  }
}
