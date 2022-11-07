import { ResultListComponent } from './result-list.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { Skill, SkillResult, Team } from '../../../types';

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
      router
    );
  });

  describe('ngOnInit', () => {
    let skill: Skill;
    let team: Team;

    beforeEach(() => {
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
  });

  it('should edit a result', () => {
    const result = {} as SkillResult;

    component.editResult(result);

    expect(skillResultsService.setSelectedItem).toHaveBeenCalledWith(result);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should create a result', () => {
    component.createResult();

    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
