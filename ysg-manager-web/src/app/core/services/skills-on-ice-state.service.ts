import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Skill, Team } from '../../types';

/**
 * The service used by the SkillsOnIce component. This service holds the components state.
 */
@Injectable({
  providedIn: 'root'
})
export class SkillsOnIceStateService {
  private isSkillChef$ = new BehaviorSubject<boolean>(false);
  private selectedSkill$ = new BehaviorSubject<Skill>({} as Skill);
  private selectedTeam$ = new BehaviorSubject<Team>({} as Team);

  constructor() {}

  setSkillChef(isSkillChef: boolean) {
    this.isSkillChef$.next(isSkillChef);
  }

  isSkillChefObservable(): Observable<boolean> {
    return this.isSkillChef$;
  }

  isSkillChef(): boolean {
    return this.isSkillChef$.getValue();
  }

  setSelectedSkill(skill: Skill) {
    this.selectedSkill$.next(skill);
  }

  getSelectedSkillObservable(): Observable<Skill> {
    return this.selectedSkill$;
  }

  getSelectedSkill(): Skill {
    return this.selectedSkill$.getValue();
  }

  setSelectedTeam(team: Team) {
    this.selectedTeam$.next(team);
  }

  getSelectedTeamObservable(): Observable<Team> {
    return this.selectedTeam$;
  }

  getSelectedTeam(): Team {
    return this.selectedTeam$.getValue();
  }
}
