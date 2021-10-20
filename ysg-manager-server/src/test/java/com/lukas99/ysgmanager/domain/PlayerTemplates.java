package com.lukas99.ysgmanager.domain;

import static com.lukas99.ysgmanager.domain.PlayerPosition.GOALTENDER;
import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;
import javax.persistence.EntityManager;

public class PlayerTemplates {

  public static final String ROMAN = "Roman";
  public static final String JOSI = "Josi";
  public static final int FIFITY_NINE = 59;

  public static final String TIMO = "Roman";
  public static final String MEIER = "Josi";
  public static final int TWENTY_EIGHT = 28;

  public static final String MARTIN = "Martin";
  public static final String GERBER = "Gerber";
  public static final int TWENTY_NINE = 29;

  public static Player romanJosi(Team team) {
    return Player.builder().firstName(ROMAN).lastName(JOSI).position(SKATER)
        .shirtNumber(FIFITY_NINE).team(team).build();
  }

  public static Player romanJosi(Team team, EntityManager em) {
    Player romanJosi = romanJosi(team);
    em.persist(romanJosi);
    return romanJosi;
  }

  public static Player timoMeier(Team team) {
    return Player.builder().firstName(TIMO).lastName(MEIER).position(SKATER)
        .shirtNumber(TWENTY_EIGHT).team(team).build();
  }

  public static Player timoMeier(Team team, EntityManager em) {
    Player timoMeier = timoMeier(team);
    em.persist(timoMeier);
    return timoMeier;
  }

  public static Player martinGerber(Team team) {
    return Player.builder().firstName(MARTIN).lastName(GERBER).position(GOALTENDER)
        .shirtNumber(TWENTY_NINE).team(team).build();
  }

  public static Player martinGerber(Team team, EntityManager em) {
    Player martinGerber = martinGerber(team);
    em.persist(martinGerber);
    return martinGerber;
  }

}
