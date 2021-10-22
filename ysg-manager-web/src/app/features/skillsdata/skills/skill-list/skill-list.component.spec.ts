import { SkillListComponent } from './skill-list.component';
import { SkillsService } from '../../../../core/services/skills.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

describe('SkillListComponent', () => {
  let component: SkillListComponent;

  let skillsService: SkillsService;
  let translateService: TranslateService;
  let dialog: MatDialog;

  beforeEach(() => {
    skillsService = <SkillsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    dialog = <any>{};
    component = new SkillListComponent(skillsService, translateService, dialog);
  });

  it('creates the options', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(5);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
