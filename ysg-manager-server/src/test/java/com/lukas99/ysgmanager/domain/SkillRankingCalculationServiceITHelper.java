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

  private void addMagicTransitionResultAndRating(PlayerPosition position, int playerNumber,
      int score, double time) {
    Player player = getOrCreatePlayer(playerNumber, position);
    skillResults.add(SkillResult.builder().player(player).skill(magicTransitions)
        .time(new BigDecimal(time)).build());
    skillRatings.add(SkillRating.builder().player(player).skill(magicTransitions)
        .score(new BigDecimal(score)).build());
  }

  private void addBestShotResult(PlayerPosition position, int playerNumber, int points) {
    Player player = getOrCreatePlayer(playerNumber, position);
    skillResults.add(SkillResult.builder().player(player).skill(bestShot)
        .points(points).build());
  }

  private void addPassAndGoResult(PlayerPosition position, int playerNumber, int points,
      double time) {
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
    addMagicTransitionResultAndRating(SKATER, 338, 90, 17.81);
    addMagicTransitionResultAndRating(SKATER, 373, 85, 17.8);
    addMagicTransitionResultAndRating(SKATER, 715, 85, 18.35);
    addMagicTransitionResultAndRating(SKATER, 343, 85, 19.44);
    addMagicTransitionResultAndRating(SKATER, 119, 85, 19.5);
    addMagicTransitionResultAndRating(SKATER, 397, 85, 21.06);
    addMagicTransitionResultAndRating(SKATER, 6, 83, 18.16);
    addMagicTransitionResultAndRating(SKATER, 802, 83, 20.18);
    addMagicTransitionResultAndRating(SKATER, 810, 82, 18.75);
    addMagicTransitionResultAndRating(SKATER, 118, 80, 16.2);
    addMagicTransitionResultAndRating(SKATER, 379, 80, 18);
    addMagicTransitionResultAndRating(SKATER, 714, 80, 18.22);
    addMagicTransitionResultAndRating(SKATER, 534, 80, 18.53);
    addMagicTransitionResultAndRating(SKATER, 125, 80, 18.59);
    addMagicTransitionResultAndRating(SKATER, 129, 80, 18.6);
    addMagicTransitionResultAndRating(SKATER, 110, 80, 18.72);
    addMagicTransitionResultAndRating(SKATER, 509, 80, 18.84);
    addMagicTransitionResultAndRating(SKATER, 512, 80, 19);
    addMagicTransitionResultAndRating(SKATER, 115, 80, 19.05);
    addMagicTransitionResultAndRating(SKATER, 20, 80, 19.07);
    addMagicTransitionResultAndRating(SKATER, 505, 80, 19.31);
    addMagicTransitionResultAndRating(SKATER, 713, 80, 19.4);
    addMagicTransitionResultAndRating(SKATER, 434, 80, 20);
    addMagicTransitionResultAndRating(SKATER, 109, 80, 20.03);
    addMagicTransitionResultAndRating(SKATER, 809, 80, 20.75);
    addMagicTransitionResultAndRating(SKATER, 388, 80, 21.04);
    addMagicTransitionResultAndRating(SKATER, 814, 80, 21.15);
    addMagicTransitionResultAndRating(SKATER, 531, 80, 21.94);
    addMagicTransitionResultAndRating(SKATER, 408, 80, 22.64);
    addMagicTransitionResultAndRating(SKATER, 124, 80, 23.1);
    addMagicTransitionResultAndRating(SKATER, 702, 80, 24.97);
    addMagicTransitionResultAndRating(SKATER, 106, 80, 26.88);
    addMagicTransitionResultAndRating(SKATER, 812, 78, 19.75);
    addMagicTransitionResultAndRating(SKATER, 10, 78, 20.91);
    addMagicTransitionResultAndRating(SKATER, 14, 78, 21.85);
    addMagicTransitionResultAndRating(SKATER, 806, 77, 20.13);
    addMagicTransitionResultAndRating(SKATER, 5, 77, 22.35);
    addMagicTransitionResultAndRating(SKATER, 803, 77, 27.53);
    addMagicTransitionResultAndRating(SKATER, 11, 76, 18.85);
    addMagicTransitionResultAndRating(SKATER, 339, 75, 17.91);
    addMagicTransitionResultAndRating(SKATER, 362, 75, 18.34);
    addMagicTransitionResultAndRating(SKATER, 529, 75, 18.56);
    addMagicTransitionResultAndRating(SKATER, 521, 75, 18.68);
    addMagicTransitionResultAndRating(SKATER, 506, 75, 18.72);
    addMagicTransitionResultAndRating(SKATER, 426, 75, 19.05);
    addMagicTransitionResultAndRating(SKATER, 406, 75, 19.32);
    addMagicTransitionResultAndRating(SKATER, 368, 75, 19.56);
    addMagicTransitionResultAndRating(SKATER, 908, 75, 19.72);
    addMagicTransitionResultAndRating(SKATER, 513, 75, 19.75);
    addMagicTransitionResultAndRating(SKATER, 515, 75, 20.21);
    addMagicTransitionResultAndRating(SKATER, 507, 75, 20.28);
    addMagicTransitionResultAndRating(SKATER, 438, 75, 20.4);
    addMagicTransitionResultAndRating(SKATER, 117, 75, 20.5);
    addMagicTransitionResultAndRating(SKATER, 813, 75, 20.56);
    addMagicTransitionResultAndRating(SKATER, 439, 75, 21.68);
    addMagicTransitionResultAndRating(SKATER, 708, 75, 21.88);
    addMagicTransitionResultAndRating(SKATER, 208, 75, 21.97);
    addMagicTransitionResultAndRating(SKATER, 371, 75, 22.19);
    addMagicTransitionResultAndRating(SKATER, 616, 75, 22.19);
    addMagicTransitionResultAndRating(SKATER, 4, 75, 23.25);
    addMagicTransitionResultAndRating(SKATER, 398, 75, 23.35);
    addMagicTransitionResultAndRating(SKATER, 804, 75, 25.25);
    addMagicTransitionResultAndRating(SKATER, 16, 74, 23);
    addMagicTransitionResultAndRating(SKATER, 907, 74, 24.69);
    addMagicTransitionResultAndRating(SKATER, 906, 73, 21);
    addMagicTransitionResultAndRating(SKATER, 805, 73, 24.22);
    addMagicTransitionResultAndRating(SKATER, 808, 73, 27.28);
    addMagicTransitionResultAndRating(SKATER, 707, 72, 20.35);
    addMagicTransitionResultAndRating(SKATER, 984, 72, 21.13);
    addMagicTransitionResultAndRating(SKATER, 811, 72, 23.25);
    addMagicTransitionResultAndRating(SKATER, 23, 72, 25.65);
    addMagicTransitionResultAndRating(SKATER, 924, 70, 19.63);
    addMagicTransitionResultAndRating(SKATER, 710, 70, 20.72);
    addMagicTransitionResultAndRating(SKATER, 913, 70, 20.85);
    addMagicTransitionResultAndRating(SKATER, 128, 70, 21.3);
    addMagicTransitionResultAndRating(SKATER, 221, 70, 21.38);
    addMagicTransitionResultAndRating(SKATER, 105, 70, 21.47);
    addMagicTransitionResultAndRating(SKATER, 910, 70, 21.66);
    addMagicTransitionResultAndRating(SKATER, 372, 70, 22.13);
    addMagicTransitionResultAndRating(SKATER, 611, 70, 22.25);
    addMagicTransitionResultAndRating(SKATER, 416, 70, 22.38);
    addMagicTransitionResultAndRating(SKATER, 7, 70, 22.47);
    addMagicTransitionResultAndRating(SKATER, 527, 70, 22.65);
    addMagicTransitionResultAndRating(SKATER, 711, 70, 22.75);
    addMagicTransitionResultAndRating(SKATER, 412, 70, 22.91);
    addMagicTransitionResultAndRating(SKATER, 423, 70, 23.87);
    addMagicTransitionResultAndRating(SKATER, 449, 70, 24.25);
    addMagicTransitionResultAndRating(SKATER, 613, 70, 24.28);
    addMagicTransitionResultAndRating(SKATER, 706, 70, 24.47);
    addMagicTransitionResultAndRating(SKATER, 939, 70, 24.6);
    addMagicTransitionResultAndRating(SKATER, 608, 70, 25.12);
    addMagicTransitionResultAndRating(SKATER, 617, 70, 25.41);
    addMagicTransitionResultAndRating(SKATER, 3, 70, 25.59);
    addMagicTransitionResultAndRating(SKATER, 705, 70, 25.84);
    addMagicTransitionResultAndRating(SKATER, 428, 70, 28.56);
    addMagicTransitionResultAndRating(SKATER, 8, 69, 24.5);
    addMagicTransitionResultAndRating(SKATER, 936, 68, 25);
    addMagicTransitionResultAndRating(SKATER, 623, 68, 25.9);
    addMagicTransitionResultAndRating(SKATER, 605, 68, 26.94);
    addMagicTransitionResultAndRating(SKATER, 919, 68, 28.79);
    addMagicTransitionResultAndRating(SKATER, 956, 67, 21.75);
    addMagicTransitionResultAndRating(SKATER, 9, 67, 30);
    addMagicTransitionResultAndRating(SKATER, 210, 65, 22.31);
    addMagicTransitionResultAndRating(SKATER, 610, 65, 22.66);
    addMagicTransitionResultAndRating(SKATER, 604, 65, 24.03);
    addMagicTransitionResultAndRating(SKATER, 606, 65, 24.16);
    addMagicTransitionResultAndRating(SKATER, 703, 65, 24.16);
    addMagicTransitionResultAndRating(SKATER, 614, 65, 25.12);
    addMagicTransitionResultAndRating(SKATER, 219, 65, 26.5);
    addMagicTransitionResultAndRating(SKATER, 217, 65, 26.59);
    addMagicTransitionResultAndRating(SKATER, 444, 65, 27);
    addMagicTransitionResultAndRating(SKATER, 209, 65, 27.09);
    addMagicTransitionResultAndRating(SKATER, 602, 65, 27.16);
    addMagicTransitionResultAndRating(SKATER, 712, 65, 27.66);
    addMagicTransitionResultAndRating(SKATER, 917, 65, 30);
    addMagicTransitionResultAndRating(SKATER, 205, 60, 24.65);
    addMagicTransitionResultAndRating(SKATER, 207, 60, 26.5);
    addMagicTransitionResultAndRating(SKATER, 206, 60, 32.88);

    addMagicTransitionResultAndRating(GOALTENDER, 1, 88, 24.66);
    addMagicTransitionResultAndRating(GOALTENDER, 815, 83, 27.59);
    addMagicTransitionResultAndRating(GOALTENDER, 627, 83, 28.03);
    addMagicTransitionResultAndRating(GOALTENDER, 225, 80, 25.7);
    addMagicTransitionResultAndRating(GOALTENDER, 540, 80, 27.53);
    addMagicTransitionResultAndRating(GOALTENDER, 430, 80, 27.75);
    addMagicTransitionResultAndRating(GOALTENDER, 370, 80, 29.71);
    addMagicTransitionResultAndRating(GOALTENDER, 130, 80, 31.12);
    addMagicTransitionResultAndRating(GOALTENDER, 701, 78, 28.21);
    addMagicTransitionResultAndRating(GOALTENDER, 901, 78, 28.87);
    addMagicTransitionResultAndRating(GOALTENDER, 21, 78, 32.15);
    addMagicTransitionResultAndRating(GOALTENDER, 501, 75, 29.28);
    addMagicTransitionResultAndRating(GOALTENDER, 201, 75, 30.72);
    addMagicTransitionResultAndRating(GOALTENDER, 355, 75, 31.25);
    addMagicTransitionResultAndRating(GOALTENDER, 717, 75, 31.43);
    addMagicTransitionResultAndRating(GOALTENDER, 629, 73, 38.47);
    addMagicTransitionResultAndRating(GOALTENDER, 101, 70, 30.16);
    addMagicTransitionResultAndRating(GOALTENDER, 450, 70, 35.82);
    addMagicTransitionResultAndRating(GOALTENDER, 801, 70, 36.78);
  }

  // 397w -> 397
  // 397b -> 398
  public void addBestShotResults() {
    addBestShotResult(SKATER, 515, 9);
    addBestShotResult(SKATER, 8, 9);
    addBestShotResult(SKATER, 368, 6);
    addBestShotResult(SKATER, 507, 6);
    addBestShotResult(SKATER, 521, 6);
    addBestShotResult(SKATER, 913, 6);
    addBestShotResult(SKATER, 956, 6);
    addBestShotResult(SKATER, 373, 5);
    addBestShotResult(SKATER, 115, 4);
    addBestShotResult(SKATER, 208, 4);
    addBestShotResult(SKATER, 221, 4);
    addBestShotResult(SKATER, 371, 4);
    addBestShotResult(SKATER, 444, 4);
    addBestShotResult(SKATER, 11, 4);
    addBestShotResult(SKATER, 702, 4);
    addBestShotResult(SKATER, 713, 4);
    addBestShotResult(SKATER, 804, 4);
    addBestShotResult(SKATER, 810, 4);
    addBestShotResult(SKATER, 814, 4);
    addBestShotResult(SKATER, 910, 4);
    addBestShotResult(SKATER, 117, 3);
    addBestShotResult(SKATER, 110, 3);
    addBestShotResult(SKATER, 219, 3);
    addBestShotResult(SKATER, 398, 3);
    addBestShotResult(SKATER, 397, 3);
    addBestShotResult(SKATER, 379, 3);
    addBestShotResult(SKATER, 406, 3);
    addBestShotResult(SKATER, 438, 3);
    addBestShotResult(SKATER, 505, 3);
    addBestShotResult(SKATER, 529, 3);
    addBestShotResult(SKATER, 610, 3);
    addBestShotResult(SKATER, 617, 3);
    addBestShotResult(SKATER, 6, 3);
    addBestShotResult(SKATER, 14, 3);
    addBestShotResult(SKATER, 23, 3);
    addBestShotResult(SKATER, 9, 3);
    addBestShotResult(SKATER, 703, 3);
    addBestShotResult(SKATER, 715, 3);
    addBestShotResult(SKATER, 805, 3);
    addBestShotResult(SKATER, 809, 3);
    addBestShotResult(SKATER, 811, 3);
    addBestShotResult(SKATER, 812, 3);
    addBestShotResult(SKATER, 936, 3);
    addBestShotResult(SKATER, 128, 2);
    addBestShotResult(SKATER, 119, 2);
    addBestShotResult(SKATER, 207, 2);
    addBestShotResult(SKATER, 209, 2);
    addBestShotResult(SKATER, 423, 2);
    addBestShotResult(SKATER, 428, 2);
    addBestShotResult(SKATER, 439, 2);
    addBestShotResult(SKATER, 527, 2);
    addBestShotResult(SKATER, 623, 2);
    addBestShotResult(SKATER, 611, 2);
    addBestShotResult(SKATER, 614, 2);
    addBestShotResult(SKATER, 5, 2);
    addBestShotResult(SKATER, 705, 2);
    addBestShotResult(SKATER, 908, 2);
    addBestShotResult(SKATER, 105, 1);
    addBestShotResult(SKATER, 129, 1);
    addBestShotResult(SKATER, 124, 1);
    addBestShotResult(SKATER, 205, 1);
    addBestShotResult(SKATER, 206, 1);
    addBestShotResult(SKATER, 210, 1);
    addBestShotResult(SKATER, 338, 1);
    addBestShotResult(SKATER, 339, 1);
    addBestShotResult(SKATER, 343, 1);
    addBestShotResult(SKATER, 362, 1);
    addBestShotResult(SKATER, 372, 1);
    addBestShotResult(SKATER, 388, 1);
    addBestShotResult(SKATER, 408, 1);
    addBestShotResult(SKATER, 412, 1);
    addBestShotResult(SKATER, 416, 1);
    addBestShotResult(SKATER, 426, 1);
    addBestShotResult(SKATER, 449, 1);
    addBestShotResult(SKATER, 513, 1);
    addBestShotResult(SKATER, 613, 1);
    addBestShotResult(SKATER, 616, 1);
    addBestShotResult(SKATER, 602, 1);
    addBestShotResult(SKATER, 606, 1);
    addBestShotResult(SKATER, 3, 1);
    addBestShotResult(SKATER, 20, 1);
    addBestShotResult(SKATER, 4, 1);
    addBestShotResult(SKATER, 708, 1);
    addBestShotResult(SKATER, 710, 1);
    addBestShotResult(SKATER, 714, 1);
    addBestShotResult(SKATER, 803, 1);
    addBestShotResult(SKATER, 806, 1);
    addBestShotResult(SKATER, 808, 1);
    addBestShotResult(SKATER, 906, 1);
    addBestShotResult(SKATER, 907, 1);
    addBestShotResult(SKATER, 109, 0);
    addBestShotResult(SKATER, 118, 0);
    addBestShotResult(SKATER, 106, 0);
    addBestShotResult(SKATER, 125, 0);
    addBestShotResult(SKATER, 217, 0);
    addBestShotResult(SKATER, 434, 0);
    addBestShotResult(SKATER, 506, 0);
    addBestShotResult(SKATER, 509, 0);
    addBestShotResult(SKATER, 512, 0);
    addBestShotResult(SKATER, 531, 0);
    addBestShotResult(SKATER, 534, 0);
    addBestShotResult(SKATER, 604, 0);
    addBestShotResult(SKATER, 608, 0);
    addBestShotResult(SKATER, 605, 0);
    addBestShotResult(SKATER, 10, 0);
    addBestShotResult(SKATER, 7, 0);
    addBestShotResult(SKATER, 16, 0);
    addBestShotResult(SKATER, 706, 0);
    addBestShotResult(SKATER, 707, 0);
    addBestShotResult(SKATER, 711, 0);
    addBestShotResult(SKATER, 712, 0);
    addBestShotResult(SKATER, 802, 0);
    addBestShotResult(SKATER, 813, 0);
    addBestShotResult(SKATER, 917, 0);
    addBestShotResult(SKATER, 919, 0);
    addBestShotResult(SKATER, 924, 0);
    addBestShotResult(SKATER, 939, 0);
    addBestShotResult(SKATER, 984, 0);

    addBestShotResult(GOALTENDER, 201, 4);
    addBestShotResult(GOALTENDER, 355, 4);
    addBestShotResult(GOALTENDER, 370, 4);
    addBestShotResult(GOALTENDER, 430, 4);
    addBestShotResult(GOALTENDER, 1, 4);
    addBestShotResult(GOALTENDER, 801, 4);
    addBestShotResult(GOALTENDER, 901, 4);
    addBestShotResult(GOALTENDER, 225, 3);
    addBestShotResult(GOALTENDER, 629, 3);
    addBestShotResult(GOALTENDER, 627, 3);
    addBestShotResult(GOALTENDER, 701, 3);
    addBestShotResult(GOALTENDER, 450, 2);
    addBestShotResult(GOALTENDER, 21, 2);
    addBestShotResult(GOALTENDER, 815, 2);
    addBestShotResult(GOALTENDER, 101, 1);
    addBestShotResult(GOALTENDER, 130, 1);
    addBestShotResult(GOALTENDER, 540, 1);
    addBestShotResult(GOALTENDER, 717, 1);
    addBestShotResult(GOALTENDER, 501, 0);
  }

  // 397w -> 397
  // 397b -> 398
  public void addPassAndGoResults() {
    addPassAndGoResult(SKATER, 338, 5, 22.78);
    addPassAndGoResult(SKATER, 913, 5, 23.4);
    addPassAndGoResult(SKATER, 714, 5, 24.03);
    addPassAndGoResult(SKATER, 388, 5, 26.1);
    addPassAndGoResult(SKATER, 707, 5, 26.18);
    addPassAndGoResult(SKATER, 702, 5, 26.53);
    addPassAndGoResult(SKATER, 8, 5, 27.22);
    addPassAndGoResult(SKATER, 712, 5, 27.44);
    addPassAndGoResult(SKATER, 814, 5, 28.66);
    addPassAndGoResult(SKATER, 373, 4, 19.19);
    addPassAndGoResult(SKATER, 11, 4, 23.22);
    addPassAndGoResult(SKATER, 23, 4, 23.66);
    addPassAndGoResult(SKATER, 416, 4, 23.72);
    addPassAndGoResult(SKATER, 5, 4, 23.78);
    addPassAndGoResult(SKATER, 812, 4, 23.9);
    addPassAndGoResult(SKATER, 813, 4, 24.18);
    addPassAndGoResult(SKATER, 117, 4, 24.41);
    addPassAndGoResult(SKATER, 368, 4, 25.31);
    addPassAndGoResult(SKATER, 339, 4, 25.35);
    addPassAndGoResult(SKATER, 438, 4, 25.37);
    addPassAndGoResult(SKATER, 515, 4, 25.78);
    addPassAndGoResult(SKATER, 406, 4, 25.84);
    addPassAndGoResult(SKATER, 208, 4, 27.07);
    addPassAndGoResult(SKATER, 428, 4, 27.25);
    addPassAndGoResult(SKATER, 109, 4, 27.35);
    addPassAndGoResult(SKATER, 908, 4, 27.81);
    addPassAndGoResult(SKATER, 513, 4, 29.32);
    addPassAndGoResult(SKATER, 623, 4, 29.5);
    addPassAndGoResult(SKATER, 608, 4, 29.59);
    addPassAndGoResult(SKATER, 210, 3, 21.03);
    addPassAndGoResult(SKATER, 343, 3, 21.06);
    addPassAndGoResult(SKATER, 713, 3, 21.6);
    addPassAndGoResult(SKATER, 506, 3, 21.78);
    addPassAndGoResult(SKATER, 527, 3, 21.81);
    addPassAndGoResult(SKATER, 6, 3, 22.88);
    addPassAndGoResult(SKATER, 397, 3, 23);
    addPassAndGoResult(SKATER, 115, 3, 23.09);
    addPassAndGoResult(SKATER, 10, 3, 23.16);
    addPassAndGoResult(SKATER, 521, 3, 23.44);
    addPassAndGoResult(SKATER, 906, 3, 23.47);
    addPassAndGoResult(SKATER, 505, 3, 23.5);
    addPassAndGoResult(SKATER, 811, 3, 23.5);
    addPassAndGoResult(SKATER, 439, 3, 23.66);
    addPassAndGoResult(SKATER, 3, 3, 24.18);
    addPassAndGoResult(SKATER, 110, 3, 24.41);
    addPassAndGoResult(SKATER, 703, 3, 24.47);
    addPassAndGoResult(SKATER, 531, 3, 24.56);
    addPassAndGoResult(SKATER, 529, 3, 24.78);
    addPassAndGoResult(SKATER, 809, 3, 24.84);
    addPassAndGoResult(SKATER, 808, 3, 24.84);
    addPassAndGoResult(SKATER, 802, 3, 24.87);
    addPassAndGoResult(SKATER, 371, 3, 24.9);
    addPassAndGoResult(SKATER, 408, 3, 24.91);
    addPassAndGoResult(SKATER, 606, 3, 25.03);
    addPassAndGoResult(SKATER, 509, 3, 25.09);
    addPassAndGoResult(SKATER, 124, 3, 25.44);
    addPassAndGoResult(SKATER, 917, 3, 26.37);
    addPassAndGoResult(SKATER, 217, 3, 26.56);
    addPassAndGoResult(SKATER, 805, 3, 27.31);
    addPassAndGoResult(SKATER, 14, 3, 27.57);
    addPassAndGoResult(SKATER, 613, 3, 28.03);
    addPassAndGoResult(SKATER, 207, 3, 28.16);
    addPassAndGoResult(SKATER, 534, 3, 28.19);
    addPassAndGoResult(SKATER, 611, 3, 29.12);
    addPassAndGoResult(SKATER, 205, 3, 29.25);
    addPassAndGoResult(SKATER, 711, 3, 29.65);
    addPassAndGoResult(SKATER, 924, 3, 29.66);
    addPassAndGoResult(SKATER, 617, 3, 34.19);
    addPassAndGoResult(SKATER, 507, 2, 18.87);
    addPassAndGoResult(SKATER, 119, 2, 19.37);
    addPassAndGoResult(SKATER, 512, 2, 21.78);
    addPassAndGoResult(SKATER, 7, 2, 22.56);
    addPassAndGoResult(SKATER, 128, 2, 23.28);
    addPassAndGoResult(SKATER, 434, 2, 23.32);
    addPassAndGoResult(SKATER, 710, 2, 23.44);
    addPassAndGoResult(SKATER, 616, 2, 23.83);
    addPassAndGoResult(SKATER, 106, 2, 23.88);
    addPassAndGoResult(SKATER, 16, 2, 23.93);
    addPassAndGoResult(SKATER, 398, 2, 23.94);
    addPassAndGoResult(SKATER, 379, 2, 24.12);
    addPassAndGoResult(SKATER, 412, 2, 24.12);
    addPassAndGoResult(SKATER, 939, 2, 24.22);
    addPassAndGoResult(SKATER, 810, 2, 24.94);
    addPassAndGoResult(SKATER, 20, 2, 25.31);
    addPassAndGoResult(SKATER, 705, 2, 25.62);
    addPassAndGoResult(SKATER, 105, 2, 26.03);
    addPassAndGoResult(SKATER, 984, 2, 26.65);
    addPassAndGoResult(SKATER, 806, 2, 27.78);
    addPassAndGoResult(SKATER, 129, 2, 28.13);
    addPassAndGoResult(SKATER, 125, 2, 28.19);
    addPassAndGoResult(SKATER, 602, 2, 29.04);
    addPassAndGoResult(SKATER, 804, 2, 29.53);
    addPassAndGoResult(SKATER, 708, 2, 29.94);
    addPassAndGoResult(SKATER, 444, 2, 30.03);
    addPassAndGoResult(SKATER, 604, 2, 30.06);
    addPassAndGoResult(SKATER, 449, 2, 30.29);
    addPassAndGoResult(SKATER, 936, 2, 32.57);
    addPassAndGoResult(SKATER, 605, 2, 32.69);
    addPassAndGoResult(SKATER, 803, 2, 33.35);
    addPassAndGoResult(SKATER, 610, 2, 34.22);
    addPassAndGoResult(SKATER, 206, 2, 34.5);
    addPassAndGoResult(SKATER, 715, 1, 21.28);
    addPassAndGoResult(SKATER, 956, 1, 21.53);
    addPassAndGoResult(SKATER, 910, 1, 22.12);
    addPassAndGoResult(SKATER, 118, 1, 22.5);
    addPassAndGoResult(SKATER, 426, 1, 23.43);
    addPassAndGoResult(SKATER, 362, 1, 23.5);
    addPassAndGoResult(SKATER, 372, 1, 24.06);
    addPassAndGoResult(SKATER, 423, 1, 24.16);
    addPassAndGoResult(SKATER, 915, 1, 24.46);
    addPassAndGoResult(SKATER, 907, 1, 25.38);
    addPassAndGoResult(SKATER, 221, 1, 25.91);
    addPassAndGoResult(SKATER, 209, 1, 26.09);
    addPassAndGoResult(SKATER, 614, 1, 27);
    addPassAndGoResult(SKATER, 4, 1, 30.07);
    addPassAndGoResult(SKATER, 219, 1, 30.11);
    addPassAndGoResult(SKATER, 706, 0, 27.43);
    addPassAndGoResult(SKATER, 9, 0, 35.28);

    addPassAndGoResult(GOALTENDER, 629, 3, 38.68);
    addPassAndGoResult(GOALTENDER, 130, 2, 27.56);
    addPassAndGoResult(GOALTENDER, 815, 2, 28.73);
    addPassAndGoResult(GOALTENDER, 901, 2, 28.87);
    addPassAndGoResult(GOALTENDER, 627, 2, 31.1);
    addPassAndGoResult(GOALTENDER, 21, 2, 33.79);
    addPassAndGoResult(GOALTENDER, 450, 1, 25.81);
    addPassAndGoResult(GOALTENDER, 540, 1, 26.66);
    addPassAndGoResult(GOALTENDER, 701, 1, 31.46);
    addPassAndGoResult(GOALTENDER, 355, 1, 32.68);
    addPassAndGoResult(GOALTENDER, 201, 1, 32.97);
    addPassAndGoResult(GOALTENDER, 225, 1, 33.41);
    addPassAndGoResult(GOALTENDER, 501, 1, 36.69);
    addPassAndGoResult(GOALTENDER, 101, 0, 26.03);
    addPassAndGoResult(GOALTENDER, 370, 0, 26.35);
    addPassAndGoResult(GOALTENDER, 717, 0, 27.46);
    addPassAndGoResult(GOALTENDER, 1, 0, 28.09);
    addPassAndGoResult(GOALTENDER, 801, 0, 29.15);
    addPassAndGoResult(GOALTENDER, 430, 0, 30.16);
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
