package com.lukas99.ysgmanager.domain;

import jakarta.persistence.EntityManager;

public class TeamTemplates {

  public static final String EHC_ENGELBERG = "EHC Engelberg";
  public static final byte[] EHC_ENGELBERG_LOGO = "logoEHCEngelberg".getBytes();

  public static final String SC_BERN = "SC Bern";
  public static final byte[] SC_BERN_LOGO = "logoScBern".getBytes();

  public static final String EHC_ST_MORITZ = "EHC St. Moritz";
  public static final String GCK_LIONS = "GCK Lions";
  public static final String EV_ZUG = "EV Zug";
  public static final String EHC_BASEL = "EHC Basel";
  public static final String HC_LUGANO = "HC Lugano";
  public static final String HC_LAUSANNE = "HC Lausanne";
  public static final String BAVARIAN_LIONS = "Bavarian Lions";
  public static final String EHC_BURGDORF = "EHC Burgdorf";

  public static Team ehcEngelberg(Tournament tournament) {
    return Team.builder().name(EHC_ENGELBERG).logo(EHC_ENGELBERG_LOGO).tournament(tournament)
        .build();
  }

  public static Team ehcEngelberg(Tournament tournament, EntityManager em) {
    return persist(ehcEngelberg(tournament), em);
  }

  public static Team scBern(Tournament tournament) {
    return Team.builder().name(SC_BERN).logo(SC_BERN_LOGO).tournament(tournament).build();
  }

  public static Team scBern(Tournament tournament, EntityManager em) {
    return persist(scBern(tournament), em);
  }

  public static Team ehcStMoritz(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(EHC_ST_MORITZ).tournament(tournament).build(), em);
  }

  public static Team gckLions(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(GCK_LIONS).tournament(tournament).build(), em);
  }

  public static Team evZug(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(EV_ZUG).tournament(tournament).build(), em);
  }

  public static Team ehcBasel(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(EHC_BASEL).tournament(tournament).build(), em);
  }

  public static Team hcLugano(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(HC_LUGANO).tournament(tournament).build(), em);
  }

  public static Team hcLausanne(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(HC_LAUSANNE).tournament(tournament).build(), em);
  }

  public static Team bavarianLions(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(BAVARIAN_LIONS).tournament(tournament).build(), em);
  }

  public static Team ehcBurgdorf(Tournament tournament, EntityManager em) {
    return persist(Team.builder().name(EHC_BURGDORF).tournament(tournament).build(), em);
  }

  private static Team persist(Team team, EntityManager em) {
    em.persist(team);
    return team;
  }

}
