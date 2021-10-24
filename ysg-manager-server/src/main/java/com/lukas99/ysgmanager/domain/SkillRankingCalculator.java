package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.PlayerPosition.GOALTENDER;
import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;
import static com.lukas99.ysgmanager.domain.SkillType.GOALTENDERS_OVERALL;
import static com.lukas99.ysgmanager.domain.SkillType.NO_RESULTS;
import static com.lukas99.ysgmanager.domain.SkillType.POINTS;
import static com.lukas99.ysgmanager.domain.SkillType.RATING;
import static com.lukas99.ysgmanager.domain.SkillType.TIME;
import static com.lukas99.ysgmanager.domain.SkillType.TIME_WITH_POINTS;
import static com.lukas99.ysgmanager.domain.SkillType.TIME_WITH_RATING;
import static java.util.Comparator.comparing;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Calculates the rankings per skill.
 */
@Component
@Slf4j
public class SkillRankingCalculator {

  @Value("${ysg.skills.rankings.calculator.calculate-skill-bestshot-at-last:true}")
  private boolean calculateSkillBestShotAtLast;

  @Value("${ysg.skills.rankings.calculator.penalty-time-per-failure:1}")
  private Integer penaltyTime;

  @Value("${ysg.skills.rankings.calculator.penalty-points-per-failure:1}")
  private Integer penaltyPoints;

  private final SkillRepository skillRepository;
  private final SkillRankingRepository rankingRepository;
  private final SkillRatingRepository ratingRepository;
  private final SkillResultRepository resultRepository;
  private final PlayerRepository playerRepository;

  public SkillRankingCalculator(
      SkillRepository skillRepository,
      SkillRankingRepository rankingRepository,
      SkillRatingRepository skillRatingRepository,
      SkillResultRepository resultRepository,
      PlayerRepository playerRepository) {
    this.skillRepository = skillRepository;
    this.rankingRepository = rankingRepository;
    this.ratingRepository = skillRatingRepository;
    this.resultRepository = resultRepository;
    this.playerRepository = playerRepository;
  }

  /**
   * Calculates the skill rankings for the given tournament.
   *
   * @param tournament The tournament for which the skill rankings should be calculated.
   */
  public void calculateRankings(Tournament tournament) {
    log.info("Calculate rankings for skills");
    List<Skill> skills = skillRepository.findByTournament(tournament).stream()
        .sorted(comparing(Skill::getNumber)).collect(Collectors.toList());

    if (calculateSkillBestShotAtLast) {
      log.info("Skill 'Best Shot' detected. Will calculate it at last.");
      skills.stream().filter(skill -> "Best Shot".equals(skill.getName())).findFirst()
          .ifPresent(bestShot -> { // move it to the end of the list
            skills.remove(bestShot);
            skills.add(bestShot);
          });
    }

    // comparators
    Comparator<ResultWithRating> byTime = comparing(ResultWithRating::getTime);
    Comparator<ResultWithRating> byScore = comparing(ResultWithRating::getScore).reversed();
    Comparator<ResultWithRating> byPoints = comparing(ResultWithRating::getPoints).reversed();
    Comparator<ResultWithRating> byScoreAndTime = byScore.thenComparing(ResultWithRating::getTime);
    Comparator<ResultWithRating> byPointsAndTime =
        byPoints.thenComparing(ResultWithRating::getTime);

    skills.stream()
        // goaltenders overall: calculate after resorting to not falsify resorting of
        // equal ranked players of other skills.
        .filter(skill -> !hasType(skill, NO_RESULTS, GOALTENDERS_OVERALL))
        .forEach(skill -> {
          log.info("Calculate rankings for skill '{}' with number {}",
              skill.getName(), skill.getNumber());
          if (hasType(skill, TIME_WITH_RATING, TIME_WITH_RATING)) { // magic transitions
            createRankingsForSkillResultsAndRatings(skill, SKATER, byScoreAndTime);
            createRankingsForSkillResultsAndRatings(skill, GOALTENDER, byScoreAndTime);
          } else if (hasType(skill, TIME_WITH_POINTS, TIME_WITH_POINTS)) { // pass and go
            createRankingsForSkillResultsAndRatings(skill, SKATER, byPointsAndTime);
            createRankingsForSkillResultsAndRatings(skill, GOALTENDER, byPointsAndTime);
          } else if (hasType(skill, TIME, RATING)) { // controlled jumble
            createRankingsForSkillResults(skill, SKATER, byTime);
            createRankingsForSkillRatings(skill, GOALTENDER, byScore);
          } else if (hasType(skill, TIME_WITH_RATING, RATING)) { // hit the road
            createRankingsForSkillResultsAndRatings(skill, SKATER, byScoreAndTime);
            createRankingsForSkillRatings(skill, GOALTENDER, byScore);
          } else if (hasType(skill, POINTS, POINTS)) { // best shot
            createRankingsForSkillResultsAndRatings(skill, SKATER, byPoints);
            createRankingsForSkillResultsAndRatings(skill, GOALTENDER, byPoints);
          }
        });

    reSortEqualRankedPlayers(tournament, skills);

    skills.stream()
        .filter(skill -> hasType(skill, NO_RESULTS, GOALTENDERS_OVERALL)) // goaltenders overall
        .forEach(skill -> {
          log.info("Calculate rankings for skill '{}' with number {}",
              skill.getName(), skill.getNumber());
          if (hasType(skill, NO_RESULTS, GOALTENDERS_OVERALL)) { // goaltenders overall
            List<Player> goaltenders = playerRepository.findByPosition(GOALTENDER);
            // create arbitrary ranking first and resort them later
            List<SkillRanking> rankings = createLinearRanking(skill, goaltenders);
            Comparator<RankingPlus> byOverallAverageAndMaxOverallRank =
                comparing(RankingPlus::getOverallAverageRank)
                    .thenComparing(RankingPlus::getOverallMaxRank);
            resortRankings(tournament, rankings, byOverallAverageAndMaxOverallRank, true);
          }
        });

    log.info("Finished calculation of rankings for skills");
  }

  private List<SkillRanking> createLinearRanking(Skill skill, List<Player> players) {
    List<SkillRanking> rankings = new ArrayList<>();
    for (int i = 0; i < players.size(); i++) {
      int sequence = i + 1;
      rankings.add(SkillRanking.builder().sequence(sequence).rank(sequence)
          .skill(skill).player(players.get(i)).build());
    }
    return rankings;
  }

  private boolean hasType(Skill skill, SkillType playerType, SkillType goaltenderType) {
    return skill.getTypeForPlayers().equals(playerType)
        && skill.getTypeForGoaltenders().equals(goaltenderType);
  }

  private void createRankingsForSkillResultsAndRatings(Skill skill, PlayerPosition position,
      Comparator<ResultWithRating> comparator) {
    List<SkillRating> ratings = getRatings(skill, position);
    List<ResultWithRating> resultWithRatings = getResults(skill, position).stream()
        .map(skillResult -> ResultWithRating.valueOf(skillResult, penaltyTime, penaltyPoints))
        .peek(resultWithRating -> ratings.stream()
            .filter(rating -> rating.getPlayer().equals(resultWithRating.getPlayer()))
            .findFirst().ifPresent(rating -> resultWithRating.setScore(rating.getScore())))
        .sorted(comparator)
        .collect(Collectors.toList());
    createRanking(resultWithRatings, comparator);
  }

  private void createRankingsForSkillResults(Skill skill, PlayerPosition position,
      Comparator<ResultWithRating> comparator) {
    List<ResultWithRating> resultWithRatings = getResults(skill, position).stream()
        .map(skillResult -> ResultWithRating.valueOf(skillResult, penaltyTime, penaltyPoints))
        .sorted(comparator).collect(Collectors.toList());
    createRanking(resultWithRatings, comparator);
  }

  private void createRankingsForSkillRatings(Skill skill, PlayerPosition position,
      Comparator<ResultWithRating> comparator) {
    List<ResultWithRating> resultWithRatings = getRatings(skill, position).stream()
        .map(ResultWithRating::valueOf).sorted(comparator).collect(Collectors.toList());
    createRanking(resultWithRatings, comparator);
  }

  private List<SkillRating> getRatings(Skill skill, PlayerPosition position) {
    List<SkillRating> ratings = ratingRepository.findBySkill(skill);
    if (nonNull(position)) {
      ratings = ratings.stream()
          .filter(rating -> position.equals(rating.getPlayer().getPosition()))
          .collect(Collectors.toList());
    }
    return ratings;
  }

  private List<SkillResult> getResults(Skill skill, PlayerPosition position) {
    List<SkillResult> results = resultRepository.findBySkill(skill);
    if (nonNull(position)) {
      results = results.stream()
          .filter(result -> position.equals(result.getPlayer().getPosition()))
          .collect(Collectors.toList());
    }
    return results;
  }

  private List<SkillRanking> getRankings(Skill skill, PlayerPosition position) {
    List<SkillRanking> results = rankingRepository.findBySkillOrderBySequenceAsc(skill);
    if (nonNull(position)) {
      results = results.stream()
          .filter(ranking -> position.equals(ranking.getPlayer().getPosition()))
          .collect(Collectors.toList());
    }
    return results;
  }

  void createRanking(List<ResultWithRating> orderedResultsWithRating,
      Comparator<ResultWithRating> comparator) {
    int rank = -1;
    for (int i = 0; i < orderedResultsWithRating.size(); i++) {
      ResultWithRating current = orderedResultsWithRating.get(i);
      ResultWithRating previous = i > 0 ? orderedResultsWithRating.get(i - 1) : null;
      if (isNull(previous)) {
        rank = 1;
      } else if (comparator.compare(current, previous) == 0) {
        // use same rank as before
      } else {
        rank = i + 1;
      }
      SkillRanking ranking = SkillRanking.builder()
          .player(current.getPlayer())
          .skill(current.getSkill())
          .sequence(i + 1)
          .rank(rank)
          .build();
      rankingRepository.save(ranking);
    }
  }

  @Getter
  @Setter
  @Builder
  static class ResultWithRating {

    private Skill skill;
    private Player player;
    private BigDecimal time;
    private Integer points;
    private BigDecimal score;

    static ResultWithRating valueOf(SkillResult skillResult,
        Integer penaltyTimePerFailure, Integer penaltyPointsPerFailure) {
      // include failures to time or points
      BigDecimal time = skillResult.getTime();
      Integer points = skillResult.getPoints();
      if (nonNull(skillResult.getFailures()) && skillResult.getFailures() > 0) {
        if (nonNull(skillResult.getTime())) {
          time = skillResult.getTime().add(
              BigDecimal.valueOf(skillResult.getFailures())
                  .multiply(BigDecimal.valueOf(penaltyTimePerFailure)));
        } else if (nonNull(skillResult.getPoints())) {
          points = skillResult.getPoints() - (skillResult.getFailures() * penaltyPointsPerFailure);
        }
      }
      return ResultWithRating.builder()
          .skill(skillResult.getSkill())
          .player(skillResult.getPlayer())
          .time(time)
          .points(points)
          .build();
    }

    static ResultWithRating valueOf(SkillRating skillRating) {
      return ResultWithRating.builder()
          .skill(skillRating.getSkill())
          .player(skillRating.getPlayer())
          .score(skillRating.getScore())
          .build();
    }
  }

  void reSortEqualRankedPlayers(Tournament tournament, List<Skill> skills) {
    skills.forEach(skill -> {
      log.info("Sort equal ranked players by overall average and overall max rank for Skill '{}' "
          + "and position SKATER", skill.getName());
      reSortByOverallAverageAndOverallMaxRank(tournament,
          getEqualRankedRankings(getRankings(skill, SKATER)));

      log.info("Sort equal ranked players by overall average and overall max rank for Skill '{}' "
          + "and position GOALTENDER", skill.getName());
      reSortByOverallAverageAndOverallMaxRank(tournament,
          getEqualRankedRankings(getRankings(skill, GOALTENDER)));
    });
  }

  Map<Integer, List<SkillRanking>> getEqualRankedRankings(List<SkillRanking> rankings) {
    Set<Integer> items = new HashSet<>();
    Set<Integer> equalRanks = rankings.stream()
        .map(SkillRanking::getRank)
        // Set.add() returns false if the element was already in the set.
        .filter(rank -> !items.add(rank))
        .collect(Collectors.toSet());
    List<SkillRanking> equalRankedRankings = rankings.stream()
        .filter(ranking -> equalRanks.contains(ranking.getRank()))
        .collect(Collectors.toList());
    return equalRankedRankings.stream().collect(Collectors.groupingBy(
        SkillRanking::getRank, Collectors.mapping(Function.identity(), Collectors.toList())
    ));
  }

  void reSortByOverallAverageAndOverallMaxRank(
      Tournament tournament, Map<Integer, List<SkillRanking>> equalRankedRankings) {
    Comparator<RankingPlus> byCurrentAndOverallAverageAndMaxOverallRank =
        comparing(RankingPlus::getCurrentRank)
            .thenComparing(RankingPlus::getOverallAverageRank)
            .thenComparing(RankingPlus::getOverallMaxRank);
    equalRankedRankings.values().forEach(rankings ->
        resortRankings(tournament, rankings, byCurrentAndOverallAverageAndMaxOverallRank, false)
    );
  }

  private void resortRankings(
      Tournament tournament, List<SkillRanking> rankings, Comparator<RankingPlus> comparator,
      boolean setSequenceToRank) {
    List<RankingPlus> rankingsPlus = new ArrayList<>();
    rankings.forEach(ranking -> {
      List<SkillRanking> allRankingsForPlayer =
          rankingRepository.findByPlayerAndSkillTournament(ranking.getPlayer(), tournament);
      double overallAverageRank = allRankingsForPlayer.stream()
          .mapToInt(SkillRanking::getRank).summaryStatistics().getAverage();
      Integer overallMaxRank = allRankingsForPlayer.stream()
          .max(comparing(SkillRanking::getRank))
          .map(SkillRanking::getRank).orElseThrow();
      RankingPlus rankingPlus = RankingPlus.builder()
          .ranking(ranking).currentSequence(ranking.getSequence())
          .currentRank(ranking.getRank())
          .overallAverageRank(overallAverageRank)
          .overallMaxRank(overallMaxRank)
          .build();
      log.info(
          "Ranking to update: Seq: {}, rank: {}, overallAverageRank: {}, overallMaxRank: {}. "
              + "Player of team '{}' with number {}",
          rankingPlus.getCurrentSequence(), rankingPlus.getCurrentRank(),
          rankingPlus.getOverallAverageRank(), rankingPlus.getOverallMaxRank(),
          rankingPlus.getRanking().getPlayer().getTeam().getName(),
          rankingPlus.getRanking().getPlayer().getShirtNumber());
      rankingsPlus.add(rankingPlus);
    });
    rankingsPlus.sort(comparator);
    Integer startSequence = rankingsPlus.stream()
        .min(comparing(RankingPlus::getCurrentSequence))
        .map(RankingPlus::getCurrentSequence).orElseThrow();
    Integer newSequence = startSequence;
    for (RankingPlus rankingPlus : rankingsPlus) {
      SkillRanking ranking = rankingPlus.getRanking();
      ranking.setSequence(newSequence);
      if (setSequenceToRank) {
        ranking.setRank(newSequence);
      }
      rankingRepository.save(ranking);
      log.info("Updated ranking:   Seq: {}, rank: {}, overallAverageRank: {}, overallMaxRank: {}. "
              + "Player of team '{}' with number {}",
          newSequence, rankingPlus.getCurrentRank(),
          rankingPlus.getOverallAverageRank(), rankingPlus.getOverallMaxRank(),
          rankingPlus.getRanking().getPlayer().getTeam().getName(),
          rankingPlus.getRanking().getPlayer().getShirtNumber());
      newSequence++;
    }
  }

  @Getter
  @Builder
  private static class RankingPlus {

    private SkillRanking ranking;
    private Integer currentSequence;
    private Integer currentRank;
    private Double overallAverageRank;
    private Integer overallMaxRank;

  }

}
