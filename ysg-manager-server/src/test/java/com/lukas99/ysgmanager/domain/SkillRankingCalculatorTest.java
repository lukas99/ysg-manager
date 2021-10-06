package com.lukas99.ysgmanager.domain;

import static java.util.Comparator.comparing;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lukas99.ysgmanager.domain.SkillRankingCalculator.ResultWithRating;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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
  private SkillRankingRepository rankingRepository;

  @Captor
  private ArgumentCaptor<SkillRanking> rankingCaptor;

  private Skill skill;

  private Player player1;
  private Player player2;
  private Player player3;
  private Player player4;
  private Player player5;
  private Player player6;

  @BeforeEach
  public void setUp() {
    Tournament ysg2019 = TournamentTemplates.ysg2019();
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019);

    skill = SkillTemplates.magicTransitions(ysg2019);

    player1 = Player.builder().id(1L).shirtNumber(1).team(ehcEngelberg).build();
    player2 = Player.builder().id(2L).shirtNumber(2).team(ehcEngelberg).build();
    player3 = Player.builder().id(3L).shirtNumber(3).team(ehcEngelberg).build();
    player4 = Player.builder().id(4L).shirtNumber(4).team(ehcEngelberg).build();
    player5 = Player.builder().id(5L).shirtNumber(5).team(ehcEngelberg).build();
    player6 = Player.builder().id(6L).shirtNumber(6).team(ehcEngelberg).build();
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

}
