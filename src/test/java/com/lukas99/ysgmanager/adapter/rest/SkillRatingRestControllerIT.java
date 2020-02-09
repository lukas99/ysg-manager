package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtil.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.SkillRatingTemplates.controlledJumbleRating;
import static com.lukas99.ysgmanager.domain.SkillRatingTemplates.magicTransitionsRating;
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
import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRating;
import com.lukas99.ysgmanager.domain.SkillRatingRepository;
import com.lukas99.ysgmanager.domain.SkillRatingService;
import com.lukas99.ysgmanager.domain.SkillRatingTemplates;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;

/**
 * Integration tests for the {@link SkillRatingRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class SkillRatingRestControllerIT extends IntegrationTest {

  @Autowired
  private SkillRatingRepository skillRatingRepository;

  @Autowired
  private SkillRatingService skillRatingService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  @Autowired
  private Validator validator;

  private MockMvc restSkillRatingMockMvc;

  private SkillRating magicTransitionsRating;
  private SkillRating controlledJumbleRating;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillRatingRestController skillRatingResource =
        new SkillRatingRestController(skillRatingService);
    this.restSkillRatingMockMvc = MockMvcBuilders.standaloneSetup(skillRatingResource)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    Player romanJosi = PlayerTemplates.romanJosi(ehcEngelberg, em);
    Player martinGerber = PlayerTemplates.martinGerber(ehcEngelberg, em);
    Skill magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    Skill controlledJumble = SkillTemplates.controlledJumble(ysg2019, em);
    magicTransitionsRating = magicTransitionsRating(magicTransitions, romanJosi);
    controlledJumbleRating = controlledJumbleRating(controlledJumble, martinGerber);
  }

  @Test
  @Transactional
  public void createSkillRating() throws Exception {
    int databaseSizeBeforeCreate = skillRatingRepository.findAll().size();

    // Create the SkillRating
    restSkillRatingMockMvc
        .perform(post("/api/skill-ratings").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsRating)))
        .andExpect(status().isCreated());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeCreate + 1);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getPlayer()).isEqualTo(magicTransitionsRating.getPlayer());
    assertThat(testSkillRating.getSkill()).isEqualTo(magicTransitionsRating.getSkill());
    assertThat(testSkillRating.getScore()).isEqualTo(SkillRatingTemplates.NINTY);
  }

  @Test
  @Transactional
  public void createSkillRatingWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = skillRatingRepository.findAll().size();

    // Create the SkillRating with an existing ID
    magicTransitionsRating.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restSkillRatingMockMvc
        .perform(post("/api/skill-ratings").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsRating)))
        .andExpect(status().isBadRequest());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeCreate);
  }


  @Test
  @Transactional
  public void checkScoreIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRatingRepository.findAll().size();
    // set the field null
    magicTransitionsRating.setScore(null);

    // Create the SkillRating, which fails.

    restSkillRatingMockMvc
        .perform(post("/api/skill-ratings").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsRating)))
        .andExpect(status().isBadRequest());

    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllSkillRatings() throws Exception {
    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating);
    skillRatingRepository.saveAndFlush(controlledJumbleRating);

    // Get all the skillRatingList
    restSkillRatingMockMvc.perform(get("/api/skill-ratings?sort=id,desc"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(controlledJumbleRating.getId().intValue())))
        .andExpect(jsonPath("$.[0].score").value(is(SkillRatingTemplates.EIGHTY)))
        .andExpect(jsonPath("$.[1].id").value(is(magicTransitionsRating.getId().intValue())))
        .andExpect(jsonPath("$.[1].score").value(SkillRatingTemplates.NINTY));
  }

  @Test
  @Transactional
  public void getSkillRating() throws Exception {
    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating);

    // Get the skillRating
    restSkillRatingMockMvc.perform(get("/api/skill-ratings/{id}", magicTransitionsRating.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.id").value(magicTransitionsRating.getId().intValue()))
        .andExpect(jsonPath("$.score").value(SkillRatingTemplates.NINTY));
  }

  @Test
  @Transactional
  public void getNonExistingSkillRating() throws Exception {
    // Get the skillRating
    restSkillRatingMockMvc.perform(get("/api/skill-ratings/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updateSkillRating() throws Exception {
    // Initialize the database
    skillRatingService.save(magicTransitionsRating);

    int databaseSizeBeforeUpdate = skillRatingRepository.findAll().size();

    // Update the skillRating
    SkillRating updatedSkillRating = magicTransitionsRating.toBuilder().score(50).build();

    restSkillRatingMockMvc
        .perform(put("/api/skill-ratings").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSkillRating)))
        .andExpect(status().isOk());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeUpdate);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getScore()).isEqualTo(50);
  }

  @Test
  @Transactional
  public void updateNonExistingSkillRating() throws Exception {
    int databaseSizeBeforeUpdate = skillRatingRepository.findAll().size();

    // Create the SkillRating

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restSkillRatingMockMvc
        .perform(put("/api/skill-ratings").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(magicTransitionsRating)))
        .andExpect(status().isBadRequest());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deleteSkillRating() throws Exception {
    // Initialize the database
    skillRatingService.save(magicTransitionsRating);

    int databaseSizeBeforeDelete = skillRatingRepository.findAll().size();

    // Delete the skillRating
    restSkillRatingMockMvc.perform(delete("/api/skill-ratings/{id}", magicTransitionsRating.getId())
        .accept(TestUtil.APPLICATION_JSON)).andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
