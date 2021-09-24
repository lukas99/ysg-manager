import { SkillTypeService } from './skill-type.service';
import { Player, PlayerPosition, Skill, SkillType } from '../../types';

describe('SkillTypeService', () => {
  let service: SkillTypeService;

  let skater: Player;
  let goaltender: Player;

  let magicTransitions: Skill;
  let bestShot: Skill;
  let passAndGo: Skill;
  let controlledJumble: Skill;
  let hitTheRoad: Skill;
  let goaltenders: Skill;

  beforeEach(() => {
    skater = <Player>{ position: PlayerPosition.SKATER };
    goaltender = <Player>{ position: PlayerPosition.GOALTENDER };

    magicTransitions = <Skill>{
      typeForPlayers: SkillType.TIME_WITH_RATING,
      typeForGoaltenders: SkillType.TIME_WITH_RATING
    };
    bestShot = <Skill>{
      typeForPlayers: SkillType.POINTS,
      typeForGoaltenders: SkillType.POINTS
    };
    passAndGo = <Skill>{
      typeForPlayers: SkillType.TIME_WITH_POINTS,
      typeForGoaltenders: SkillType.TIME_WITH_POINTS
    };
    controlledJumble = <Skill>{
      typeForPlayers: SkillType.TIME,
      typeForGoaltenders: SkillType.RATING
    };
    hitTheRoad = <Skill>{
      typeForPlayers: SkillType.TIME_WITH_RATING,
      typeForGoaltenders: SkillType.RATING
    };
    goaltenders = <Skill>{
      typeForPlayers: SkillType.NO_RESULTS,
      typeForGoaltenders: SkillType.GOALTENDERS_OVERALL
    };

    service = new SkillTypeService();
  });

  it('checks whether results should be recorded for a given player and skill', () => {
    expect(
      service.canRecordResultForPlayerAndSkill(skater, magicTransitions)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(skater, bestShot)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(skater, passAndGo)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(skater, controlledJumble)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(skater, hitTheRoad)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(skater, goaltenders)
    ).toBeFalsy();

    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, magicTransitions)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, bestShot)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, passAndGo)
    ).toBeTruthy();
    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, controlledJumble)
    ).toBeFalsy();
    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, hitTheRoad)
    ).toBeFalsy();
    expect(
      service.canRecordResultForPlayerAndSkill(goaltender, goaltenders)
    ).toBeFalsy();
  });

  it('checks whether ratings should be recorded for a given player and skill', () => {
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, magicTransitions)
    ).toBeTruthy();
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, bestShot)
    ).toBeFalsy();
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, passAndGo)
    ).toBeFalsy();
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, controlledJumble)
    ).toBeFalsy();
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, hitTheRoad)
    ).toBeTruthy();
    expect(
      service.canRecordRatingForPlayerAndSkill(skater, goaltenders)
    ).toBeFalsy();

    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, magicTransitions)
    ).toBeTruthy();
    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, bestShot)
    ).toBeFalsy();
    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, passAndGo)
    ).toBeFalsy();
    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, controlledJumble)
    ).toBeTruthy();
    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, hitTheRoad)
    ).toBeTruthy();
    expect(
      service.canRecordRatingForPlayerAndSkill(goaltender, goaltenders)
    ).toBeFalsy();
  });

  it('checks whether results should be recorded for a skill', () => {
    expect(service.canRecordResultForSkill(magicTransitions)).toBeTruthy();
    expect(service.canRecordResultForSkill(bestShot)).toBeTruthy();
    expect(service.canRecordResultForSkill(passAndGo)).toBeTruthy();
    expect(service.canRecordResultForSkill(controlledJumble)).toBeTruthy();
    expect(service.canRecordResultForSkill(hitTheRoad)).toBeTruthy();
    expect(service.canRecordResultForSkill(goaltenders)).toBeFalsy();
  });

  it('checks whether ratings should be recorded for a skill', () => {
    expect(service.canRecordRatingForSkill(magicTransitions)).toBeTruthy();
    expect(service.canRecordRatingForSkill(bestShot)).toBeFalsy();
    expect(service.canRecordRatingForSkill(passAndGo)).toBeFalsy();
    expect(service.canRecordRatingForSkill(controlledJumble)).toBeTruthy();
    expect(service.canRecordRatingForSkill(hitTheRoad)).toBeTruthy();
    expect(service.canRecordRatingForSkill(goaltenders)).toBeFalsy();
  });

  it('checks whether time should be recorded for a skill', () => {
    expect(service.isWithTime(magicTransitions)).toBeTruthy();
    expect(service.isWithTime(bestShot)).toBeFalsy();
    expect(service.isWithTime(passAndGo)).toBeTruthy();
    expect(service.isWithTime(controlledJumble)).toBeTruthy();
    expect(service.isWithTime(hitTheRoad)).toBeTruthy();
    expect(service.isWithTime(goaltenders)).toBeFalsy();
  });

  it('checks whether points should be recorded for a skill', () => {
    expect(service.isWithPoints(magicTransitions)).toBeFalsy();
    expect(service.isWithPoints(bestShot)).toBeTruthy();
    expect(service.isWithPoints(passAndGo)).toBeTruthy();
    expect(service.isWithPoints(controlledJumble)).toBeFalsy();
    expect(service.isWithPoints(hitTheRoad)).toBeFalsy();
    expect(service.isWithPoints(goaltenders)).toBeFalsy();
  });
});
