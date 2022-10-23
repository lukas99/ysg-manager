import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Skill, Team } from '../../types';

/**
 * The service used by the SkillsOnIce component. This service holds the components state.
 */
@Injectable({
  providedIn: 'root'
})
export class SkillsOnIceStateService {
  private isSkillChef$ = new Subject<boolean>();
  private selectedSkill$ = new Subject<Skill>();
  private selectedTeam$ = new Subject<Team>();

  constructor() {}

  setIsSkillChef(isSkillChef: boolean) {
    this.isSkillChef$.next(isSkillChef);
  }

  getIsSkillChef(): Observable<boolean> {
    return this.isSkillChef$;
  }

  setSelectedSkill(skill: Skill) {
    this.selectedSkill$.next(skill);
  }

  getSelectedSkill(): Observable<Skill> {
    return this.selectedSkill$;
  }

  setSelectedTeam(team: Team) {
    this.selectedTeam$.next(team);
  }

  getSelectedTeam(): Observable<Team> {
    return this.selectedTeam$;
  }
}
