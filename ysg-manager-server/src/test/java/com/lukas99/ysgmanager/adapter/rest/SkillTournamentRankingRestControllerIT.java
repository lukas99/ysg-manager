package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtils.createFormattingConversionService;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRatingTemplates;
import com.lukas99.ysgmanager.domain.SkillResultTemplates;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.SkillTournamentRanking;
import com.lukas99.ysgmanager.domain.SkillTournamentRankingService;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import com.lukas99.ysgmanager.domain.TournamentTemplates;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SkillTournamentRankingRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class SkillTournamentRankingRestControllerIT extends IntegrationTest {

  @Autowired
  private SkillTournamentRankingService skillTournamentRankingService;

  @Autowired
  private TournamentService tournamentService;

  @Autowired
  private SkillService skillService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  private MockMvc restSkillTournamentRankingMockMvc;

  private Tournament ysg2019;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillTournamentRankingRestController skillTournamentRankingRestController =
        new SkillTournamentRankingRestController(skillTournamentRankingService, tournamentService);
    this.restSkillTournamentRankingMockMvc =
        MockMvcBuilders.standaloneSetup(skillTournamentRankingRestController)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .build();
  }

  @BeforeEach
  public void initTest() {
    ysg2019 = TournamentTemplates.ysg2019(em);
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    Player romanJosi = PlayerTemplates.romanJosi(ehcEngelberg, em);
    Player timoMeier = PlayerTemplates.timoMeier(ehcEngelberg, em);
    Skill magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    SkillResultTemplates.magicTransitionsResult(magicTransitions, romanJosi, em);
    SkillResultTemplates.magicTransitionsResult(magicTransitions, timoMeier, em);
    SkillRatingTemplates.magicTransitionsRating(magicTransitions, romanJosi, em);
    SkillRatingTemplates.magicTransitionsRating(magicTransitions, timoMeier, em);
  }

  @Test
  @Transactional
  public void getSkillTournamentRankingsOfTournament() throws Exception {
    skillService.calculateSkillRankings(ysg2019);

    // Get all the skillTournamentRankings of a tournament
    restSkillTournamentRankingMockMvc
        .perform(get("/api/tournaments/{tournamentId}/skill-tournament-rankings", ysg2019.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].sequence").value(is(1)))
        .andExpect(jsonPath("$.content.[0].rank").value(is(1)))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[1].sequence").value(is(2)))
        .andExpect(jsonPath("$.content.[1].rank").value(is(1)))
        .andExpect(jsonPath("$.content.[1].links", hasSize(3)))    ;
  }

  @Test
  @Transactional
  public void getSkillTournamentRanking() throws Exception {
    skillService.calculateSkillRankings(ysg2019);

    SkillTournamentRanking ranking =
        skillTournamentRankingService.findByTournament(ysg2019).stream().findAny().orElseThrow();

    restSkillTournamentRankingMockMvc.perform(
            get("/api/skill-tournament-rankings/{id}", ranking.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.rank").value(is(ranking.getRank())))
        .andExpect(jsonPath("$.sequence").value(is(ranking.getSequence())))
        .andExpect(jsonPath("$.skill.name").value(is(ranking.getSkill().getName())))
        .andExpect(jsonPath("$.player.lastName").value(is(ranking.getPlayer().getLastName())))
        .andExpect(jsonPath("$.links", hasSize(3)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href",
            endsWith("/skill-tournament-rankings/" + ranking.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("player")))
        .andExpect(jsonPath("$.links.[1].href",
            endsWith("/players/" + ranking.getPlayer().getId())))
        .andExpect(jsonPath("$.links.[2].rel").value(is("skill")))
        .andExpect(jsonPath("$.links.[2].href", endsWith("/skills/" + ranking.getSkill().getId())));
  }

  @Test
  @Transactional
  public void getNonExistingSkillTournamentRanking() throws Exception {
    restSkillTournamentRankingMockMvc.perform(
            get("/api/skill-tournament-rankings/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

}
