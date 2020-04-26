package com.lukas99.ysgmanager.domain;

import javax.persistence.EntityManager;

public class TournamentTemplates {

  public static final String YSG_2019 = "YSG 2019";
  public static final String YSG_2019_DATE_DESCRIPTION = "2019";

  public static final String YSG_2020 = "YSG 2020";
  public static final String YSG_2020_DATE_DESCRIPTION = "2020";

  public static Tournament ysg2019() {
    return Tournament.builder().name(YSG_2019).dateDescription(YSG_2019_DATE_DESCRIPTION).build();
  }
  
  public static Tournament ysg2019(EntityManager em) {
    Tournament ysg2019 = ysg2019();
    em.persist(ysg2019);
    return ysg2019;
  }

  public static Tournament ysg2020() {
    return Tournament.builder().name(YSG_2020).dateDescription(YSG_2020_DATE_DESCRIPTION).build();
  }

}
