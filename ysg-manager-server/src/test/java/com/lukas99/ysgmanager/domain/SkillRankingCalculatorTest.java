package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.PlayerPosition.GOALTENDER;
import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.bestShotResult;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.magicTransitionsResult;
import static java.util.Comparator.comparing;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lukas99.ysgmanager.domain.SkillRankingCalculator.ResultWithRating;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SkillRankingCalculatorTest {

  @InjectMocks
  private SkillRankingCalculator calculator;

  @Mock
  private SkillRatingRepository skillRatingRepository;

  @Mock
  private SkillResultRepository skillResultRepository;

  @Mock
  private SkillRankingRepository rankingRepository;

  @Mock
  private PlayerRepository playerRepository;

  @Captor
  private ArgumentCaptor<SkillRanking> rankingCaptor;

  private Tournament ysg2019;

  private Skill skill;

  private Player player1;
  private Player player2;
  private Player player3;
  private Player player4;
  private Player player5;
  private Player player6;

  @BeforeEach
  public void setUp() {
    ysg2019 = TournamentTemplates.ysg2019();
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019);

    skill = SkillTemplates.magicTransitions(ysg2019);

    player1 = Player.builder().id(1L).shirtNumber(1).position(SKATER).team(ehcEngelberg).build();
    player2 = Player.builder().id(2L).shirtNumber(2).position(SKATER).team(ehcEngelberg).build();
    player3 = Player.builder().id(3L).shirtNumber(3).position(SKATER).team(ehcEngelberg).build();
    player4 = Player.builder().id(4L).shirtNumber(4).position(SKATER).team(ehcEngelberg).build();
    player5 = Player.builder().id(5L).shirtNumber(5).position(SKATER).team(ehcEngelberg).build();
    player6 = Player.builder().id(6L).shirtNumber(6).position(SKATER).team(ehcEngelberg).build();
  }

  @Test
  public void createRanking() {
    List<ResultWithRating> resultsWithRating = List.of(
        ResultWithRating.builder().skill(skill).player(player1).points(90).build(),
        ResultWithRating.builder().skill(skill).player(player2).points(90).build(),
        ResultWithRating.builder().skill(skill).player(player3).points(85).build(),
        ResultWithRating.builder().skill(skill).player(player4).points(85).build(),
        ResultWithRating.builder().skill(skill).player(player5).points(80).build(),
        ResultWithRating.builder().skill(skill).player(player6).points(79).build()
    );

    Comparator<ResultWithRating> byPoints = comparing(ResultWithRating::getPoints).reversed();
    calculator.createRanking(resultsWithRating, byPoints);

    verify(rankingRepository, times(6)).save(rankingCaptor.capture());
    List<SkillRanking> savedRankings = rankingCaptor.getAllValues();
    assertThat(savedRankings.size()).isEqualTo(6);

    assertThat(savedRankings.get(0).getRank()).isEqualTo(1);
    assertThat(savedRankings.get(0).getPlayer()).isEqualTo(player1);
    assertThat(savedRankings.get(0).getSkill()).isEqualTo(skill);

    assertThat(savedRankings.get(1).getRank()).isEqualTo(1);
    assertThat(savedRankings.get(1).getPlayer()).isEqualTo(player2);
    assertThat(savedRankings.get(1).getSkill()).isEqualTo(skill);

    assertThat(savedRankings.get(2).getRank()).isEqualTo(3);
    assertThat(savedRankings.get(2).getPlayer()).isEqualTo(player3);
    assertThat(savedRankings.get(2).getSkill()).isEqualTo(skill);

    assertThat(savedRankings.get(3).getRank()).isEqualTo(3);
    assertThat(savedRankings.get(3).getPlayer()).isEqualTo(player4);
    assertThat(savedRankings.get(3).getSkill()).isEqualTo(skill);

    assertThat(savedRankings.get(4).getRank()).isEqualTo(5);
    assertThat(savedRankings.get(4).getPlayer()).isEqualTo(player5);
    assertThat(savedRankings.get(4).getSkill()).isEqualTo(skill);

    assertThat(savedRankings.get(5).getRank()).isEqualTo(6);
    assertThat(savedRankings.get(5).getPlayer()).isEqualTo(player6);
    assertThat(savedRankings.get(5).getSkill()).isEqualTo(skill);
  }

  @Test
  public void getEqualRankedRankings() {
    SkillRanking ranking11 = SkillRanking.builder().id(1L).rank(1).build();
    SkillRanking ranking12 = SkillRanking.builder().id(2L).rank(1).build();
    SkillRanking ranking3 = SkillRanking.builder().id(3L).rank(3).build();
    SkillRanking ranking41 = SkillRanking.builder().id(4L).rank(4).build();
    SkillRanking ranking42 = SkillRanking.builder().id(5L).rank(4).build();
    SkillRanking ranking6 = SkillRanking.builder().id(6L).rank(6).build();
    List<SkillRanking> rankings =
        List.of(ranking11, ranking12, ranking3, ranking41, ranking42, ranking6);

    Map<Integer, List<SkillRanking>> equalRankedRankings =
        calculator.getEqualRankedRankings(rankings);

    assertThat(equalRankedRankings.size()).isEqualTo(2);
    assertThat(equalRankedRankings.get(1).size()).isEqualTo(2);
    assertThat(equalRankedRankings.get(1)).containsOnlyOnce(ranking11, ranking12);
    assertThat(equalRankedRankings.get(4).size()).isEqualTo(2);
    assertThat(equalRankedRankings.get(4)).containsOnlyOnce(ranking41, ranking42);
  }

  @Test
  public void reSortByOverallAverageAndOverallMaxRank() {
    Tournament tournament = new Tournament();

    SkillRanking ranking11 = SkillRanking.builder().player(player1).sequence(1).rank(1).build();
    SkillRanking ranking12 = SkillRanking.builder().player(player2).sequence(2).rank(1).build();
    SkillRanking ranking61 = SkillRanking.builder().player(player3).sequence(6).rank(6).build();
    SkillRanking ranking62 = SkillRanking.builder().player(player4).sequence(7).rank(6).build();

    Map<Integer, List<SkillRanking>> equalRankedRankings = Map.of(
        1, List.of(ranking11, ranking12),
        6, List.of(ranking61, ranking62));

    when(rankingRepository.findByPlayerAndSkillTournament(player1, tournament)).thenReturn(List.of(
        SkillRanking.builder().rank(5).build(),
        SkillRanking.builder().rank(12).build())); // average rank: 8.5
    when(rankingRepository.findByPlayerAndSkillTournament(player2, tournament)).thenReturn(List.of(
        SkillRanking.builder().rank(10).build(),
        SkillRanking.builder().rank(4).build())); // average rank: 7
    when(rankingRepository.findByPlayerAndSkillTournament(player3, tournament)).thenReturn(List.of(
        SkillRanking.builder().rank(1).build(),
        SkillRanking.builder().rank(3).build())); // average rank: 2 -> max overall rank: 2
    when(rankingRepository.findByPlayerAndSkillTournament(player4, tournament)).thenReturn(List.of(
        SkillRanking.builder().rank(2).build(),
        SkillRanking.builder().rank(2).build())); // average rank: 2 -> max overall rank: 3

    calculator.reSortByOverallAverageAndOverallMaxRank(tournament, equalRankedRankings);

    verify(rankingRepository, times(4)).save(rankingCaptor.capture());
    List<SkillRanking> savedRankings = rankingCaptor.getAllValues();

    assertThat(savedRankings.size()).isEqualTo(4);
    assertThat(savedRankings).containsOnlyOnce(ranking11, ranking12, ranking61, ranking62);

    assertThat(ranking11.getRank()).isEqualTo(1);
    assertThat(ranking11.getSequence()).isEqualTo(2);

    assertThat(ranking12.getRank()).isEqualTo(1);
    assertThat(ranking12.getSequence()).isEqualTo(1);

    assertThat(ranking61.getRank()).isEqualTo(6);
    assertThat(ranking61.getSequence()).isEqualTo(7);

    assertThat(ranking62.getRank()).isEqualTo(6);
    assertThat(ranking62.getSequence()).isEqualTo(6);
  }

  @Test
  public void resultWithRatingRespectsFailures_skillWithTime() {
    SkillResult skillResult = magicTransitionsResult(skill, player1).toBuilder()
        .failures(2).time(new BigDecimal("12.6")).build();

    ResultWithRating resultWithRating = ResultWithRating.valueOf(skillResult, 1, 1);

    assertThat(resultWithRating.getTime()).isEqualTo(new BigDecimal("14.6"));
  }

  @Test
  public void resultWithRatingRespectsFailures_skillWithPoints() {
    SkillResult skillResult = bestShotResult(skill, player1).toBuilder()
        .failures(2).points(5).build();

    ResultWithRating resultWithRating = ResultWithRating.valueOf(skillResult, 1, 1);

    assertThat(resultWithRating.getPoints()).isEqualTo(3);
    assertThat(resultWithRating.getTime()).isNull();
  }

  @Test
  public void resultWithRatingRespectsFailures_failuresIsNull() {
    SkillResult skillResult = magicTransitionsResult(skill, player1).toBuilder()
        .failures(null).time(new BigDecimal("12.6")).build();

    ResultWithRating resultWithRating = ResultWithRating.valueOf(skillResult, 1, 1);

    assertThat(resultWithRating.getTime()).isEqualTo(new BigDecimal("12.6"));
  }

  @Test
  public void resultWithRatingRespectsFailures_skillWithTime_failuresIsZero() {
    SkillResult skillResult = magicTransitionsResult(skill, player1).toBuilder()
        .failures(0).time(new BigDecimal("12.6")).build();

    ResultWithRating resultWithRating = ResultWithRating.valueOf(skillResult, 1, 1);

    assertThat(resultWithRating.getTime()).isEqualTo(new BigDecimal("12.6"));
  }

  @Test
  public void createRankingsForSkillResultsAndRatings_withoutRating() {
    when(skillResultRepository.findBySkill(skill)).thenReturn((List.of(
        SkillResult.builder().skill(skill).player(player1).time(new BigDecimal("20")).build(),
        SkillResult.builder().skill(skill).player(player2).time(new BigDecimal("15")).build(),
        SkillResult.builder().skill(skill).player(player3).time(new BigDecimal("10")).build()
    )));
    // no rating for player 3
    when(skillRatingRepository.findBySkill(skill)).thenReturn(List.of(
        SkillRating.builder().skill(skill).player(player1).score(new BigDecimal("60")).build(),
        SkillRating.builder().skill(skill).player(player2).score(new BigDecimal("70")).build()
    ));

    Comparator<ResultWithRating> byTime = comparing(ResultWithRating::getTime);
    Comparator<ResultWithRating> byScore = comparing(ResultWithRating::getScore).reversed();
    Comparator<ResultWithRating> byScoreAndTime = byScore.thenComparing(byTime);

    calculator.createRankingsForSkillResultsAndRatings(skill, SKATER, byScoreAndTime);

    ArgumentCaptor<SkillRanking> skillRankingCaptor = ArgumentCaptor.forClass(SkillRanking.class);
    verify(rankingRepository, times(2)).save(skillRankingCaptor.capture());
    List<SkillRanking> savedRankings = skillRankingCaptor.getAllValues();
    assertThat(savedRankings.size()).isEqualTo(2);
    List<Player> playersWithRanking =
        savedRankings.stream().map(SkillRanking::getPlayer).collect(Collectors.toList());
    assertThat(playersWithRanking).contains(player1, player2);
  }

  @Test
  public void resortRankings_forGoaltenders_withoutRankings() {
    when(playerRepository.findByPosition(GOALTENDER))
        .thenReturn(List.of(player1, player2, player3));

    when(rankingRepository.findByPlayerAndSkillTournament(player1, ysg2019)).thenReturn(List.of(
        SkillRanking.builder().player(player1).rank(1).build(),
        SkillRanking.builder().player(player1).rank(10).build()));
    when(rankingRepository.findByPlayerAndSkillTournament(player2, ysg2019)).thenReturn(List.of(
        SkillRanking.builder().player(player2).rank(3).build(),
        SkillRanking.builder().player(player2).rank(3).build()));
    when(rankingRepository.findByPlayerAndSkillTournament(player3, ysg2019))
        .thenReturn(Lists.emptyList());

    calculator.createRankingsForGoaltendersOverall(ysg2019, SkillTemplates.goaltenders(ysg2019));

    ArgumentCaptor<SkillRanking> skillRankingCaptor = ArgumentCaptor.forClass(SkillRanking.class);
    verify(rankingRepository, times(2)).save(skillRankingCaptor.capture());
    List<SkillRanking> savedRankings = skillRankingCaptor.getAllValues();
    assertThat(savedRankings.size()).isEqualTo(2);
    List<Player> playersWithRanking =
        savedRankings.stream().map(SkillRanking::getPlayer).collect(Collectors.toList());
    assertThat(playersWithRanking).containsExactly(player2, player1); // player2 is better
  }

  @Test
  public void resortRankings_forGoaltenders_rankPlayersWithMoreSkillResultsBetter() {
    when(playerRepository.findByPosition(GOALTENDER))
        .thenReturn(List.of(player1, player2, player3));

    when(rankingRepository.findByPlayerAndSkillTournament(player1, ysg2019)).thenReturn(List.of(
        SkillRanking.builder().player(player1).rank(10).build(),
        SkillRanking.builder().player(player1).rank(10).build(),
        SkillRanking.builder().player(player1).rank(10).build()));
    when(rankingRepository.findByPlayerAndSkillTournament(player2, ysg2019)).thenReturn(List.of(
        SkillRanking.builder().player(player2).rank(2).build(),
        SkillRanking.builder().player(player2).rank(2).build()));
    when(rankingRepository.findByPlayerAndSkillTournament(player3, ysg2019)).thenReturn(List.of(
        SkillRanking.builder().player(player3).rank(1).build(),
        SkillRanking.builder().player(player3).rank(1).build()));

    calculator.createRankingsForGoaltendersOverall(ysg2019, SkillTemplates.goaltenders(ysg2019));

    ArgumentCaptor<SkillRanking> skillRankingCaptor = ArgumentCaptor.forClass(SkillRanking.class);
    verify(rankingRepository, times(3)).save(skillRankingCaptor.capture());
    List<SkillRanking> savedRankings = skillRankingCaptor.getAllValues();
    assertThat(savedRankings.size()).isEqualTo(3);
    List<Player> playersWithRanking =
        savedRankings.stream().map(SkillRanking::getPlayer).collect(Collectors.toList());
    assertThat(playersWithRanking).containsExactly(player1, player3, player2); // player2 is best
  }

}
