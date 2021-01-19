import { SkillDetailComponent } from './skill-detail.component';
import { SkillsService } from '../../../../core/services/skills.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

describe('SkillDetailComponent', () => {
  let component: SkillDetailComponent;
  let skillService: SkillsService;
  let formBuilder: FormBuilder;
  let translateService: TranslateService;

  beforeEach(() => {
    skillService = <any>{};
    formBuilder = new FormBuilder();
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };

    component = new SkillDetailComponent(
      skillService,
      formBuilder,
      translateService
    );
  });

  describe('the constructor', () => {
    it('initializes the positions array', () => {
      expect(component.skillTypes.length).toBe(4);
      expect(component.skillTypes[0].viewValue).toBe(
        'SKILL_TYPE_TIME_WITH_RATING'
      );
      expect(component.skillTypes[1].viewValue).toBe(
        'SKILL_TYPE_TIME_WITH_POINTS'
      );
      expect(component.skillTypes[2].viewValue).toBe('SKILL_TYPE_TIME');
      expect(component.skillTypes[3].viewValue).toBe('SKILL_TYPE_POINTS');
      expect(translateService.instant).toHaveBeenCalledTimes(4);
    });

    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(skillService);
      expect(component.crudDetailOptions.routerListUrl).toBe('/skillsdata/skills');
    }));
  });
});
