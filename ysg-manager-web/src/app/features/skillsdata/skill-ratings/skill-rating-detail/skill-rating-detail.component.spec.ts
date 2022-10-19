import { fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { SkillRatingDetailComponent } from './skill-rating-detail.component';
import { SkillRatingsService } from '../../../../core/services/skill-ratings.service';
import { TeamsService } from '../../../../core/services/teams.service';
import { PlayersService } from '../../../../core/services/players.service';
import {
  Player,
  PlayerPosition,
  Skill,
  SkillRating,
  SkillType,
  Team
} from '../../../../types';
import { of } from 'rxjs';
import { SkillsService } from '../../../../core/services/skills.service';
import { SkillTypeService } from '../../../../core/services/skill-type.service';

describe('SkillRatingDetailComponent', () => {
  let component: SkillRatingDetailComponent;
  let skillRatingsService: SkillRatingsService;
  let teamsService: TeamsService;
  let playersService: PlayersService;
  let skillsService: SkillsService;
  let skillTypeService: SkillTypeService;
  let formBuilder: FormBuilder;

  let team1: Team;
  let team2: Team;
  let teams: Team[];
  let player1: Player;
  let player2: Player;
  let players: Player[];
  let skill: Skill;

  beforeEach(() => {
    team1 = <Team>{ name: 'EHC Engelberg' };
    team2 = <Team>{ name: 'HC Luzern' };
    teams = [team1, team2];
    player1 = <Player>{
      shirtNumber: 10,
      team: team1,
      _links: { self: { href: 'players/1' } }
    };
    player2 = <Player>{
      shirtNumber: 20,
      team: team2,
      _links: { self: { href: 'players/2' } }
    };
    players = [player1, player2];
    skill = {
      name: 'Magic Transitions',
      typeForPlayers: SkillType.TIME_WITH_RATING,
      typeForGoaltenders: SkillType.TIME_WITH_RATING,
      tournamentRankingPlayerPosition: PlayerPosition.SKATER,
      number: 1,
      _links: <any>{}
    };

    skillRatingsService = <any>{};
    teamsService = <any>{
      getTeams: jest.fn(() => of(teams))
    };
    playersService = <any>{
      getPlayers: jest.fn(() => of(players))
    };
    skillsService = <any>{
      getSelectedItemValue: jest.fn(() => skill)
    };
    skillTypeService = <any>{
      canRecordRatingForPlayerAndSkill: jest.fn(() => true)
    };
    formBuilder = new FormBuilder();

    component = new SkillRatingDetailComponent(
      skillRatingsService,
      teamsService,
      playersService,
      skillsService,
      skillTypeService,
      formBuilder
    );
  });

  describe('the constructor', () => {
    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(skillRatingsService);
      expect(component.crudDetailOptions.routerListUrl).toBe('/skillratings');
    }));
  });

  describe('ngOnInit', () => {
    it('initializes the player and the team when skill rating is edited', fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.crudDetailOptions.form.patchValue(<SkillRating>{
        player: player2,
        _links: {
          self: { href: 'skillratings/1' }
        }
      });

      expect(playersService.getPlayers).toHaveBeenCalledWith(team2);

      const expectedFormValue = component.crudDetailOptions.form.value;
      expect(expectedFormValue._links.player.href).toBe(
        player2._links.self.href
      );

      const expectedFormControls = component.crudDetailOptions.form.controls;
      expect(expectedFormControls.player.value).toBe(player2);
      expect(expectedFormControls.team.value).toBe(team2);
    }));

    it('disables the player and the team when skill rating is edited', fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.crudDetailOptions.form.patchValue(<SkillRating>{
        player: player2,
        _links: {
          self: { href: 'skillratings/1' }
        }
      });

      const expectedFormControls = component.crudDetailOptions.form.controls;
      expect(expectedFormControls.player.disabled).toBeTruthy();
      expect(expectedFormControls.team.disabled).toBeTruthy();

      // form values are undefined because they are disabled
      const expectedFormValue = component.crudDetailOptions.form.value;
      expect(expectedFormValue.player).toBeUndefined();
      expect(expectedFormValue.team).toBeUndefined();
    }));

    it('loads the available teams', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(component.teams).toBe(teams);
    }));
  });

  it('loads the players when a team is selected', fakeAsync(() => {
    component.onTeamSelected(team1);
    tick();

    expect(component.players).toStrictEqual(players);
    expect(playersService.getPlayers).toHaveBeenCalledWith(team1);
  }));

  describe('when a player is selected', () => {
    beforeEach(() => {
      component.crudDetailOptions.form.value._links = {
        self: { href: 'skillratings/1' },
        player: player1._links.self,
        skill: { href: 'skills/1' }
      };
    });

    it('the player link is updated', () => {
      component.onPlayerSelected(player2);

      const expectedFormLinks = component.crudDetailOptions.form.value._links;
      expect(expectedFormLinks.player.href).toBe(player2._links.self.href);
    });

    it('the skill and self links are preserved', () => {
      component.onPlayerSelected(player2);

      const expectedFormLinks = component.crudDetailOptions.form.value._links;
      expect(expectedFormLinks.skill.href).toBe('skills/1');
      expect(expectedFormLinks.self.href).toBe('skillratings/1');
    });
  });
});
