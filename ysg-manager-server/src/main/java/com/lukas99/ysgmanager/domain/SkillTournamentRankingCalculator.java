package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.SkillType.GOALTENDERS_OVERALL;
import static com.lukas99.ysgmanager.domain.SkillType.NO_RESULTS;
import static java.util.Comparator.comparing;
import static java.util.Objects.isNull;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Calculates the rankings overall tournament ranking per skill. One player can occur only once in
 * all tournament skill rankings respectively he cannot occur in the tournament ranking of different
 * skills.
 */
@Component
@Slf4j
public class SkillTournamentRankingCalculator {

  /**
   * The amount of tournament rankings to be calculated for skaters.
   */
  @Value("${ysg.skills.tournament-rankings.calculator.skater-skill.amount:6}")
  private int tournamentRankingsAmountForSkaterSkill;

  /**
   * The amount of tournament rankings to be calculated for goaltenders.
   */
  @Value("${ysg.skills.tournament-rankings.calculator.goaltender-skill.amount:4}")
  private int tournamentRankingsAmountForGoaltenderSkill;

  private final SkillRepository skillRepository;
  private final SkillRankingRepository skillRankingRepository;
  private final SkillTournamentRankingRepository skillTournamentRankingRepository;

  public SkillTournamentRankingCalculator(
      SkillRepository skillRepository,
      SkillRankingRepository skillRankingRepository,
      SkillTournamentRankingRepository skillTournamentRankingRepository) {
    this.skillRepository = skillRepository;
    this.skillRankingRepository = skillRankingRepository;
    this.skillTournamentRankingRepository = skillTournamentRankingRepository;
  }

  /**
   * Calculates the tournament rankings of the skills for the given tournament.
   *
   * @param tournament The tournament for which the tournament rankings should be calculated.
   */
  public void calculateTournamentRankings(Tournament tournament) {
    log.info("Calculate tournament rankings of skills. "
            + "{} ranks for skaters and {} ranks for goaltenders will be calculated.",
        tournamentRankingsAmountForSkaterSkill, tournamentRankingsAmountForGoaltenderSkill);
    List<Skill> skills = skillRepository.findByTournament(tournament).stream()
        .sorted(comparing(Skill::getNumber)).collect(Collectors.toList());
    List<SkillWithRankings> skillsWithRankings = new ArrayList<>();
    List<SkillWithTournamentRankings> skillsWithTournamentRankings = new ArrayList<>();
    skills.forEach(skill -> {
      skillsWithRankings.add(
          SkillWithRankings.builder()
              .skill(skill)
              .skillRankings(skillRankingRepository.findBySkillAndPlayerPositionOrderBySequenceAsc(
                  skill, skill.getTournamentRankingPlayerPosition()))
              .build());
      skillsWithTournamentRankings.add(
          SkillWithTournamentRankings.builder()
              .skill(skill)
              .skillRankings(new ArrayList<>())
              .build());
    });
    Set<Player> rankedPlayers = new HashSet<>();
    for (int i = 1; i <= tournamentRankingsAmountForSkaterSkill; i++) { // sequence
      for (int j = 0; j < skillsWithRankings.size(); j++) { // skills
        SkillWithRankings withRankings = skillsWithRankings.get(j);
        SkillWithTournamentRankings withTournamentRankings = skillsWithTournamentRankings.get(j);
        assert withRankings.getSkill().equals(withTournamentRankings.getSkill());

        if (hasType(withRankings.getSkill(), NO_RESULTS, GOALTENDERS_OVERALL) // goaltenders overall
            && i > tournamentRankingsAmountForGoaltenderSkill) {
          // fewer amount of rankings for goaltender skill than for skater skill
          continue;
        }

        for (SkillRanking ranking : withRankings.getSkillRankings()) {
          Player player = ranking.getPlayer();
          if (rankedPlayers.contains(player)) {
            continue;
          }

          List<SkillTournamentRanking> currentRankings = withTournamentRankings.getSkillRankings();
          SkillTournamentRanking previous =
              currentRankings.size() > 0 ? currentRankings.get(currentRankings.size() - 1) : null;
          int rank;
          if (isNull(previous)) {
            rank = 1;
          } else if (ranking.getRank().equals(previous.getRank())) {
            rank = previous.getRank();
          } else {
            rank = i;
          }

          currentRankings.add(
              SkillTournamentRanking.builder()
                  .skill(ranking.getSkill())
                  .player(player)
                  .sequence(i)
                  .rank(rank)
                  .build());
          rankedPlayers.add(player);
          break;
        }
      }
    }

    log.info("Save tournament rankings of skills");
    skillsWithTournamentRankings.forEach(withTournamentRankings -> {
      skillTournamentRankingRepository.saveAll(withTournamentRankings.getSkillRankings());
    });

    log.info("Finished calculating tournament rankings of skills");
  }

  private boolean hasType(Skill skill, SkillType playerType, SkillType goaltenderType) {
    return skill.getTypeForPlayers().equals(playerType)
        && skill.getTypeForGoaltenders().equals(goaltenderType);
  }

  @Getter
  @Builder
  private static class SkillWithRankings {

    private Skill skill;
    private List<SkillRanking> skillRankings;
  }

  @Getter
  @Builder
  private static class SkillWithTournamentRankings {

    private Skill skill;
    private List<SkillTournamentRanking> skillRankings;
  }

}
