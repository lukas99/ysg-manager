package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtils.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.SkillRatingTemplates.controlledJumbleRating;
import static com.lukas99.ysgmanager.domain.SkillRatingTemplates.magicTransitionsRating;
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

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRating;
import com.lukas99.ysgmanager.domain.SkillRatingRepository;
import com.lukas99.ysgmanager.domain.SkillRatingService;
import com.lukas99.ysgmanager.domain.SkillRatingTemplates;
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
 * Integration tests for the {@link SkillRatingRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class SkillRatingRestControllerIT extends IntegrationTest {

  @Autowired
  private SkillRatingRepository skillRatingRepository;

  @Autowired
  private SkillRatingService skillRatingService;

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

  private MockMvc restSkillRatingMockMvc;

  private Player romanJosi;
  private Player martinGerber;
  private Skill magicTransitions;
  private SkillRating magicTransitionsRating;
  private SkillRating controlledJumbleRating;
  private SkillRatingModel magicTransitionsRatingModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final SkillRatingRestController skillRatingRestController =
        new SkillRatingRestController(skillRatingService, playerService, skillService);
    this.restSkillRatingMockMvc = MockMvcBuilders.standaloneSetup(skillRatingRestController)
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
    Skill controlledJumble = SkillTemplates.controlledJumble(ysg2019, em);
    magicTransitionsRating = magicTransitionsRating(magicTransitions, romanJosi);
    controlledJumbleRating = controlledJumbleRating(controlledJumble, martinGerber);
    magicTransitionsRatingModel = new SkillRatingModelAssembler().toModel(magicTransitionsRating);
  }

  @Test
  @Transactional
  public void createSkillRating() throws Exception {
    int databaseSizeBeforeCreate = skillRatingRepository.findAll().size();

    // Create the SkillRating
    restSkillRatingMockMvc.perform(post("/api/players/{playerId}/skill-ratings", romanJosi.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsRatingModel)))
        .andExpect(status().isOk());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeCreate + 1);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getPlayer()).isEqualTo(romanJosi);
    assertThat(testSkillRating.getSkill()).isEqualTo(magicTransitions);
    assertThat(testSkillRating.getScore()).isEqualTo(SkillRatingTemplates.NINTY);
  }

  @Test
  @Transactional
  public void checkScoreIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRatingRepository.findAll().size();
    // set the field null
    magicTransitionsRatingModel.setScore(null);

    // Create the SkillRating, which fails.
    restSkillRatingMockMvc.perform(post("/api/players/{playerId}/skill-ratings", romanJosi.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(magicTransitionsRatingModel)))
        .andExpect(status().isBadRequest());

    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getSkillRatingsOfSkill() throws Exception {
    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating);
    skillRatingRepository.saveAndFlush(controlledJumbleRating);

    // Get all the skillRatings of a skill
    restSkillRatingMockMvc
        .perform(get("/api/skills/{skillId}/skill-ratings", magicTransitions.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content.[0].score").value(is(SkillRatingTemplates.NINTY)))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skill-ratings/" + magicTransitionsRating.getId())));
  }

  @Test
  @Transactional
  public void getSkillRatingsOfPlayer() throws Exception {
    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating);
    skillRatingRepository.saveAndFlush(controlledJumbleRating);

    // Get all the skillRatings of a player
    restSkillRatingMockMvc
        .perform(get("/api/players/{playerId}/skill-ratings", martinGerber.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content.[0].score").value(SkillRatingTemplates.EIGHTY))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skill-ratings/" + controlledJumbleRating.getId())));
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
        .andExpect(jsonPath("$.score").value(SkillRatingTemplates.NINTY))
        .andExpect(jsonPath("$.links", hasSize(3)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href",
            endsWith("/skill-ratings/" + magicTransitionsRating.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("player")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/players/" + romanJosi.getId())))
        .andExpect(jsonPath("$.links.[2].rel").value(is("skill")))
        .andExpect(jsonPath("$.links.[2].href", endsWith("/skills/" + magicTransitions.getId())));
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
    magicTransitionsRatingModel.setScore(50);

    restSkillRatingMockMvc.perform(
        put("/api/skill-ratings/{id}", magicTransitionsRating.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(magicTransitionsRatingModel)))
        .andExpect(status().isOk());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeUpdate);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getScore()).isEqualTo(50);
  }

  @Test
  @Transactional
  public void deleteSkillRating() throws Exception {
    // Initialize the database
    skillRatingService.save(magicTransitionsRating);

    int databaseSizeBeforeDelete = skillRatingRepository.findAll().size();

    // Delete the skillRating
    restSkillRatingMockMvc
        .perform(delete("/api/skill-ratings/{id}", magicTransitionsRating.getId())
            .accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeDelete - 1);
  }

}
