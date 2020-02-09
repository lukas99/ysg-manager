package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtil.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.bestShotResult;
import static com.lukas99.ysgmanager.domain.SkillResultTemplates.magicTransitionsResult;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
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
import org.springframework.validation.Validator;
import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillResult;
import com.lukas99.ysgmanager.domain.SkillResultRepository;
import com.lukas99.ysgmanager.domain.SkillResultService;
import com.lukas99.ysgmanager.domain.SkillResultTemplates;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;

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
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  @Autowired
  private Validator validator;

  private MockMvc restSkillResultMockMvc;

  private SkillResult magicTransitionsResult;
  private SkillResult bestShotResult;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillResultRestController skillResultRestService =
        new SkillResultRestController(skillResultService);
    this.restSkillResultMockMvc = MockMvcBuilders.standaloneSetup(skillResultRestService)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    Player romanJosi = PlayerTemplates.romanJosi(ehcEngelberg, em);
    Skill magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    Skill bestShot = SkillTemplates.bestShot(ysg2019, em);
    magicTransitionsResult = magicTransitionsResult(magicTransitions, romanJosi);
    bestShotResult = bestShotResult(bestShot, romanJosi);
  }

  @Test
  @Transactional
  public void createSkillResult() throws Exception {
    int databaseSizeBeforeCreate = skillResultRepository.findAll().size();

    // Create the SkillResult
    restSkillResultMockMvc
        .perform(post("/api/skill-results").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsResult)))
        .andExpect(status().isCreated());

    // Validate the SkillResult in the database
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeCreate + 1);
    SkillResult testSkillResult = skillResultList.get(skillResultList.size() - 1);
    assertThat(testSkillResult.getTime()).isEqualTo(SkillResultTemplates.THIRTY_SECONDS);
    assertThat(testSkillResult.getFailures()).isEqualTo(SkillResultTemplates.ONE);
    assertThat(testSkillResult.getPoints()).isNull();
  }

  @Test
  @Transactional
  public void createSkillResultWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = skillResultRepository.findAll().size();

    // Create the SkillResult with an existing ID
    magicTransitionsResult.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restSkillResultMockMvc
        .perform(post("/api/skill-results").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsResult)))
        .andExpect(status().isBadRequest());

    // Validate the SkillResult in the database
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeCreate);
  }


  @Test
  @Transactional
  public void getAllSkillResults() throws Exception {
    // Initialize the database
    skillResultRepository.saveAndFlush(magicTransitionsResult);
    skillResultRepository.saveAndFlush(bestShotResult);

    // Get all the skillResultList
    restSkillResultMockMvc.perform(get("/api/skill-results?sort=id,desc"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(bestShotResult.getId().intValue())))
        .andExpect(jsonPath("$.[0].time").value(nullValue()))
        .andExpect(jsonPath("$.[0].failures").value(nullValue()))
        .andExpect(jsonPath("$.[0].points").value(is(SkillResultTemplates.SIX)))
        .andExpect(jsonPath("$.[1].id").value(is(magicTransitionsResult.getId().intValue())))
        .andExpect(jsonPath("$.[1].time").value(is(SkillResultTemplates.THIRTY_SECONDS)))
        .andExpect(jsonPath("$.[1].failures").value(is(SkillResultTemplates.ONE)))
        .andExpect(jsonPath("$.[1].points").value(nullValue()));
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
        .andExpect(jsonPath("$.id").value(magicTransitionsResult.getId().intValue()))
        .andExpect(jsonPath("$.time").value(SkillResultTemplates.THIRTY_SECONDS))
        .andExpect(jsonPath("$.failures").value(SkillResultTemplates.ONE))
        .andExpect(jsonPath("$.points").value(nullValue()));
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
    SkillResult updatedSkillResult =
        magicTransitionsResult.toBuilder().time(31_000).failures(2).points(3).build();

    restSkillResultMockMvc
        .perform(put("/api/skill-results").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSkillResult)))
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
  public void updateNonExistingSkillResult() throws Exception {
    int databaseSizeBeforeUpdate = skillResultRepository.findAll().size();

    // Create the SkillResult

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restSkillResultMockMvc
        .perform(put("/api/skill-results").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsResult)))
        .andExpect(status().isBadRequest());

    // Validate the SkillResult in the database
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deleteSkillResult() throws Exception {
    // Initialize the database
    skillResultService.save(magicTransitionsResult);

    int databaseSizeBeforeDelete = skillResultRepository.findAll().size();

    // Delete the skillResult
    restSkillResultMockMvc.perform(delete("/api/skill-results/{id}", magicTransitionsResult.getId())
        .accept(TestUtil.APPLICATION_JSON)).andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<SkillResult> skillResultList = skillResultRepository.findAll();
    assertThat(skillResultList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
