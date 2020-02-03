package com.lukas99.ysgmanager.domain;

import javax.persistence.EntityManager;

public class TeamTemplates {

  public static final String EHC_ENGELBERG = "EHC Engelberg";
  public static final byte[] EHC_ENGELBERG_LOGO = "logoEHCEngelberg".getBytes();

  public static final String SC_BERN = "SC Bern";
  public static final byte[] SC_BERN_LOGO = "logoScBern".getBytes();

  public static Team ehcEngelberg(Tournament tournament) {
    return Team.builder().name(EHC_ENGELBERG).logo(EHC_ENGELBERG_LOGO).tournament(tournament)
        .build();
  }

  public static Team ehcEngelberg(Tournament tournament, EntityManager em) {
    Team ehcEngelberg = ehcEngelberg(tournament);
    em.persist(ehcEngelberg);
    return ehcEngelberg;
  }

  public static Team scBern(Tournament tournament) {
    return Team.builder().name(SC_BERN).logo(SC_BERN_LOGO).tournament(tournament).build();
  }

}
