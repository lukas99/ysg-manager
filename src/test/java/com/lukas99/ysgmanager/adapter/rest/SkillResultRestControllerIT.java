package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtils.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.bestShotResult;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.magicTransitionsResult;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillResult;
import com.lukas99.ysgmanager.domain.SkillResultRepository;
import com.lukas99.ysgmanager.domain.SkillResultService;
import com.lukas99.ysgmanager.domain.SkillResultTemplates;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;
import java.util.List;
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
 * Integration tests for the {@link SkillResultRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class SkillResultRestControllerIT extends IntegrationTest {

  @Autowired
  private SkillResultRepository skillResultRepository;

  @Autowired
  private SkillResultService skillResultService;

  @Autowired
  private PlayerService playerService;

  @Autowired
  private SkillService skillService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  private MockMvc restSkillResultMockMvc;

  private Player romanJosi;
  private Player martinGerber;
  private Skill magicTransitions;
  private SkillResult magicTransitionsResult;
  private SkillResult bestShotResult;
  private SkillResultModel magicTransitionsResultModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillResultRestController skillResultResource =
        new SkillResultRestController(skillResultService, playerService, skillService);
    this.restSkillResultMockMvc = MockMvcBuilders.standaloneSetup(skillResultResource)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter)
        .build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    romanJosi = PlayerTemplates.romanJosi(ehcEngelberg, em);
    martinGerber = PlayerTemplates.martinGerber(ehcEngelberg, em);
    magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    Skill bestShot = SkillTemplates.bestShot(ysg2019, em);
    magicTransitionsResult = magicTransitionsResult(magicTransitions, romanJosi);
    bestShotResult = bestShotResult(bestShot, martinGerber);
    magicTransitionsResultModel = new SkillResultModelAssembler().toModel(magicTransitionsResult);
  }

  @Test
  @Transactional
  public void createSkillResult() throws Exception {
    int databaseSizeBeforeCreate = skillResultRepository.findAll().size();

    // Create the SkillResult
    restSkillResultMockMvc.perform(post("/api/players/{playerId}/skill-results", romanJosi.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsResultModel)))
        .andExpect(status().isOk());

    // Validate the SkillResult in the database
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeCreate + 1);
    SkillResult testSkillResult = skillResultList.get(skillResultList.size() - 1);
    assertThat(testSkillResult.getPlayer()).isEqualTo(romanJosi);
    assertThat(testSkillResult.getSkill()).isEqualTo(magicTransitions);
    assertThat(testSkillResult.getTime()).isEqualTo(SkillResultTemplates.THIRTY_SECONDS);
    assertThat(testSkillResult.getFailures()).isEqualTo(SkillResultTemplates.ONE);
    assertThat(testSkillResult.getPoints()).isNull();
  }

  @Test
  @Transactional
  public void getSkillResultsOfSkill() throws Exception {
    // Initialize the database
    skillResultRepository.saveAndFlush(magicTransitionsResult);
    skillResultRepository.saveAndFlush(bestShotResult);

    // Get all the skillResults of a skill
    restSkillResultMockMvc
        .perform(get("/api/skills/{skillId}/skill-results", magicTransitions.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content.[0].time").value(is(SkillResultTemplates.THIRTY_SECONDS)))
        .andExpect(jsonPath("$.content.[0].failures").value(is(SkillResultTemplates.ONE)))
        .andExpect(jsonPath("$.content.[0].points").value(is(nullValue())))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skill-results/" + magicTransitionsResult.getId())));
  }

  @Test
  @Transactional
  public void getSkillResultsOfPlayer() throws Exception {
    // Initialize the database
    skillResultRepository.saveAndFlush(magicTransitionsResult);
    skillResultRepository.saveAndFlush(bestShotResult);

    // Get all the skillResults of a player
    restSkillResultMockMvc
        .perform(get("/api/players/{playerId}/skill-results", martinGerber.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content.[0].time").value(is(nullValue())))
        .andExpect(jsonPath("$.content.[0].failures").value(nullValue()))
        .andExpect(jsonPath("$.content.[0].points").value(SkillResultTemplates.SIX))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skill-results/" + bestShotResult.getId())));
  }

  @Test
  @Transactional
  public void getSkillResult() throws Exception {
    // Initialize the database
    skillResultRepository.saveAndFlush(magicTransitionsResult);

    // Get the skillResult
    restSkillResultMockMvc.perform(get("/api/skill-results/{id}", magicTransitionsResult.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.time").value(is(SkillResultTemplates.THIRTY_SECONDS)))
        .andExpect(jsonPath("$.failures").value(is(SkillResultTemplates.ONE)))
        .andExpect(jsonPath("$.points").value(is(nullValue())))
        .andExpect(jsonPath("$.links", hasSize(3)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href",
            endsWith("/skill-results/" + magicTransitionsResult.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("player")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/players/" + romanJosi.getId())))
        .andExpect(jsonPath("$.links.[2].rel").value(is("skill")))
        .andExpect(jsonPath("$.links.[2].href", endsWith("/skills/" + magicTransitions.getId())));
  }

  @Test
  @Transactional
  public void getNonExistingSkillResult() throws Exception {
    // Get the skillResult
    restSkillResultMockMvc.perform(get("/api/skill-results/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updateSkillResult() throws Exception {
    // Initialize the database
    skillResultService.save(magicTransitionsResult);

    int databaseSizeBeforeUpdate = skillResultRepository.findAll().size();

    // Update the skillResult
    magicTransitionsResultModel.setTime(31_000);
    magicTransitionsResultModel.setFailures(2);
    magicTransitionsResultModel.setPoints(3);

    restSkillResultMockMvc.perform(
        put("/api/skill-results/{id}", magicTransitionsResult.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(magicTransitionsResultModel)))
        .andExpect(status().isOk());

    // Validate the SkillResult in the database
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeUpdate);
    SkillResult testSkillResult = skillResultList.get(skillResultList.size() - 1);
    assertThat(testSkillResult.getTime()).isEqualTo(31_000);
    assertThat(testSkillResult.getFailures()).isEqualTo(2);
    assertThat(testSkillResult.getPoints()).isEqualTo(3);
  }

  @Test
  @Transactional
  public void deleteSkillResult() throws Exception {
    // Initialize the database
    skillResultService.save(magicTransitionsResult);

    int databaseSizeBeforeDelete = skillResultRepository.findAll().size();

    // Delete the skillResult
    restSkillResultMockMvc
        .perform(delete("/api/skill-results/{id}", magicTransitionsResult.getId())
            .accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeDelete - 1);
  }

}
