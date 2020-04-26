package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtils.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRepository;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.SkillType;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
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
 * Integration tests for the {@link SkillRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class SkillRestControllerIT extends IntegrationTest {

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private SkillService skillService;

  @Autowired
  private TournamentService tournamentService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  private MockMvc restSkillMockMvc;

  private Tournament ysg2019;
  private Skill magicTransitions;
  private Skill bestShot;
  private SkillModel magicTransitionsModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillRestController skillRestController =
        new SkillRestController(skillService, tournamentService);
    this.restSkillMockMvc = MockMvcBuilders.standaloneSetup(skillRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter)
        .build();
  }

  @BeforeEach
  public void initTest() {
    ysg2019 = TournamentTemplates.ysg2019(em);
    magicTransitions = SkillTemplates.magicTransitions(ysg2019);
    bestShot = SkillTemplates.bestShot(ysg2019);
    magicTransitionsModel = new SkillModelAssembler().toModel(magicTransitions);
  }

  @Test
  @Transactional
  public void createSkill() throws Exception {
    int databaseSizeBeforeCreate = skillRepository.findAll().size();

    // Create the Skill
    restSkillMockMvc.perform(post("/api/tournaments/{tournamentId}/skills", ysg2019.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isOk());

    // Validate the Skill in the database
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeCreate + 1);
    Skill testSkill = skillList.get(skillList.size() - 1);
    assertThat(testSkill.getSkillType()).isEqualTo(SkillType.TIME_WITH_RATING);
    assertThat(testSkill.getName()).isEqualTo(SkillTemplates.MAGIC_TRANSITIONS);
    assertThat(testSkill.getNumber()).isEqualTo(SkillTemplates.ONE);
    assertThat(testSkill.getTournament()).isEqualTo(ysg2019);
  }

  @Test
  @Transactional
  public void checkSkillTypeIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitionsModel.setSkillType(null);

    // Create the Skill, which fails.
    restSkillMockMvc.perform(post("/api/tournaments/{tournamentId}/skills", ysg2019.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsModel)))
        .andExpect(status().isBadRequest());

    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void checkNameIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitionsModel.setName(null);

    // Create the Skill, which fails.
    restSkillMockMvc.perform(post("/api/tournaments/{tournamentId}/skills", ysg2019.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsModel)))
        .andExpect(status().isBadRequest());

    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllSkillsOfTournament() throws Exception {
    // Initialize the database
    skillRepository.saveAndFlush(magicTransitions);
    skillRepository.saveAndFlush(bestShot);

    // Get all the skills of a tournament
    restSkillMockMvc.perform(get("/api/tournaments/{tournamentId}/skills", ysg2019.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].skillType")
            .value(is(SkillType.TIME_WITH_RATING.toString())))
        .andExpect(jsonPath("$.content.[0].name").value(is(SkillTemplates.MAGIC_TRANSITIONS)))
        .andExpect(jsonPath("$.content.[0].number").value(is(SkillTemplates.ONE)))
        .andExpect(jsonPath("$.content.[0].links", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skills/" + magicTransitions.getId())))
        .andExpect(jsonPath("$.content.[1].skillType").value(is(SkillType.POINTS.toString())))
        .andExpect(jsonPath("$.content.[1].name").value(is(SkillTemplates.BEST_SHOT)))
        .andExpect(jsonPath("$.content.[1].number").value(is(SkillTemplates.TWO)))
        .andExpect(jsonPath("$.content.[1].links", hasSize(2)))
        .andExpect(jsonPath("$.content.[1].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[1].links.[0].href",
            endsWith("/skills/" + bestShot.getId())));
  }

  @Test
  @Transactional
  public void getSkill() throws Exception {
    // Initialize the database
    skillRepository.saveAndFlush(magicTransitions);

    // Get the skill
    restSkillMockMvc.perform(get("/api/skills/{id}", magicTransitions.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.skillType").value(SkillType.TIME_WITH_RATING.toString()))
        .andExpect(jsonPath("$.name").value(SkillTemplates.MAGIC_TRANSITIONS))
        .andExpect(jsonPath("$.number").value(SkillTemplates.ONE))
        .andExpect(jsonPath("$.links", hasSize(2)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href", endsWith("/skills/" + magicTransitions.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("tournament")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/tournaments/" + ysg2019.getId())));
  }

  @Test
  @Transactional
  public void getNonExistingSkill() throws Exception {
    // Get the skill
    restSkillMockMvc.perform(get("/api/skills/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updateSkill() throws Exception {
    // Initialize the database
    skillService.save(magicTransitions);

    int databaseSizeBeforeUpdate = skillRepository.findAll().size();

    // Update the skill
    magicTransitionsModel.setSkillType(SkillType.TIME_WITH_POINTS);
    magicTransitionsModel.setName("updatedName");
    magicTransitionsModel.setNumber(99);

    restSkillMockMvc.perform(put("/api/skills/{id}", magicTransitions.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsModel)))
        .andExpect(status().isOk());

    // Validate the Skill in the database
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeUpdate);
    Skill testSkill = skillList.get(skillList.size() - 1);
    assertThat(testSkill.getSkillType()).isEqualTo(SkillType.TIME_WITH_POINTS);
    assertThat(testSkill.getName()).isEqualTo("updatedName");
    assertThat(testSkill.getNumber()).isEqualTo(99);
  }

  @Test
  @Transactional
  public void deleteSkill() throws Exception {
    // Initialize the database
    skillService.save(magicTransitions);

    int databaseSizeBeforeDelete = skillRepository.findAll().size();

    // Delete the skill
    restSkillMockMvc.perform(
        delete("/api/skills/{id}", magicTransitions.getId()).accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeDelete - 1);
  }

}