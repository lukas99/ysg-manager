import { Injectable } from '@angular/core';
import { Player, PlayerPosition, Skill, SkillType } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class SkillTypeService {
  canRecordResultForPlayerAndSkill(player: Player, skill: Skill) {
    if (player.position === PlayerPosition.SKATER) {
      return this.isWithResults(skill.typeForPlayers);
    } else {
      // PlayerPosition.GOALTENDER
      return this.isWithResults(skill.typeForGoaltenders);
    }
  }

  canRecordRatingForPlayerAndSkill(player: Player, skill: Skill) {
    if (player.position === PlayerPosition.SKATER) {
      return this.isWithRatings(skill.typeForPlayers);
    } else {
      // PlayerPosition.GOALTENDER
      return this.isWithRatings(skill.typeForGoaltenders);
    }
  }

  canRecordResultForSkill(skill: Skill) {
    return (
      this.isWithResults(skill.typeForPlayers) ||
      this.isWithResults(skill.typeForGoaltenders)
    );
  }

  canRecordRatingForSkill(skill: Skill) {
    return (
      this.isWithRatings(skill.typeForPlayers) ||
      this.isWithRatings(skill.typeForGoaltenders)
    );
  }

  isWithResults(skillType: SkillType): boolean {
    switch (skillType) {
      case SkillType.RATING:
      case SkillType.GOALTENDERS_OVERALL:
      case SkillType.NO_RESULTS:
        return false;
      default:
        return true;
    }
  }

  isWithRatings(skillType: SkillType): boolean {
    switch (skillType) {
      case SkillType.TIME_WITH_RATING:
      case SkillType.RATING:
        return true;
      default:
        return false;
    }
  }

  isWithTime(skill: Skill): boolean {
    switch (skill.typeForPlayers) {
      case SkillType.TIME:
      case SkillType.TIME_WITH_POINTS:
      case SkillType.TIME_WITH_RATING:
        return true;
      default:
        return false;
    }
  }

  isWithPoints(skill: Skill): boolean {
    switch (skill.typeForPlayers) {
      case SkillType.POINTS:
      case SkillType.TIME_WITH_POINTS:
        return true;
      default:
        return false;
    }
  }
}
