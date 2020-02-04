package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import com.lukas99.ysgmanager.adapter.rest.errors.ExceptionTranslator;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRepository;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.SkillType;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;

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
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private ExceptionTranslator exceptionTranslator;

  @Autowired
  private EntityManager em;

  @Autowired
  private Validator validator;

  private MockMvc restSkillMockMvc;

  private Skill magicTransitions;
  private Skill bestShot;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillRestController skillRestController = new SkillRestController(skillService);
    this.restSkillMockMvc = MockMvcBuilders.standaloneSetup(skillRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setControllerAdvice(exceptionTranslator)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    magicTransitions = SkillTemplates.magicTransitions(ysg2019);
    bestShot = SkillTemplates.bestShot(ysg2019);
  }

  @Test
  @Transactional
  public void createSkill() throws Exception {
    int databaseSizeBeforeCreate = skillRepository.findAll().size();

    // Create the Skill
    restSkillMockMvc
        .perform(post("/api/skills").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isCreated());

    // Validate the Skill in the database
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeCreate + 1);
    Skill testSkill = skillList.get(skillList.size() - 1);
    assertThat(testSkill.getSkillType()).isEqualTo(SkillType.TIME_WITH_RATING);
    assertThat(testSkill.getName()).isEqualTo(SkillTemplates.MAGIC_TRANSITIONS);
    assertThat(testSkill.getNumber()).isEqualTo(SkillTemplates.ONE);
    assertThat(testSkill.getTournament().getId())
        .isEqualTo(magicTransitions.getTournament().getId());
  }

  @Test
  @Transactional
  public void createSkillWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = skillRepository.findAll().size();

    // Create the Skill with an existing ID
    magicTransitions.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restSkillMockMvc
        .perform(post("/api/skills").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isBadRequest());

    // Validate the Skill in the database
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeCreate);
  }


  @Test
  @Transactional
  public void checkSkillTypeIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitions.setSkillType(null);

    // Create the Skill, which fails.
    restSkillMockMvc
        .perform(post("/api/skills").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isBadRequest());

    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void checkNameIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitions.setName(null);

    // Create the Skill, which fails.
    restSkillMockMvc
        .perform(post("/api/skills").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isBadRequest());

    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllSkills() throws Exception {
    // Initialize the database
    skillRepository.saveAndFlush(magicTransitions);
    skillRepository.saveAndFlush(bestShot);

    // Get all the skillList
    restSkillMockMvc.perform(get("/api/skills?sort=id,desc")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(magicTransitions.getId().intValue())))
        .andExpect(jsonPath("$.[0].skillType").value(is(SkillType.TIME_WITH_RATING.toString())))
        .andExpect(jsonPath("$.[0].name").value(is(SkillTemplates.MAGIC_TRANSITIONS)))
        .andExpect(jsonPath("$.[0].number").value(is(SkillTemplates.ONE)))
        .andExpect(jsonPath("$.[1].id").value(is(bestShot.getId().intValue())))
        .andExpect(jsonPath("$.[1].skillType").value(is(SkillType.POINTS.toString())))
        .andExpect(jsonPath("$.[1].name").value(is(SkillTemplates.BEST_SHOT)))
        .andExpect(jsonPath("$.[1].number").value(is(SkillTemplates.TWO)));
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
        .andExpect(jsonPath("$.id").value(magicTransitions.getId().intValue()))
        .andExpect(jsonPath("$.skillType").value(SkillType.TIME_WITH_RATING.toString()))
        .andExpect(jsonPath("$.name").value(SkillTemplates.MAGIC_TRANSITIONS))
        .andExpect(jsonPath("$.number").value(SkillTemplates.ONE));
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
    Skill updatedSkill = magicTransitions.toBuilder().skillType(SkillType.TIME_WITH_POINTS)
        .name("updatedName").number(99).build();

    restSkillMockMvc.perform(put("/api/skills").contentType(TestUtil.APPLICATION_JSON)
        .content(TestUtil.convertObjectToJsonBytes(updatedSkill))).andExpect(status().isOk());

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
  public void updateNonExistingSkill() throws Exception {
    int databaseSizeBeforeUpdate = skillRepository.findAll().size();

    // Create the Skill

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restSkillMockMvc
        .perform(put("/api/skills").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitions)))
        .andExpect(status().isBadRequest());

    // Validate the Skill in the database
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deleteSkill() throws Exception {
    // Initialize the database
    skillService.save(magicTransitions);

    int databaseSizeBeforeDelete = skillRepository.findAll().size();

    // Delete the skill
    restSkillMockMvc
        .perform(
            delete("/api/skills/{id}", magicTransitions.getId()).accept(TestUtil.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Skill> skillList = skillRepository.findAll();
    assertThat(skillList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
