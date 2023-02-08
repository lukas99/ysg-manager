import { ResultListComponent } from './result-list.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { Skill, SkillResult, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ResultListComponent', () => {
  let component: ResultListComponent;

  let stateService: SkillsOnIceStateService;
  let skillResultsService: SkillResultsService;
  let router: Router;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    skillResultsService = <any>{
      getSkillResultsBySkillAndTeam: jest.fn(() => of([])),
      setSelectedItem: jest.fn(),
      removeSelectedItem: jest.fn()
    };
    router = <any>{
      navigateByUrl: jest.fn()
    };

    component = new ResultListComponent(
      stateService,
      skillResultsService,
      new SkillTypeService(),
      router
    );
  });

  describe('ngOnInit', () => {
    let skill: Skill;
    let team: Team;

    beforeEach(() => {
      skill = { typeForPlayers: SkillType.TIME_WITH_POINTS } as Skill;

      stateService.setSelectedSkill(skill);
      stateService.setSelectedTeam(team);
    });

    it('sets the selected skill and team', () => {
      component.ngOnInit();

      expect(component.selectedSkill).toBe(skill);
      expect(component.selectedTeam).toBe(team);
    });

    it('should load the skill results', fakeAsync(() => {
      const result1 = {
        points: 1,
        _links: { self: { href: 'results/1' } }
      } as SkillResult;
      const result2 = {
        points: 2,
        _links: {}
      } as SkillResult; // is not yet uploaded (no self link)
      const result3 = {
        points: 3,
        _links: { self: { href: 'results/1' } }
      } as SkillResult;
      skillResultsService.getSkillResultsBySkillAndTeam = jest.fn(() =>
        of([result1, result2, result3])
      );

      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(
        skillResultsService.getSkillResultsBySkillAndTeam
      ).toHaveBeenCalledWith(skill, team);
      expect(component.skillResults.length).toBe(3);
      expect(component.skillResults[0]).toEqual(result1);
      expect(component.skillResults[1]).toEqual(result2);
      expect(component.skillResults[2]).toEqual(result3);
      expect(component.loadingIndicator.isLoading).toBe(false);
    }));

    it('should set showTime to true', () => {
      skill = { typeForPlayers: SkillType.TIME_WITH_POINTS } as Skill;
      stateService.setSelectedSkill(skill);

      component.ngOnInit();
      expect(component.showTime).toBeTruthy();
    });

    it('should set showPoints to true', () => {
      skill = { typeForPlayers: SkillType.TIME_WITH_POINTS } as Skill;
      stateService.setSelectedSkill(skill);

      component.ngOnInit();
      expect(component.showPoints).toBeTruthy();
    });
  });

  it('should edit a result', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;
    const result = {} as SkillResult;

    component.editResult(result);

    expect(skillResultsService.setSelectedItem).toHaveBeenCalledWith(result);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should create a result', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.createResult();

    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  describe('navigateToDetailView', () => {
    it('should navigate to the page for skill Magic Transitions', () => {
      component.selectedSkill = {
        name: 'Magic Transitions',
        typeForPlayers: SkillType.TIME_WITH_RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortime'
      );
    });

    it('should navigate to the page for skill Best Shot', () => {
      component.selectedSkill = {
        typeForPlayers: SkillType.POINTS
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailforpoints'
      );
    });

    it('should navigate to the page for skill Pass and Go', () => {
      component.selectedSkill = {
        name: 'Pass and Go',
        typeForPlayers: SkillType.TIME_WITH_POINTS
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortimewithpoints'
      );
    });

    it('should navigate to the page for skill Controlled Jumble', () => {
      component.selectedSkill = {
        name: 'Controlled Jumble',
        typeForPlayers: SkillType.TIME
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortime'
      );
    });

    it('should navigate to the page for skill Hit the Road', () => {
      component.selectedSkill = {
        name: 'hit the road',
        typeForPlayers: SkillType.TIME_WITH_RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortimemanual'
      );
    });
  });
});
