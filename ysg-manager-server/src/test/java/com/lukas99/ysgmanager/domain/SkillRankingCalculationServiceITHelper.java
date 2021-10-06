package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.PlayerPosition.GOALTENDER;
import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.persistence.EntityManager;

class SkillRankingCalculationServiceITHelper {

  private final EntityManager em;

  private final Team ehcEngelberg;
  private final Team scBern;
  private final Team ehcStMoritz;
  private final Team gckLions;
  private final Team evZug;
  private final Team ehcBasel;
  private final Team hcLugano;
  private final Team hcLausanne;
  private final Team bavarianLions;
  private final Team ehcBurgdorf;

  private final Skill magicTransitions;
  private final Skill bestShot;
  private final Skill passAndGo;
  private final Skill controlledJumble;
  private final Skill hitTheRoad;
  private final Skill goaltenders;

  private final Map<String, Player> players = new HashMap<>();
  private final List<SkillResult> skillResults = new ArrayList<>();
  private final List<SkillRating> skillRatings = new ArrayList<>();

  SkillRankingCalculationServiceITHelper(EntityManager em,
      Team ehcEngelberg, Team scBern, Team ehcStMoritz, Team gckLions, Team evZug, Team ehcBasel,
      Team hcLugano, Team hcLausanne, Team bavarianLions, Team ehcBurgdorf,
      Skill magicTransitions, Skill bestShot, Skill passAndGo,
      Skill controlledJumble, Skill hitTheRoad, Skill goaltenders) {
    this.em = em;

    this.ehcEngelberg = ehcEngelberg;
    this.scBern = scBern;
    this.ehcStMoritz = ehcStMoritz;
    this.gckLions = gckLions;
    this.evZug = evZug;
    this.ehcBasel = ehcBasel;
    this.hcLugano = hcLugano;
    this.hcLausanne = hcLausanne;
    this.bavarianLions = bavarianLions;
    this.ehcBurgdorf = ehcBurgdorf;

    this.magicTransitions = magicTransitions;
    this.bestShot = bestShot;
    this.passAndGo = passAndGo;
    this.controlledJumble = controlledJumble;
    this.hitTheRoad = hitTheRoad;
    this.goaltenders = goaltenders;
  }

  Player getPlayer(int playerNumber) {
    return players.get(String.valueOf(playerNumber));
  }

  void persist() {
    players.values().forEach(em::persist);
    Collections.shuffle(skillResults); // because results are ordered by rank
    Collections.shuffle(skillRatings); // because ratings are ordered by rank
    skillResults.forEach(em::persist);
    skillRatings.forEach(em::persist);
  }

  private void addMagicTransitionResultAndRating(int playerNumber, int score, double time,
      PlayerPosition position) {
    Player player = getOrCreatePlayer(playerNumber, position);
    skillResults.add(SkillResult.builder().player(player).skill(magicTransitions)
        .time(new BigDecimal(time)).build());
    skillRatings.add(SkillRating.builder().player(player).skill(magicTransitions)
        .score(new BigDecimal(score)).build());
  }

  private void addBestShotResult(int playerNumber, int points, PlayerPosition position) {
    Player player = getOrCreatePlayer(playerNumber, position);
    skillResults.add(SkillResult.builder().player(player).skill(bestShot)
        .points(points).build());
  }

  private void addPassAndGoResult(int playerNumber, int points, double time,
      PlayerPosition position) {
    Player player = getOrCreatePlayer(playerNumber, position);
    skillResults.add(SkillResult.builder().player(player).skill(passAndGo)
        .points(points).time(new BigDecimal(time)).build());
  }

  private void addControlledJumblePlayerResult(int playerNumber, double time) {
    Player player = getOrCreatePlayer(playerNumber, SKATER);
    skillResults.add(SkillResult.builder().player(player).skill(controlledJumble)
        .time(new BigDecimal(time)).build());
  }

  private void addControlledJumbleGoaltenderRating(int playerNumber, double score) {
    Player player = getOrCreatePlayer(playerNumber, SKATER);
    skillRatings.add(SkillRating.builder().player(player).skill(controlledJumble)
        .score(new BigDecimal(score)).build());
  }

  private void addHitTheRoadPlayerResultAndRating(int playerNumber, double score, double time) {
    Player player = getOrCreatePlayer(playerNumber, SKATER);
    skillResults.add(SkillResult.builder().player(player).skill(hitTheRoad)
        .time(new BigDecimal(time)).build());
    skillRatings.add(SkillRating.builder().player(player).skill(hitTheRoad)
        .score(new BigDecimal(score)).build());
  }

  private void addHitTheRoadGoaltenderRating(int playerNumber, double score) {
    Player player = getOrCreatePlayer(playerNumber, SKATER);
    skillRatings.add(SkillRating.builder().player(player).skill(hitTheRoad)
        .score(new BigDecimal(score)).build());
  }

  private Player getOrCreatePlayer(int playerNumber, PlayerPosition position) {
    String number = Integer.valueOf(playerNumber).toString();
    return Optional.ofNullable(players.get(number))
        .orElseGet(() -> createAndAddPlayer(number, position));
  }

  private Player createAndAddPlayer(String playerNumber, PlayerPosition position) {
    int shirtNumber;
    Team team;
    if (playerNumber.length() <= 2) {
      shirtNumber = Integer.parseInt(playerNumber);
      team = ehcEngelberg;
    } else {
      shirtNumber = Integer.parseInt(playerNumber.substring(1));
      int teamNumber = Integer.parseInt(playerNumber.substring(0, 1));
      team = getTeam(teamNumber);
    }
    Player player = Player.builder()
        .team(team)
        .shirtNumber(shirtNumber)
        .position(position)
        .build();
    players.put(playerNumber, player);
    return player;
  }

  private Team getTeam(int teamNumber) {
    return switch (teamNumber) {
      case 1 -> ehcBurgdorf;
      case 2 -> ehcStMoritz;
      case 3 -> gckLions;
      case 4 -> evZug;
      case 5 -> scBern;
      case 6 -> ehcBasel;
      case 7 -> hcLugano;
      case 8 -> hcLausanne;
      case 9 -> bavarianLions;
      default -> ehcEngelberg;
    };
  }

  // 397w -> 397
  // 397b -> 398
  public void addMagicTransitionsResultsAndRatings() {
    addMagicTransitionResultAndRating(338, 90, 17.81, SKATER);
    addMagicTransitionResultAndRating(373, 85, 17.8, SKATER);
    addMagicTransitionResultAndRating(715, 85, 18.35, SKATER);
    addMagicTransitionResultAndRating(343, 85, 19.44, SKATER);
    addMagicTransitionResultAndRating(119, 85, 19.5, SKATER);
    addMagicTransitionResultAndRating(397, 85, 21.06, SKATER);
    addMagicTransitionResultAndRating(6, 83, 18.16, SKATER);
    addMagicTransitionResultAndRating(802, 83, 20.18, SKATER);
    addMagicTransitionResultAndRating(810, 82, 18.75, SKATER);
    addMagicTransitionResultAndRating(118, 80, 16.2, SKATER);
    addMagicTransitionResultAndRating(379, 80, 18, SKATER);
    addMagicTransitionResultAndRating(714, 80, 18.22, SKATER);
    addMagicTransitionResultAndRating(534, 80, 18.53, SKATER);
    addMagicTransitionResultAndRating(125, 80, 18.59, SKATER);
    addMagicTransitionResultAndRating(129, 80, 18.6, SKATER);
    addMagicTransitionResultAndRating(110, 80, 18.72, SKATER);
    addMagicTransitionResultAndRating(509, 80, 18.84, SKATER);
    addMagicTransitionResultAndRating(512, 80, 19, SKATER);
    addMagicTransitionResultAndRating(115, 80, 19.05, SKATER);
    addMagicTransitionResultAndRating(20, 80, 19.07, SKATER);
    addMagicTransitionResultAndRating(505, 80, 19.31, SKATER);
    addMagicTransitionResultAndRating(713, 80, 19.4, SKATER);
    addMagicTransitionResultAndRating(434, 80, 20, SKATER);
    addMagicTransitionResultAndRating(109, 80, 20.03, SKATER);
    addMagicTransitionResultAndRating(809, 80, 20.75, SKATER);
    addMagicTransitionResultAndRating(388, 80, 21.04, SKATER);
    addMagicTransitionResultAndRating(814, 80, 21.15, SKATER);
    addMagicTransitionResultAndRating(531, 80, 21.94, SKATER);
    addMagicTransitionResultAndRating(408, 80, 22.64, SKATER);
    addMagicTransitionResultAndRating(124, 80, 23.1, SKATER);
    addMagicTransitionResultAndRating(702, 80, 24.97, SKATER);
    addMagicTransitionResultAndRating(106, 80, 26.88, SKATER);
    addMagicTransitionResultAndRating(812, 78, 19.75, SKATER);
    addMagicTransitionResultAndRating(10, 78, 20.91, SKATER);
    addMagicTransitionResultAndRating(14, 78, 21.85, SKATER);
    addMagicTransitionResultAndRating(806, 77, 20.13, SKATER);
    addMagicTransitionResultAndRating(5, 77, 22.35, SKATER);
    addMagicTransitionResultAndRating(803, 77, 27.53, SKATER);
    addMagicTransitionResultAndRating(11, 76, 18.85, SKATER);
    addMagicTransitionResultAndRating(339, 75, 17.91, SKATER);
    addMagicTransitionResultAndRating(362, 75, 18.34, SKATER);
    addMagicTransitionResultAndRating(529, 75, 18.56, SKATER);
    addMagicTransitionResultAndRating(521, 75, 18.68, SKATER);
    addMagicTransitionResultAndRating(506, 75, 18.72, SKATER);
    addMagicTransitionResultAndRating(426, 75, 19.05, SKATER);
    addMagicTransitionResultAndRating(406, 75, 19.32, SKATER);
    addMagicTransitionResultAndRating(368, 75, 19.56, SKATER);
    addMagicTransitionResultAndRating(908, 75, 19.72, SKATER);
    addMagicTransitionResultAndRating(513, 75, 19.75, SKATER);
    addMagicTransitionResultAndRating(515, 75, 20.21, SKATER);
    addMagicTransitionResultAndRating(507, 75, 20.28, SKATER);
    addMagicTransitionResultAndRating(438, 75, 20.4, SKATER);
    addMagicTransitionResultAndRating(117, 75, 20.5, SKATER);
    addMagicTransitionResultAndRating(813, 75, 20.56, SKATER);
    addMagicTransitionResultAndRating(439, 75, 21.68, SKATER);
    addMagicTransitionResultAndRating(708, 75, 21.88, SKATER);
    addMagicTransitionResultAndRating(208, 75, 21.97, SKATER);
    addMagicTransitionResultAndRating(371, 75, 22.19, SKATER);
    addMagicTransitionResultAndRating(616, 75, 22.19, SKATER);
    addMagicTransitionResultAndRating(4, 75, 23.25, SKATER);
    addMagicTransitionResultAndRating(398, 75, 23.35, SKATER);
    addMagicTransitionResultAndRating(804, 75, 25.25, SKATER);
    addMagicTransitionResultAndRating(16, 74, 23, SKATER);
    addMagicTransitionResultAndRating(907, 74, 24.69, SKATER);
    addMagicTransitionResultAndRating(906, 73, 21, SKATER);
    addMagicTransitionResultAndRating(805, 73, 24.22, SKATER);
    addMagicTransitionResultAndRating(808, 73, 27.28, SKATER);
    addMagicTransitionResultAndRating(707, 72, 20.35, SKATER);
    addMagicTransitionResultAndRating(984, 72, 21.13, SKATER);
    addMagicTransitionResultAndRating(811, 72, 23.25, SKATER);
    addMagicTransitionResultAndRating(23, 72, 25.65, SKATER);
    addMagicTransitionResultAndRating(924, 70, 19.63, SKATER);
    addMagicTransitionResultAndRating(710, 70, 20.72, SKATER);
    addMagicTransitionResultAndRating(913, 70, 20.85, SKATER);
    addMagicTransitionResultAndRating(128, 70, 21.3, SKATER);
    addMagicTransitionResultAndRating(221, 70, 21.38, SKATER);
    addMagicTransitionResultAndRating(105, 70, 21.47, SKATER);
    addMagicTransitionResultAndRating(910, 70, 21.66, SKATER);
    addMagicTransitionResultAndRating(372, 70, 22.13, SKATER);
    addMagicTransitionResultAndRating(611, 70, 22.25, SKATER);
    addMagicTransitionResultAndRating(416, 70, 22.38, SKATER);
    addMagicTransitionResultAndRating(7, 70, 22.47, SKATER);
    addMagicTransitionResultAndRating(527, 70, 22.65, SKATER);
    addMagicTransitionResultAndRating(711, 70, 22.75, SKATER);
    addMagicTransitionResultAndRating(412, 70, 22.91, SKATER);
    addMagicTransitionResultAndRating(423, 70, 23.87, SKATER);
    addMagicTransitionResultAndRating(449, 70, 24.25, SKATER);
    addMagicTransitionResultAndRating(613, 70, 24.28, SKATER);
    addMagicTransitionResultAndRating(706, 70, 24.47, SKATER);
    addMagicTransitionResultAndRating(939, 70, 24.6, SKATER);
    addMagicTransitionResultAndRating(608, 70, 25.12, SKATER);
    addMagicTransitionResultAndRating(617, 70, 25.41, SKATER);
    addMagicTransitionResultAndRating(3, 70, 25.59, SKATER);
    addMagicTransitionResultAndRating(705, 70, 25.84, SKATER);
    addMagicTransitionResultAndRating(428, 70, 28.56, SKATER);
    addMagicTransitionResultAndRating(8, 69, 24.5, SKATER);
    addMagicTransitionResultAndRating(936, 68, 25, SKATER);
    addMagicTransitionResultAndRating(623, 68, 25.9, SKATER);
    addMagicTransitionResultAndRating(605, 68, 26.94, SKATER);
    addMagicTransitionResultAndRating(919, 68, 28.79, SKATER);
    addMagicTransitionResultAndRating(956, 67, 21.75, SKATER);
    addMagicTransitionResultAndRating(9, 67, 30, SKATER);
    addMagicTransitionResultAndRating(210, 65, 22.31, SKATER);
    addMagicTransitionResultAndRating(610, 65, 22.66, SKATER);
    addMagicTransitionResultAndRating(604, 65, 24.03, SKATER);
    addMagicTransitionResultAndRating(606, 65, 24.16, SKATER);
    addMagicTransitionResultAndRating(703, 65, 24.16, SKATER);
    addMagicTransitionResultAndRating(614, 65, 25.12, SKATER);
    addMagicTransitionResultAndRating(219, 65, 26.5, SKATER);
    addMagicTransitionResultAndRating(217, 65, 26.59, SKATER);
    addMagicTransitionResultAndRating(444, 65, 27, SKATER);
    addMagicTransitionResultAndRating(209, 65, 27.09, SKATER);
    addMagicTransitionResultAndRating(602, 65, 27.16, SKATER);
    addMagicTransitionResultAndRating(712, 65, 27.66, SKATER);
    addMagicTransitionResultAndRating(917, 65, 30, SKATER);
    addMagicTransitionResultAndRating(205, 60, 24.65, SKATER);
    addMagicTransitionResultAndRating(207, 60, 26.5, SKATER);
    addMagicTransitionResultAndRating(206, 60, 32.88, SKATER);

    addMagicTransitionResultAndRating(1, 88, 24.66, GOALTENDER);
    addMagicTransitionResultAndRating(815, 83, 27.59, GOALTENDER);
    addMagicTransitionResultAndRating(627, 83, 28.03, GOALTENDER);
    addMagicTransitionResultAndRating(225, 80, 25.7, GOALTENDER);
    addMagicTransitionResultAndRating(540, 80, 27.53, GOALTENDER);
    addMagicTransitionResultAndRating(430, 80, 27.75, GOALTENDER);
    addMagicTransitionResultAndRating(370, 80, 29.71, GOALTENDER);
    addMagicTransitionResultAndRating(130, 80, 31.12, GOALTENDER);
    addMagicTransitionResultAndRating(701, 78, 28.21, GOALTENDER);
    addMagicTransitionResultAndRating(901, 78, 28.87, GOALTENDER);
    addMagicTransitionResultAndRating(21, 78, 32.15, GOALTENDER);
    addMagicTransitionResultAndRating(501, 75, 29.28, GOALTENDER);
    addMagicTransitionResultAndRating(201, 75, 30.72, GOALTENDER);
    addMagicTransitionResultAndRating(355, 75, 31.25, GOALTENDER);
    addMagicTransitionResultAndRating(717, 75, 31.43, GOALTENDER);
    addMagicTransitionResultAndRating(629, 73, 38.47, GOALTENDER);
    addMagicTransitionResultAndRating(101, 70, 30.16, GOALTENDER);
    addMagicTransitionResultAndRating(450, 70, 35.82, GOALTENDER);
    addMagicTransitionResultAndRating(801, 70, 36.78, GOALTENDER);
  }

  // 397w -> 397
  // 397b -> 398
  public void addBestShotResults() {
    addBestShotResult(515, 9, SKATER);
    addBestShotResult(8, 9, SKATER);
    addBestShotResult(368, 6, SKATER);
    addBestShotResult(507, 6, SKATER);
    addBestShotResult(521, 6, SKATER);
    addBestShotResult(913, 6, SKATER);
    addBestShotResult(956, 6, SKATER);
    addBestShotResult(373, 5, SKATER);
    addBestShotResult(115, 4, SKATER);
    addBestShotResult(208, 4, SKATER);
    addBestShotResult(221, 4, SKATER);
    addBestShotResult(371, 4, SKATER);
    addBestShotResult(444, 4, SKATER);
    addBestShotResult(11, 4, SKATER);
    addBestShotResult(702, 4, SKATER);
    addBestShotResult(713, 4, SKATER);
    addBestShotResult(804, 4, SKATER);
    addBestShotResult(810, 4, SKATER);
    addBestShotResult(814, 4, SKATER);
    addBestShotResult(910, 4, SKATER);
    addBestShotResult(117, 3, SKATER);
    addBestShotResult(110, 3, SKATER);
    addBestShotResult(219, 3, SKATER);
    addBestShotResult(398, 3, SKATER);
    addBestShotResult(397, 3, SKATER);
    addBestShotResult(379, 3, SKATER);
    addBestShotResult(406, 3, SKATER);
    addBestShotResult(438, 3, SKATER);
    addBestShotResult(505, 3, SKATER);
    addBestShotResult(529, 3, SKATER);
    addBestShotResult(610, 3, SKATER);
    addBestShotResult(617, 3, SKATER);
    addBestShotResult(6, 3, SKATER);
    addBestShotResult(14, 3, SKATER);
    addBestShotResult(23, 3, SKATER);
    addBestShotResult(9, 3, SKATER);
    addBestShotResult(703, 3, SKATER);
    addBestShotResult(715, 3, SKATER);
    addBestShotResult(805, 3, SKATER);
    addBestShotResult(809, 3, SKATER);
    addBestShotResult(811, 3, SKATER);
    addBestShotResult(812, 3, SKATER);
    addBestShotResult(936, 3, SKATER);
    addBestShotResult(128, 2, SKATER);
    addBestShotResult(119, 2, SKATER);
    addBestShotResult(207, 2, SKATER);
    addBestShotResult(209, 2, SKATER);
    addBestShotResult(423, 2, SKATER);
    addBestShotResult(428, 2, SKATER);
    addBestShotResult(439, 2, SKATER);
    addBestShotResult(527, 2, SKATER);
    addBestShotResult(623, 2, SKATER);
    addBestShotResult(611, 2, SKATER);
    addBestShotResult(614, 2, SKATER);
    addBestShotResult(5, 2, SKATER);
    addBestShotResult(705, 2, SKATER);
    addBestShotResult(908, 2, SKATER);
    addBestShotResult(105, 1, SKATER);
    addBestShotResult(129, 1, SKATER);
    addBestShotResult(124, 1, SKATER);
    addBestShotResult(205, 1, SKATER);
    addBestShotResult(206, 1, SKATER);
    addBestShotResult(210, 1, SKATER);
    addBestShotResult(338, 1, SKATER);
    addBestShotResult(339, 1, SKATER);
    addBestShotResult(343, 1, SKATER);
    addBestShotResult(362, 1, SKATER);
    addBestShotResult(372, 1, SKATER);
    addBestShotResult(388, 1, SKATER);
    addBestShotResult(408, 1, SKATER);
    addBestShotResult(412, 1, SKATER);
    addBestShotResult(416, 1, SKATER);
    addBestShotResult(426, 1, SKATER);
    addBestShotResult(449, 1, SKATER);
    addBestShotResult(513, 1, SKATER);
    addBestShotResult(613, 1, SKATER);
    addBestShotResult(616, 1, SKATER);
    addBestShotResult(602, 1, SKATER);
    addBestShotResult(606, 1, SKATER);
    addBestShotResult(3, 1, SKATER);
    addBestShotResult(20, 1, SKATER);
    addBestShotResult(4, 1, SKATER);
    addBestShotResult(708, 1, SKATER);
    addBestShotResult(710, 1, SKATER);
    addBestShotResult(714, 1, SKATER);
    addBestShotResult(803, 1, SKATER);
    addBestShotResult(806, 1, SKATER);
    addBestShotResult(808, 1, SKATER);
    addBestShotResult(906, 1, SKATER);
    addBestShotResult(907, 1, SKATER);
    addBestShotResult(109, 0, SKATER);
    addBestShotResult(118, 0, SKATER);
    addBestShotResult(106, 0, SKATER);
    addBestShotResult(125, 0, SKATER);
    addBestShotResult(217, 0, SKATER);
    addBestShotResult(434, 0, SKATER);
    addBestShotResult(506, 0, SKATER);
    addBestShotResult(509, 0, SKATER);
    addBestShotResult(512, 0, SKATER);
    addBestShotResult(531, 0, SKATER);
    addBestShotResult(534, 0, SKATER);
    addBestShotResult(604, 0, SKATER);
    addBestShotResult(608, 0, SKATER);
    addBestShotResult(605, 0, SKATER);
    addBestShotResult(10, 0, SKATER);
    addBestShotResult(7, 0, SKATER);
    addBestShotResult(16, 0, SKATER);
    addBestShotResult(706, 0, SKATER);
    addBestShotResult(707, 0, SKATER);
    addBestShotResult(711, 0, SKATER);
    addBestShotResult(712, 0, SKATER);
    addBestShotResult(802, 0, SKATER);
    addBestShotResult(813, 0, SKATER);
    addBestShotResult(917, 0, SKATER);
    addBestShotResult(919, 0, SKATER);
    addBestShotResult(924, 0, SKATER);
    addBestShotResult(939, 0, SKATER);
    addBestShotResult(984, 0, SKATER);

    addBestShotResult(201, 4, GOALTENDER);
    addBestShotResult(355, 4, GOALTENDER);
    addBestShotResult(370, 4, GOALTENDER);
    addBestShotResult(430, 4, GOALTENDER);
    addBestShotResult(1, 4, GOALTENDER);
    addBestShotResult(801, 4, GOALTENDER);
    addBestShotResult(901, 4, GOALTENDER);
    addBestShotResult(225, 3, GOALTENDER);
    addBestShotResult(629, 3, GOALTENDER);
    addBestShotResult(627, 3, GOALTENDER);
    addBestShotResult(701, 3, GOALTENDER);
    addBestShotResult(450, 2, GOALTENDER);
    addBestShotResult(21, 2, GOALTENDER);
    addBestShotResult(815, 2, GOALTENDER);
    addBestShotResult(101, 1, GOALTENDER);
    addBestShotResult(130, 1, GOALTENDER);
    addBestShotResult(540, 1, GOALTENDER);
    addBestShotResult(717, 1, GOALTENDER);
    addBestShotResult(501, 0, GOALTENDER);
  }

  // 397w -> 397
  // 397b -> 398
  public void addPassAndGoResults() {
    addPassAndGoResult(338, 5, 22.78, SKATER);
    addPassAndGoResult(913, 5, 23.4, SKATER);
    addPassAndGoResult(714, 5, 24.03, SKATER);
    addPassAndGoResult(388, 5, 26.1, SKATER);
    addPassAndGoResult(707, 5, 26.18, SKATER);
    addPassAndGoResult(702, 5, 26.53, SKATER);
    addPassAndGoResult(8, 5, 27.22, SKATER);
    addPassAndGoResult(712, 5, 27.44, SKATER);
    addPassAndGoResult(814, 5, 28.66, SKATER);
    addPassAndGoResult(373, 4, 19.19, SKATER);
    addPassAndGoResult(11, 4, 23.22, SKATER);
    addPassAndGoResult(23, 4, 23.66, SKATER);
    addPassAndGoResult(416, 4, 23.72, SKATER);
    addPassAndGoResult(5, 4, 23.78, SKATER);
    addPassAndGoResult(812, 4, 23.9, SKATER);
    addPassAndGoResult(813, 4, 24.18, SKATER);
    addPassAndGoResult(117, 4, 24.41, SKATER);
    addPassAndGoResult(368, 4, 25.31, SKATER);
    addPassAndGoResult(339, 4, 25.35, SKATER);
    addPassAndGoResult(438, 4, 25.37, SKATER);
    addPassAndGoResult(515, 4, 25.78, SKATER);
    addPassAndGoResult(406, 4, 25.84, SKATER);
    addPassAndGoResult(208, 4, 27.07, SKATER);
    addPassAndGoResult(428, 4, 27.25, SKATER);
    addPassAndGoResult(109, 4, 27.35, SKATER);
    addPassAndGoResult(908, 4, 27.81, SKATER);
    addPassAndGoResult(513, 4, 29.32, SKATER);
    addPassAndGoResult(623, 4, 29.5, SKATER);
    addPassAndGoResult(608, 4, 29.59, SKATER);
    addPassAndGoResult(210, 3, 21.03, SKATER);
    addPassAndGoResult(343, 3, 21.06, SKATER);
    addPassAndGoResult(713, 3, 21.6, SKATER);
    addPassAndGoResult(506, 3, 21.78, SKATER);
    addPassAndGoResult(527, 3, 21.81, SKATER);
    addPassAndGoResult(6, 3, 22.88, SKATER);
    addPassAndGoResult(397, 3, 23, SKATER);
    addPassAndGoResult(115, 3, 23.09, SKATER);
    addPassAndGoResult(10, 3, 23.16, SKATER);
    addPassAndGoResult(521, 3, 23.44, SKATER);
    addPassAndGoResult(906, 3, 23.47, SKATER);
    addPassAndGoResult(505, 3, 23.5, SKATER);
    addPassAndGoResult(811, 3, 23.5, SKATER);
    addPassAndGoResult(439, 3, 23.66, SKATER);
    addPassAndGoResult(3, 3, 24.18, SKATER);
    addPassAndGoResult(110, 3, 24.41, SKATER);
    addPassAndGoResult(703, 3, 24.47, SKATER);
    addPassAndGoResult(531, 3, 24.56, SKATER);
    addPassAndGoResult(529, 3, 24.78, SKATER);
    addPassAndGoResult(809, 3, 24.84, SKATER);
    addPassAndGoResult(808, 3, 24.84, SKATER);
    addPassAndGoResult(802, 3, 24.87, SKATER);
    addPassAndGoResult(371, 3, 24.9, SKATER);
    addPassAndGoResult(408, 3, 24.91, SKATER);
    addPassAndGoResult(606, 3, 25.03, SKATER);
    addPassAndGoResult(509, 3, 25.09, SKATER);
    addPassAndGoResult(124, 3, 25.44, SKATER);
    addPassAndGoResult(917, 3, 26.37, SKATER);
    addPassAndGoResult(217, 3, 26.56, SKATER);
    addPassAndGoResult(805, 3, 27.31, SKATER);
    addPassAndGoResult(14, 3, 27.57, SKATER);
    addPassAndGoResult(613, 3, 28.03, SKATER);
    addPassAndGoResult(207, 3, 28.16, SKATER);
    addPassAndGoResult(534, 3, 28.19, SKATER);
    addPassAndGoResult(611, 3, 29.12, SKATER);
    addPassAndGoResult(205, 3, 29.25, SKATER);
    addPassAndGoResult(711, 3, 29.65, SKATER);
    addPassAndGoResult(924, 3, 29.66, SKATER);
    addPassAndGoResult(617, 3, 34.19, SKATER);
    addPassAndGoResult(507, 2, 18.87, SKATER);
    addPassAndGoResult(119, 2, 19.37, SKATER);
    addPassAndGoResult(512, 2, 21.78, SKATER);
    addPassAndGoResult(7, 2, 22.56, SKATER);
    addPassAndGoResult(128, 2, 23.28, SKATER);
    addPassAndGoResult(434, 2, 23.32, SKATER);
    addPassAndGoResult(710, 2, 23.44, SKATER);
    addPassAndGoResult(616, 2, 23.83, SKATER);
    addPassAndGoResult(106, 2, 23.88, SKATER);
    addPassAndGoResult(16, 2, 23.93, SKATER);
    addPassAndGoResult(398, 2, 23.94, SKATER);
    addPassAndGoResult(379, 2, 24.12, SKATER);
    addPassAndGoResult(412, 2, 24.12, SKATER);
    addPassAndGoResult(939, 2, 24.22, SKATER);
    addPassAndGoResult(810, 2, 24.94, SKATER);
    addPassAndGoResult(20, 2, 25.31, SKATER);
    addPassAndGoResult(705, 2, 25.62, SKATER);
    addPassAndGoResult(105, 2, 26.03, SKATER);
    addPassAndGoResult(984, 2, 26.65, SKATER);
    addPassAndGoResult(806, 2, 27.78, SKATER);
    addPassAndGoResult(129, 2, 28.13, SKATER);
    addPassAndGoResult(125, 2, 28.19, SKATER);
    addPassAndGoResult(602, 2, 29.04, SKATER);
    addPassAndGoResult(804, 2, 29.53, SKATER);
    addPassAndGoResult(708, 2, 29.94, SKATER);
    addPassAndGoResult(444, 2, 30.03, SKATER);
    addPassAndGoResult(604, 2, 30.06, SKATER);
    addPassAndGoResult(449, 2, 30.29, SKATER);
    addPassAndGoResult(936, 2, 32.57, SKATER);
    addPassAndGoResult(605, 2, 32.69, SKATER);
    addPassAndGoResult(803, 2, 33.35, SKATER);
    addPassAndGoResult(610, 2, 34.22, SKATER);
    addPassAndGoResult(206, 2, 34.5, SKATER);
    addPassAndGoResult(715, 1, 21.28, SKATER);
    addPassAndGoResult(956, 1, 21.53, SKATER);
    addPassAndGoResult(910, 1, 22.12, SKATER);
    addPassAndGoResult(118, 1, 22.5, SKATER);
    addPassAndGoResult(426, 1, 23.43, SKATER);
    addPassAndGoResult(362, 1, 23.5, SKATER);
    addPassAndGoResult(372, 1, 24.06, SKATER);
    addPassAndGoResult(423, 1, 24.16, SKATER);
    addPassAndGoResult(915, 1, 24.46, SKATER);
    addPassAndGoResult(907, 1, 25.38, SKATER);
    addPassAndGoResult(221, 1, 25.91, SKATER);
    addPassAndGoResult(209, 1, 26.09, SKATER);
    addPassAndGoResult(614, 1, 27, SKATER);
    addPassAndGoResult(4, 1, 30.07, SKATER);
    addPassAndGoResult(219, 1, 30.11, SKATER);
    addPassAndGoResult(706, 0, 27.43, SKATER);
    addPassAndGoResult(9, 0, 35.28, SKATER);

    addPassAndGoResult(629, 3, 38.68, GOALTENDER);
    addPassAndGoResult(130, 2, 27.56, GOALTENDER);
    addPassAndGoResult(815, 2, 28.73, GOALTENDER);
    addPassAndGoResult(901, 2, 28.87, GOALTENDER);
    addPassAndGoResult(627, 2, 31.1, GOALTENDER);
    addPassAndGoResult(21, 2, 33.79, GOALTENDER);
    addPassAndGoResult(450, 1, 25.81, GOALTENDER);
    addPassAndGoResult(540, 1, 26.66, GOALTENDER);
    addPassAndGoResult(701, 1, 31.46, GOALTENDER);
    addPassAndGoResult(355, 1, 32.68, GOALTENDER);
    addPassAndGoResult(201, 1, 32.97, GOALTENDER);
    addPassAndGoResult(225, 1, 33.41, GOALTENDER);
    addPassAndGoResult(501, 1, 36.69, GOALTENDER);
    addPassAndGoResult(101, 0, 26.03, GOALTENDER);
    addPassAndGoResult(370, 0, 26.35, GOALTENDER);
    addPassAndGoResult(717, 0, 27.46, GOALTENDER);
    addPassAndGoResult(1, 0, 28.09, GOALTENDER);
    addPassAndGoResult(801, 0, 29.15, GOALTENDER);
    addPassAndGoResult(430, 0, 30.16, GOALTENDER);
  }

  // 397w -> 397
  // 397b -> 398
  public void addControlledJumbleResultsAndRatings() {
    addControlledJumblePlayerResult(20, 15.67);
    addControlledJumblePlayerResult(6, 16.81);
    addControlledJumblePlayerResult(343, 17.03);
    addControlledJumblePlayerResult(210, 17.4);
    addControlledJumblePlayerResult(379, 17.46);
    addControlledJumblePlayerResult(119, 17.63);
    addControlledJumblePlayerResult(507, 17.75);
    addControlledJumblePlayerResult(506, 17.81);
    addControlledJumblePlayerResult(373, 17.9);
    addControlledJumblePlayerResult(434, 17.91);
    addControlledJumblePlayerResult(10, 18);
    addControlledJumblePlayerResult(388, 18.13);
    addControlledJumblePlayerResult(128, 18.22);
    addControlledJumblePlayerResult(217, 18.28);
    addControlledJumblePlayerResult(11, 18.28);
    addControlledJumblePlayerResult(810, 18.37);
    addControlledJumblePlayerResult(908, 18.38);
    addControlledJumblePlayerResult(913, 18.38);
    addControlledJumblePlayerResult(813, 18.47);
    addControlledJumblePlayerResult(372, 18.59);
    addControlledJumblePlayerResult(534, 18.63);
    addControlledJumblePlayerResult(208, 18.65);
    addControlledJumblePlayerResult(110, 18.66);
    addControlledJumblePlayerResult(531, 18.69);
    addControlledJumblePlayerResult(408, 18.75);
    addControlledJumblePlayerResult(106, 18.84);
    addControlledJumblePlayerResult(505, 18.84);
    addControlledJumblePlayerResult(529, 18.88);
    addControlledJumblePlayerResult(702, 18.9);
    addControlledJumblePlayerResult(714, 18.9);
    addControlledJumblePlayerResult(512, 18.94);
    addControlledJumblePlayerResult(368, 19.1);
    addControlledJumblePlayerResult(521, 19.12);
    addControlledJumblePlayerResult(715, 19.19);
    addControlledJumblePlayerResult(4, 19.34);
    addControlledJumblePlayerResult(509, 19.4);
    addControlledJumblePlayerResult(109, 19.47);
    addControlledJumblePlayerResult(802, 19.53);
    addControlledJumblePlayerResult(439, 19.59);
    addControlledJumblePlayerResult(809, 19.62);
    addControlledJumblePlayerResult(338, 19.66);
    addControlledJumblePlayerResult(423, 19.84);
    addControlledJumblePlayerResult(623, 19.97);
    addControlledJumblePlayerResult(416, 20);
    addControlledJumblePlayerResult(812, 20);
    addControlledJumblePlayerResult(3, 20.07);
    addControlledJumblePlayerResult(129, 20.28);
    addControlledJumblePlayerResult(608, 20.34);
    addControlledJumblePlayerResult(613, 20.35);
    addControlledJumblePlayerResult(811, 20.41);
    addControlledJumblePlayerResult(706, 20.44);
    addControlledJumblePlayerResult(16, 20.47);
    addControlledJumblePlayerResult(117, 20.5);
    addControlledJumblePlayerResult(205, 20.53);
    addControlledJumblePlayerResult(426, 20.56);
    addControlledJumblePlayerResult(206, 20.59);
    addControlledJumblePlayerResult(371, 20.65);
    addControlledJumblePlayerResult(611, 20.68);
    addControlledJumblePlayerResult(5, 20.69);
    addControlledJumblePlayerResult(406, 20.81);
    addControlledJumblePlayerResult(814, 20.84);
    addControlledJumblePlayerResult(8, 20.85);
    addControlledJumblePlayerResult(919, 20.87);
    addControlledJumblePlayerResult(907, 20.91);
    addControlledJumblePlayerResult(124, 21.04);
    addControlledJumblePlayerResult(910, 21.04);
    addControlledJumblePlayerResult(7, 21.06);
    addControlledJumblePlayerResult(610, 21.13);
    addControlledJumblePlayerResult(712, 21.15);
    addControlledJumblePlayerResult(339, 21.25);
    addControlledJumblePlayerResult(428, 21.25);
    addControlledJumblePlayerResult(513, 21.25);
    addControlledJumblePlayerResult(984, 21.28);
    addControlledJumblePlayerResult(125, 21.35);
    addControlledJumblePlayerResult(209, 21.41);
    addControlledJumblePlayerResult(221, 21.5);
    addControlledJumblePlayerResult(806, 21.53);
    addControlledJumblePlayerResult(616, 21.53);
    addControlledJumblePlayerResult(906, 21.56);
    addControlledJumblePlayerResult(397, 21.68);
    addControlledJumblePlayerResult(956, 21.78);
    addControlledJumblePlayerResult(936, 21.79);
    addControlledJumblePlayerResult(606, 21.88);
    addControlledJumblePlayerResult(924, 21.91);
    addControlledJumblePlayerResult(118, 21.97);
    addControlledJumblePlayerResult(207, 22);
    addControlledJumblePlayerResult(398, 22);
    addControlledJumblePlayerResult(515, 22);
    addControlledJumblePlayerResult(614, 22.04);
    addControlledJumblePlayerResult(602, 22.12);
    addControlledJumblePlayerResult(805, 22.22);
    addControlledJumblePlayerResult(444, 22.31);
    addControlledJumblePlayerResult(362, 22.62);
    addControlledJumblePlayerResult(449, 22.65);
    addControlledJumblePlayerResult(803, 22.69);
    addControlledJumblePlayerResult(710, 22.69);
    addControlledJumblePlayerResult(23, 22.75);
    addControlledJumblePlayerResult(804, 22.78);
    addControlledJumblePlayerResult(917, 23.06);
    addControlledJumblePlayerResult(115, 23.1);
    addControlledJumblePlayerResult(617, 23.15);
    addControlledJumblePlayerResult(9, 23.18);
    addControlledJumblePlayerResult(105, 23.19);
    addControlledJumblePlayerResult(527, 23.38);
    addControlledJumblePlayerResult(711, 23.4);
    addControlledJumblePlayerResult(708, 23.55);
    addControlledJumblePlayerResult(703, 23.59);
    addControlledJumblePlayerResult(605, 23.66);
    addControlledJumblePlayerResult(604, 23.75);
    addControlledJumblePlayerResult(705, 23.75);
    addControlledJumblePlayerResult(438, 23.96);
    addControlledJumblePlayerResult(707, 24.06);
    addControlledJumblePlayerResult(14, 24.1);
    addControlledJumblePlayerResult(412, 25.37);
    addControlledJumblePlayerResult(219, 26.25);
    addControlledJumblePlayerResult(713, 26.37);
    addControlledJumblePlayerResult(939, 27.06);
    addControlledJumblePlayerResult(808, 27.31);

    addControlledJumbleGoaltenderRating(1, 88.85);
    addControlledJumbleGoaltenderRating(101, 88);
    addControlledJumbleGoaltenderRating(627, 87);
    addControlledJumbleGoaltenderRating(501, 83.85);
    addControlledJumbleGoaltenderRating(450, 83.7);
    addControlledJumbleGoaltenderRating(540, 83.45);
    addControlledJumbleGoaltenderRating(130, 83);
    addControlledJumbleGoaltenderRating(430, 82.65);
    addControlledJumbleGoaltenderRating(901, 82.25);
    addControlledJumbleGoaltenderRating(717, 82);
    addControlledJumbleGoaltenderRating(355, 81.1);
    addControlledJumbleGoaltenderRating(701, 81);
    addControlledJumbleGoaltenderRating(629, 80.5);
    addControlledJumbleGoaltenderRating(370, 79.5);
    addControlledJumbleGoaltenderRating(201, 79.15);
    addControlledJumbleGoaltenderRating(815, 75.15);
    addControlledJumbleGoaltenderRating(225, 74.7);
    addControlledJumbleGoaltenderRating(801, 74.35);
    addControlledJumbleGoaltenderRating(21, 72.45);
  }

  // 397w -> 397
  // 397b -> 398
  public void addHitTheRoadResultsAndRatings() {
    addHitTheRoadPlayerResultAndRating(338, 90, 1.86);
    addHitTheRoadPlayerResultAndRating(529, 87, 1.94);
    addHitTheRoadPlayerResultAndRating(512, 85, 1.86);
    addHitTheRoadPlayerResultAndRating(426, 85, 1.88);
    addHitTheRoadPlayerResultAndRating(343, 85, 1.9);
    addHitTheRoadPlayerResultAndRating(339, 85, 1.97);
    addHitTheRoadPlayerResultAndRating(810, 85, 1.97);
    addHitTheRoadPlayerResultAndRating(702, 85, 1.98);
    addHitTheRoadPlayerResultAndRating(106, 85, 2);
    addHitTheRoadPlayerResultAndRating(449, 85, 2.07);
    addHitTheRoadPlayerResultAndRating(715, 83, 1.88);
    addHitTheRoadPlayerResultAndRating(119, 80, 1.92);
    addHitTheRoadPlayerResultAndRating(507, 80, 1.93);
    addHitTheRoadPlayerResultAndRating(6, 80, 1.93);
    addHitTheRoadPlayerResultAndRating(379, 80, 1.97);
    addHitTheRoadPlayerResultAndRating(11, 80, 1.98);
    addHitTheRoadPlayerResultAndRating(802, 80, 2);
    addHitTheRoadPlayerResultAndRating(129, 80, 2.01);
    addHitTheRoadPlayerResultAndRating(509, 80, 2.01);
    addHitTheRoadPlayerResultAndRating(115, 80, 2.02);
    addHitTheRoadPlayerResultAndRating(814, 80, 2.02);
    addHitTheRoadPlayerResultAndRating(110, 80, 2.03);
    addHitTheRoadPlayerResultAndRating(397, 80, 2.03);
    addHitTheRoadPlayerResultAndRating(908, 80, 2.03);
    addHitTheRoadPlayerResultAndRating(373, 80, 2.07);
    addHitTheRoadPlayerResultAndRating(812, 80, 2.09);
    addHitTheRoadPlayerResultAndRating(984, 80, 2.09);
    addHitTheRoadPlayerResultAndRating(438, 80, 2.1);
    addHitTheRoadPlayerResultAndRating(439, 80, 2.1);
    addHitTheRoadPlayerResultAndRating(531, 80, 2.1);
    addHitTheRoadPlayerResultAndRating(939, 80, 2.1);
    addHitTheRoadPlayerResultAndRating(513, 80, 2.11);
    addHitTheRoadPlayerResultAndRating(617, 80, 2.12);
    addHitTheRoadPlayerResultAndRating(714, 80, 2.12);
    addHitTheRoadPlayerResultAndRating(608, 80, 2.14);
    addHitTheRoadPlayerResultAndRating(208, 80, 2.15);
    addHitTheRoadPlayerResultAndRating(362, 80, 2.15);
    addHitTheRoadPlayerResultAndRating(434, 80, 2.16);
    addHitTheRoadPlayerResultAndRating(505, 80, 2.16);
    addHitTheRoadPlayerResultAndRating(7, 80, 2.16);
    addHitTheRoadPlayerResultAndRating(408, 80, 2.18);
    addHitTheRoadPlayerResultAndRating(813, 80, 2.22);
    addHitTheRoadPlayerResultAndRating(613, 80, 2.25);
    addHitTheRoadPlayerResultAndRating(210, 80, 2.29);
    addHitTheRoadPlayerResultAndRating(805, 80, 2.31);
    addHitTheRoadPlayerResultAndRating(713, 79, 1.99);
    addHitTheRoadPlayerResultAndRating(14, 78, 1.98);
    addHitTheRoadPlayerResultAndRating(534, 78, 1.99);
    addHitTheRoadPlayerResultAndRating(521, 78, 2.1);
    addHitTheRoadPlayerResultAndRating(371, 75, 1.91);
    addHitTheRoadPlayerResultAndRating(388, 75, 1.93);
    addHitTheRoadPlayerResultAndRating(506, 75, 1.95);
    addHitTheRoadPlayerResultAndRating(109, 75, 1.97);
    addHitTheRoadPlayerResultAndRating(806, 75, 1.98);
    addHitTheRoadPlayerResultAndRating(705, 75, 2.02);
    addHitTheRoadPlayerResultAndRating(706, 75, 2.03);
    addHitTheRoadPlayerResultAndRating(124, 75, 2.04);
    addHitTheRoadPlayerResultAndRating(910, 75, 2.05);
    addHitTheRoadPlayerResultAndRating(515, 75, 2.06);
    addHitTheRoadPlayerResultAndRating(913, 75, 2.06);
    addHitTheRoadPlayerResultAndRating(117, 75, 2.08);
    addHitTheRoadPlayerResultAndRating(125, 75, 2.08);
    addHitTheRoadPlayerResultAndRating(906, 75, 2.08);
    addHitTheRoadPlayerResultAndRating(217, 75, 2.1);
    addHitTheRoadPlayerResultAndRating(406, 75, 2.1);
    addHitTheRoadPlayerResultAndRating(703, 75, 2.12);
    addHitTheRoadPlayerResultAndRating(711, 75, 2.12);
    addHitTheRoadPlayerResultAndRating(423, 75, 2.13);
    addHitTheRoadPlayerResultAndRating(4, 75, 2.13);
    addHitTheRoadPlayerResultAndRating(5, 75, 2.14);
    addHitTheRoadPlayerResultAndRating(919, 75, 2.15);
    addHitTheRoadPlayerResultAndRating(614, 75, 2.16);
    addHitTheRoadPlayerResultAndRating(605, 75, 2.16);
    addHitTheRoadPlayerResultAndRating(16, 75, 2.16);
    addHitTheRoadPlayerResultAndRating(610, 75, 2.17);
    addHitTheRoadPlayerResultAndRating(221, 75, 2.18);
    addHitTheRoadPlayerResultAndRating(128, 75, 2.19);
    addHitTheRoadPlayerResultAndRating(611, 75, 2.2);
    addHitTheRoadPlayerResultAndRating(8, 75, 2.2);
    addHitTheRoadPlayerResultAndRating(808, 75, 2.21);
    addHitTheRoadPlayerResultAndRating(368, 75, 2.22);
    addHitTheRoadPlayerResultAndRating(616, 75, 2.22);
    addHitTheRoadPlayerResultAndRating(924, 75, 2.23);
    addHitTheRoadPlayerResultAndRating(712, 75, 2.25);
    addHitTheRoadPlayerResultAndRating(936, 75, 2.25);
    addHitTheRoadPlayerResultAndRating(10, 75, 2.25);
    addHitTheRoadPlayerResultAndRating(623, 75, 2.28);
    addHitTheRoadPlayerResultAndRating(219, 75, 2.29);
    addHitTheRoadPlayerResultAndRating(444, 75, 2.33);
    addHitTheRoadPlayerResultAndRating(606, 75, 2.33);
    addHitTheRoadPlayerResultAndRating(428, 75, 2.39);
    addHitTheRoadPlayerResultAndRating(527, 74, 2.12);
    addHitTheRoadPlayerResultAndRating(20, 73, 2.02);
    addHitTheRoadPlayerResultAndRating(710, 73, 2.13);
    addHitTheRoadPlayerResultAndRating(3, 73, 2.19);
    addHitTheRoadPlayerResultAndRating(23, 73, 2.26);
    addHitTheRoadPlayerResultAndRating(105, 70, 1.95);
    addHitTheRoadPlayerResultAndRating(708, 70, 1.98);
    addHitTheRoadPlayerResultAndRating(398, 70, 2.07);
    addHitTheRoadPlayerResultAndRating(118, 70, 2.11);
    addHitTheRoadPlayerResultAndRating(372, 70, 2.11);
    addHitTheRoadPlayerResultAndRating(917, 70, 2.11);
    addHitTheRoadPlayerResultAndRating(809, 70, 2.15);
    addHitTheRoadPlayerResultAndRating(907, 70, 2.15);
    addHitTheRoadPlayerResultAndRating(707, 70, 2.19);
    addHitTheRoadPlayerResultAndRating(956, 70, 2.21);
    addHitTheRoadPlayerResultAndRating(205, 70, 2.22);
    addHitTheRoadPlayerResultAndRating(9, 70, 2.26);
    addHitTheRoadPlayerResultAndRating(206, 70, 2.28);
    addHitTheRoadPlayerResultAndRating(412, 70, 2.29);
    addHitTheRoadPlayerResultAndRating(811, 70, 2.31);
    addHitTheRoadPlayerResultAndRating(803, 70, 2.34);
    addHitTheRoadPlayerResultAndRating(416, 70, 2.36);
    addHitTheRoadPlayerResultAndRating(602, 70, 2.36);
    addHitTheRoadPlayerResultAndRating(804, 70, 2.37);
    addHitTheRoadPlayerResultAndRating(209, 70, 2.44);
    addHitTheRoadPlayerResultAndRating(604, 70, 2.48);
    addHitTheRoadPlayerResultAndRating(207, 65, 2.41);

    addHitTheRoadGoaltenderRating(627, 91.15);
    addHitTheRoadGoaltenderRating(1, 88.35);
    addHitTheRoadGoaltenderRating(130, 86);
    addHitTheRoadGoaltenderRating(815, 85.85);
    addHitTheRoadGoaltenderRating(540, 85.5);
    addHitTheRoadGoaltenderRating(501, 85.35);
    addHitTheRoadGoaltenderRating(701, 85.35);
    addHitTheRoadGoaltenderRating(101, 85.25);
    addHitTheRoadGoaltenderRating(370, 84.5);
    addHitTheRoadGoaltenderRating(355, 83);
    addHitTheRoadGoaltenderRating(201, 82.5);
    addHitTheRoadGoaltenderRating(717, 82.35);
    addHitTheRoadGoaltenderRating(450, 82.15);
    addHitTheRoadGoaltenderRating(901, 82);
    addHitTheRoadGoaltenderRating(430, 80.35);
    addHitTheRoadGoaltenderRating(21, 78.65);
    addHitTheRoadGoaltenderRating(225, 78);
    addHitTheRoadGoaltenderRating(629, 78);
    addHitTheRoadGoaltenderRating(801, 77.35);
  }

}
