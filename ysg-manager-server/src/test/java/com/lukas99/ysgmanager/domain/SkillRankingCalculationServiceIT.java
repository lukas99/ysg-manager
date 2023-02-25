package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.PlayerPosition.GOALTENDER;
import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;
import static java.util.Objects.nonNull;
import static org.assertj.core.api.Assertions.assertThat;

import com.lukas99.ysgmanager.adapter.rest.IntegrationTest;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
class SkillRankingCalculationServiceIT extends IntegrationTest {

  @Autowired
  private SkillService skillService;

  @Autowired
  private SkillRankingRepository skillRankingRepository;

  @Autowired
  private SkillTournamentRankingRepository skillTournamentRankingRepository;

  @Autowired
  private EntityManager em;

  private Tournament ysg2019;
  private Skill magicTransitions;
  private Skill bestShot;
  private Skill passAndGo;
  private Skill controlledJumble;
  private Skill hitTheRoad;
  private Skill goaltenders;
  private SkillRankingCalculationServiceITHelper helper;

  @BeforeEach
  public void setup() {
    ysg2019 = TournamentTemplates.ysg2019(em);

    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    Team scBern = TeamTemplates.scBern(ysg2019, em);
    Team ehcStMoritz = TeamTemplates.ehcStMoritz(ysg2019, em);
    Team gckLions = TeamTemplates.gckLions(ysg2019, em);
    Team evZug = TeamTemplates.evZug(ysg2019, em);
    Team ehcBasel = TeamTemplates.ehcBasel(ysg2019, em);
    Team hcLugano = TeamTemplates.hcLugano(ysg2019, em);
    Team hcLausanne = TeamTemplates.hcLausanne(ysg2019, em);
    Team bavarianLions = TeamTemplates.bavarianLions(ysg2019, em);
    Team ehcBurgdorf = TeamTemplates.ehcBurgdorf(ysg2019, em);

    magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    bestShot = SkillTemplates.bestShot(ysg2019, em);
    passAndGo = SkillTemplates.passAndGo(ysg2019, em);
    controlledJumble = SkillTemplates.controlledJumble(ysg2019, em);
    hitTheRoad = SkillTemplates.hitTheRoad(ysg2019, em);
    goaltenders = SkillTemplates.goaltenders(ysg2019, em);

    helper = new SkillRankingCalculationServiceITHelper(em,
        ehcEngelberg, scBern, ehcStMoritz, gckLions, evZug, ehcBasel, hcLugano, hcLausanne,
        bavarianLions, ehcBurgdorf, magicTransitions, bestShot, passAndGo, controlledJumble,
        hitTheRoad, goaltenders);

    helper.addMagicTransitionsResultsAndRatings();
    helper.addBestShotResults();
    helper.addPassAndGoResults();
    helper.addControlledJumbleResultsAndRatings();
    helper.addHitTheRoadResultsAndRatings();
    helper.persist();

    // add rankings which should be removed before calculating the rankings
    skillRankingRepository.save(SkillRanking.builder()
        .skill(hitTheRoad).player(helper.getPlayer(343))
        .rank(1).sequence(1)
        .build());
    skillTournamentRankingRepository.save(SkillTournamentRanking.builder()
        .skill(hitTheRoad).player(helper.getPlayer(343))
        .rank(1).sequence(1)
        .build());
  }

  @Test
  @Transactional
  void calculateSkillRankings() {
    skillService.calculateSkillRankings(ysg2019);

    assertCorrectIndividualSkillResults();
    assertCorrectTournamentSkillResults();
  }

  private void assertCorrectIndividualSkillResults() {
    List<SkillRanking> mtRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(magicTransitions);
    List<SkillRanking> mtPlayerRanking = filterByPlayerPosition(mtRanking, SKATER);
    List<SkillRanking> mtGoaltenderRanking = filterByPlayerPosition(mtRanking, GOALTENDER);
    assertThat(mtPlayerRanking.size()).isEqualTo(118);
    assertThat(mtGoaltenderRanking.size()).isEqualTo(19);
    assertFirstSixRanks(mtPlayerRanking, 1, 338, 2, 373, 3, 715, 4, 343, 5, 119, 6, 397);
    assertFirstSixRanks(mtGoaltenderRanking, 1, 1, 2, 815, 3, 627, 4, 225, 5, 540, 6, 430);

    List<SkillRanking> pgRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(passAndGo);
    List<SkillRanking> pgPlayerRanking = filterByPlayerPosition(pgRanking, SKATER);
    List<SkillRanking> pgGoaltenderRanking = filterByPlayerPosition(pgRanking, GOALTENDER);
    assertThat(pgPlayerRanking.size()).isEqualTo(118);
    assertThat(pgGoaltenderRanking.size()).isEqualTo(19);
    assertFirstSixRanks(pgPlayerRanking, 1, 338, 2, 913, 3, 714, 4, 388, 5, 707, 6, 702);
    assertFirstSixRanks(pgGoaltenderRanking, 1, 629, 2, 130, 3, 815, 4, 901, 5, 627, 6, 21);

    List<SkillRanking> cjRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(controlledJumble);
    List<SkillRanking> cjPlayerRanking = filterByPlayerPosition(cjRanking, SKATER);
    List<SkillRanking> cjGoaltenderRanking = filterByPlayerPosition(cjRanking, GOALTENDER);
    assertThat(cjPlayerRanking.size()).isEqualTo(118);
    assertThat(cjGoaltenderRanking.size()).isEqualTo(19);
    assertFirstSixRanks(cjPlayerRanking, 1, 20, 2, 6, 3, 343, 4, 210, 5, 379, 6, 119);
    assertFirstSixRanks(cjGoaltenderRanking, 1, 1, 2, 101, 3, 627, 4, 501, 5, 450, 6, 540);

    List<SkillRanking> hrRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(hitTheRoad);
    List<SkillRanking> hrPlayerRanking = filterByPlayerPosition(hrRanking, SKATER);
    List<SkillRanking> hrGoaltenderRanking = filterByPlayerPosition(hrRanking, GOALTENDER);
    assertThat(hrPlayerRanking.size()).isEqualTo(118);
    assertThat(hrGoaltenderRanking.size()).isEqualTo(19);
    assertFirstSixRanks(hrPlayerRanking, 1, 338, 2, 529, 3, 512, 4, 426, 5, 343, 6, 810);
    assertFirstSixRanks(hrGoaltenderRanking, 1, 627, 2, 1, 3, 130, 4, 815, 5, 540, 6, 701);

    List<SkillRanking> bsRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(bestShot);
    List<SkillRanking> bsPlayerRanking = filterByPlayerPosition(bsRanking, SKATER);
    List<SkillRanking> bsGoaltenderRanking = filterByPlayerPosition(bsRanking, GOALTENDER);
    assertThat(bsPlayerRanking.size()).isEqualTo(118);
    assertThat(bsGoaltenderRanking.size()).isEqualTo(19);
    assertFirstSixRanks(bsPlayerRanking, 1, 515, 1, 8, 3, 507, 3, 913, 3, 521, 3, 368);
    assertFirstSixRanks(bsGoaltenderRanking, 1, 1, 1, 901, 1, 355, 1, 370, 1, 430, 1, 201);

    List<SkillRanking> goaltendersRanking =
        skillRankingRepository.findBySkillOrderBySequenceAsc(goaltenders);
    assertThat(goaltendersRanking.size()).isEqualTo(19);
    assertFirstSixRanks(goaltendersRanking, 1, 627, 2, 1, 3, 130, 4, 815, 5, 901, null, null);
  }

  private void assertCorrectTournamentSkillResults() {
    List<SkillTournamentRanking> mtTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(magicTransitions);
    assertThat(mtTotalRanking.size()).isEqualTo(6);
    assertFirstSixRanks(mtTotalRanking, 1, 338, 2, 373, 3, 715, 4, 119, 5, 397, 6, 802);

    List<SkillTournamentRanking> pgTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(passAndGo);
    assertThat(pgTotalRanking.size()).isEqualTo(6);
    assertFirstSixRanks(pgTotalRanking, 1, 913, 2, 714, 3, 388, 4, 707, 5, 702, 6, 712);

    List<SkillTournamentRanking> cjTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(controlledJumble);
    assertThat(cjTotalRanking.size()).isEqualTo(6);
    assertFirstSixRanks(cjTotalRanking, 1, 20, 2, 6, 3, 343, 4, 210, 5, 379, 6, 506);

    List<SkillTournamentRanking> hrTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(hitTheRoad);
    assertThat(hrTotalRanking.size()).isEqualTo(6);
    assertFirstSixRanks(hrTotalRanking, 1, 529, 2, 512, 3, 426, 4, 810, 5, 339, 6, 106);

    List<SkillTournamentRanking> bsTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(bestShot);
    assertThat(bsTotalRanking.size()).isEqualTo(6);
    assertFirstSixRanks(bsTotalRanking, 1, 515, 1, 8, 3, 507, 3, 521, 3, 368, 3, 956);

    List<SkillTournamentRanking> goaltendersTotalRanking =
        skillTournamentRankingRepository.findBySkillOrderBySequenceAsc(goaltenders);
    assertThat(goaltendersTotalRanking.size()).isEqualTo(4);
    assertFirstSixRanks(goaltendersTotalRanking, 1, 627, 2, 1, 3, 130, 4, 815, null, null, null,
        null);
  }

  private void assertFirstSixRanks(List<? extends Ranking> ranking, Integer rank1, Integer player1,
      Integer rank2, Integer second, Integer rank3, Integer third, Integer rank4, Integer forth,
      Integer rank5, Integer fifth, Integer rank6, Integer sixth) {
    assertThat(ranking.get(0).getRank()).isEqualTo(rank1);
    assertThat(ranking.get(0).getSequence()).isEqualTo(1);
    assertThat(ranking.get(0).getPlayer()).isEqualTo(helper.getPlayer(player1));
    assertThat(ranking.get(1).getRank()).isEqualTo(rank2);
    assertThat(ranking.get(1).getSequence()).isEqualTo(2);
    assertThat(ranking.get(1).getPlayer()).isEqualTo(helper.getPlayer(second));
    assertThat(ranking.get(2).getRank()).isEqualTo(rank3);
    assertThat(ranking.get(2).getSequence()).isEqualTo(3);
    assertThat(ranking.get(2).getPlayer()).isEqualTo(helper.getPlayer(third));
    assertThat(ranking.get(3).getRank()).isEqualTo(rank4);
    assertThat(ranking.get(3).getSequence()).isEqualTo(4);
    assertThat(ranking.get(3).getPlayer()).isEqualTo(helper.getPlayer(forth));
    if (nonNull(fifth)) {
      assertThat(ranking.get(4).getRank()).isEqualTo(rank5);
      assertThat(ranking.get(4).getSequence()).isEqualTo(5);
      assertThat(ranking.get(4).getPlayer()).isEqualTo(helper.getPlayer(fifth));
    }
    if (nonNull(sixth)) {
      assertThat(ranking.get(5).getRank()).isEqualTo(rank6);
      assertThat(ranking.get(5).getSequence()).isEqualTo(6);
      assertThat(ranking.get(5).getPlayer()).isEqualTo(helper.getPlayer(sixth));
    }
  }

  private List<SkillRanking> filterByPlayerPosition(
      List<SkillRanking> rankings, PlayerPosition position) {
    return rankings.stream()
        .filter(rank -> rank.getPlayer().getPosition().equals(position))
        .collect(Collectors.toList());
  }

}
