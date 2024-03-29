import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { SkillResultsService } from '../../../../core/services/skill-results.service';
import { TeamsService } from '../../../../core/services/teams.service';
import { Player, Skill, SkillResult, Team } from '../../../../types';
import { PlayersService } from '../../../../core/services/players.service';
import { filter, take } from 'rxjs/operators';
import { SkillsService } from '../../../../core/services/skills.service';
import { SkillTypeService } from '../../../../core/services/skill-type.service';

@Component({
  selector: 'ysg-skill-result-detail',
  templateUrl: 'skill-result-detail.component.html',
  styleUrls: []
})
export class SkillResultDetailComponent implements OnInit {
  crudDetailOptions: CrudDetailOptions;

  selectedSkill!: Skill;

  teams!: Team[];
  players!: Player[];

  constructor(
    private skillResultsService: SkillResultsService,
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
        time: [
          { value: '', disabled: !this.isWithTime() },
          this.isWithTime() ? Validators.required : Validators.nullValidator
        ],
        points: [
          { value: '', disabled: !this.isWithPoints() },
          this.isWithPoints() ? Validators.required : Validators.nullValidator
        ],
        failures: [''],
        _links: ['']
      }),
      crudService: skillResultsService,
      routerListUrl: '/skillresults'
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
        filter((skillResult) => skillResult._links.self?.href),
        take(1)
      )
      .subscribe((skillResult) =>
        this.updatePlayerAndTeamFormFields(skillResult)
      );
  }

  private updatePlayerAndTeamFormFields(skillResult: SkillResult) {
    const player = skillResult.player;
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
        this.skillTypeService.canRecordResultForPlayerAndSkill(
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

  private isWithTime() {
    return this.skillTypeService.isWithTime(this.selectedSkill);
  }

  private isWithPoints() {
    return this.skillTypeService.isWithPoints(this.selectedSkill);
  }
}
