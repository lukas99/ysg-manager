import { ResultListComponent } from './result-list.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { Skill, SkillResult, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';

describe('ResultListComponent', () => {
  let component: ResultListComponent;

  let stateService: SkillsOnIceStateService;
  let skillResultsService: SkillResultsService;
  let router: Router;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    skillResultsService = <any>{
      getCachedSkillResults: jest.fn(() => []),
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
      expect(component.isASkillResultUploaded).toBeFalsy();
    });

    it('should load the skill result view records', () => {
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
      skillResultsService.getCachedSkillResults = jest.fn(() => [
        result1,
        result2,
        result3
      ]);

      component.ngOnInit();

      expect(skillResultsService.getCachedSkillResults).toHaveBeenCalledWith(
        skill,
        team
      );
      expect(component.skillResults.length).toBe(3);
      expect(component.skillResults[0]).toEqual({
        ...result1,
        isUploaded: true
      });
      expect(component.skillResults[1]).toEqual({
        ...result2,
        isUploaded: false
      });
      expect(component.skillResults[2]).toEqual({
        ...result3,
        isUploaded: true
      });

      expect(component.isASkillResultUploaded).toBeTruthy();
    });

    describe('isASkillResultUploaded', () => {
      it('should set isASkillResultUploaded to true', () => {
        const result1 = {
          _links: { self: { href: 'results/1' } }
        } as SkillResult;
        const result2 = { _links: {} } as SkillResult; // is not yet uploaded (no self link)
        skillResultsService.getCachedSkillResults = jest.fn(() => [
          result1,
          result2
        ]);

        component.ngOnInit();

        expect(component.isASkillResultUploaded).toBeTruthy();
      });

      it('should set isASkillResultUploaded to false', () => {
        const result1 = { _links: {} } as SkillResult; // is not yet uploaded (no self link)
        const result2 = { _links: {} } as SkillResult; // is not yet uploaded (no self link)
        skillResultsService.getCachedSkillResults = jest.fn(() => [
          result1,
          result2
        ]);

        component.ngOnInit();

        expect(component.isASkillResultUploaded).toBeFalsy();
      });
    });

    describe('showPoints', () => {
      it('should set showPoints to true', () => {
        skill = { typeForPlayers: SkillType.TIME_WITH_POINTS } as Skill;
        stateService.setSelectedSkill(skill);

        component.ngOnInit();
        expect(component.showPoints).toBeTruthy();
      });

      it('should set showPoints to false', () => {
        skill = { typeForPlayers: SkillType.TIME_WITH_RATING } as Skill;
        stateService.setSelectedSkill(skill);

        component.ngOnInit();
        expect(component.showPoints).toBeFalsy();
      });
    });
  });

  it('should edit a result', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING
    } as Skill;
    const result = {} as SkillResult;

    component.editResult(result);

    expect(skillResultsService.setSelectedItem).toHaveBeenCalledWith(result);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should create a result', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING
    } as Skill;

    component.createResult();

    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  describe('navigateToDetailView', () => {
    it('should navigate to the page "result detail for time"', () => {
      component.selectedSkill = {
        typeForPlayers: SkillType.TIME_WITH_RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortime'
      );
    });

    it('should navigate to the page "result detail for time with points"', () => {
      component.selectedSkill = {
        typeForPlayers: SkillType.TIME_WITH_POINTS
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultdetailfortimewithpoints'
      );
    });
  });
});
