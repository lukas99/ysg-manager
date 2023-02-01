package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.domain.PlayerPosition.SKATER;
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
import com.lukas99.ysgmanager.domain.PlayerRepository;
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
import com.lukas99.ysgmanager.domain.TeamService;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
  private PlayerRepository playerRepository;

  @Autowired
  private TeamService teamService;

  @Autowired
  private EntityManager em;

  private MockMvc restSkillRatingMockMvc;

  private Team ehcEngelberg;
  private Team scBern;
  private Player romanJosi;
  private Player martinGerber;
  private Player timoMeier;
  private Skill magicTransitions;
  private Skill controlledJumble;
  private SkillRating magicTransitionsRating;
  private SkillRating controlledJumbleRating;
  private SkillRatingModel magicTransitionsRatingModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
    final SkillRatingRestController skillRatingRestController =
        new SkillRatingRestController(skillRatingService, playerService, skillService, teamService);
    this.restSkillRatingMockMvc =
        MockMvcBuilders.standaloneSetup(skillRatingRestController).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    scBern = TeamTemplates.scBern(ysg2019, em);
    romanJosi = PlayerTemplates.romanJosi(ehcEngelberg, em);
    martinGerber = PlayerTemplates.martinGerber(ehcEngelberg, em);
    timoMeier = PlayerTemplates.timoMeier(scBern, em);
    magicTransitions = SkillTemplates.magicTransitions(ysg2019, em);
    controlledJumble = SkillTemplates.controlledJumble(ysg2019, em);
    magicTransitionsRating = magicTransitionsRating(magicTransitions, romanJosi);
    controlledJumbleRating = controlledJumbleRating(controlledJumble, martinGerber);
    magicTransitionsRatingModel = new SkillRatingModelAssembler().toModel(magicTransitionsRating);
  }

  @Test
  @Transactional
  public void createSkillRatingByPlayer() throws Exception {
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
  public void createSkillRatingBySkill() throws Exception {
    int databaseSizeBeforeCreate = skillRatingRepository.findAll().size();

    // Create the SkillRating
    restSkillRatingMockMvc
        .perform(post("/api/skills/{skillId}/skill-ratings", magicTransitions.getId())
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
  public void createSkillRatingBySkill_createPlayerIfNotExists() throws Exception {
    var player = Player.builder().position(SKATER).shirtNumber(99).team(ehcEngelberg).build();
    var skillRating1 = magicTransitionsRating(magicTransitions, player);
    var skillRating2 = controlledJumbleRating(controlledJumble, player);
    var skillRatingModel1 = new SkillRatingModelAssembler().toModel(skillRating1);
    var skillRatingModel2 = new SkillRatingModelAssembler().toModel(skillRating2);
    var skillLink1 = skillRatingModel1.getRequiredLink("skill");
    var skillLink2 = skillRatingModel2.getRequiredLink("skill");
    // remove player link, it must not be available because player doesn't exist yet
    skillRatingModel1 = skillRatingModel1.removeLinks().add(skillLink1);
    skillRatingModel2 = skillRatingModel2.removeLinks().add(skillLink2);

    int databaseSizeBeforeCreate = skillRatingRepository.findAll().size();
    int playerAmountBeforeCreate = playerRepository.findAll().size();

    // Create a SkillRating -> player doesn't exist yet and will be created
    restSkillRatingMockMvc
        .perform(post("/api/skills/{skillId}/skill-ratings", magicTransitions.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(skillRatingModel1)))
        .andExpect(status().isOk());

    // Validate that player was created in the database
    List<Player> playerRatingList = playerRepository.findAll();
    assertThat(playerRatingList).hasSize(playerAmountBeforeCreate + 1);
    Player createdPlayer = playerRatingList.get(playerRatingList.size() - 1);
    assertThat(createdPlayer.getFirstName()).isNull();
    assertThat(createdPlayer.getLastName()).isNull();
    assertThat(createdPlayer.getShirtNumber()).isEqualTo(player.getShirtNumber());
    assertThat(createdPlayer.getPosition()).isEqualTo(player.getPosition());
    assertThat(createdPlayer.getTeam()).isEqualTo(ehcEngelberg);

    // Validate the first SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeCreate + 1);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getPlayer().getId()).isEqualTo(createdPlayer.getId());
    assertThat(testSkillRating.getSkill()).isEqualTo(magicTransitions);
    assertThat(testSkillRating.getScore()).isEqualTo(SkillRatingTemplates.NINTY);

    // Create another SkillRating for same player -> player exists and will be loaded by NK
    restSkillRatingMockMvc
        .perform(post("/api/skills/{skillId}/skill-ratings", controlledJumble.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(skillRatingModel2)))
        .andExpect(status().isOk());

    // Validate that player was not created one more time
    playerRatingList = playerRepository.findAll();
    assertThat(playerRatingList).hasSize(playerAmountBeforeCreate + 1);

    // Validate the second SkillRating in the database
    skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeCreate + 2);
    testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getPlayer().getId()).isEqualTo(createdPlayer.getId());
    assertThat(testSkillRating.getSkill()).isEqualTo(controlledJumble);
    assertThat(testSkillRating.getScore()).isEqualTo(SkillRatingTemplates.EIGHTY);
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
        .andExpect(
            jsonPath("$.content.[0].score").value(is(SkillRatingTemplates.NINTY.doubleValue())))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skill-ratings/" + magicTransitionsRating.getId())));
  }

  @Test
  @Transactional
  public void getSkillRatingsOfSkillAndTeam() throws Exception {
    // EHC Engelberg
    var magicTransitionsRating1 = magicTransitionsRating(magicTransitions, romanJosi);
    var magicTransitionsRating2 = magicTransitionsRating(magicTransitions, martinGerber);
    // SC Bern
    var magicTransitionsRating3 = magicTransitionsRating(magicTransitions, timoMeier);

    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating1);
    skillRatingRepository.saveAndFlush(magicTransitionsRating2);
    skillRatingRepository.saveAndFlush(magicTransitionsRating3);

    // Get all the skillRatings of a skill
    restSkillRatingMockMvc
        .perform(get("/api/skills/{skillId}/skill-ratings?teamId={teamId}",
            magicTransitions.getId(), ehcEngelberg.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].player.firstName")
            .value(is(romanJosi.getFirstName())))
        .andExpect(jsonPath("$.content.[0].player.lastName")
            .value(is(romanJosi.getLastName())))
        .andExpect(jsonPath("$.content.[0].player.team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[1].player.firstName")
            .value(is(martinGerber.getFirstName())))
        .andExpect(jsonPath("$.content.[1].player.lastName")
            .value(is(martinGerber.getLastName())))
        .andExpect(jsonPath("$.content.[1].player.team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.content.[1].links", hasSize(3)));
  }

  @Test
  @Transactional
  public void getSkillRatingsOfSkillAndTeamAndPlayerShirtNumber() throws Exception {
    var magicTransitionsRating1 = magicTransitionsRating(magicTransitions, romanJosi);
    var magicTransitionsRating2 = magicTransitionsRating(magicTransitions, martinGerber);

    // Initialize the database
    skillRatingRepository.saveAndFlush(magicTransitionsRating1);
    skillRatingRepository.saveAndFlush(magicTransitionsRating2);

    // Get all the skillRatings of a skill for a player with a given shirt number
    restSkillRatingMockMvc
        .perform(
            get("/api/skills/{skillId}/skill-ratings?teamId={teamId}&playerShirtNumber={shirtNumber}",
                magicTransitions.getId(), ehcEngelberg.getId(), romanJosi.getShirtNumber()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content.[0].player.firstName")
            .value(is(romanJosi.getFirstName())))
        .andExpect(jsonPath("$.content.[0].player.lastName")
            .value(is(romanJosi.getLastName())))
        .andExpect(jsonPath("$.content.[0].player.team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)));
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
        .andExpect(jsonPath("$.content.[0].score").value(SkillRatingTemplates.EIGHTY.doubleValue()))
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
        .andExpect(jsonPath("$.score").value(SkillRatingTemplates.NINTY.doubleValue()))
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
    magicTransitionsRatingModel.setScore(new BigDecimal("50.00"));

    restSkillRatingMockMvc.perform(
            put("/api/skill-ratings/{id}", magicTransitionsRating.getId())
                .contentType(TestUtils.APPLICATION_JSON)
                .content(TestUtils.convertObjectToJsonBytes(magicTransitionsRatingModel)))
        .andExpect(status().isOk());

    // Validate the SkillRating in the database
    List<SkillRating> skillRatingList = skillRatingRepository.findAll();
    assertThat(skillRatingList).hasSize(databaseSizeBeforeUpdate);
    SkillRating testSkillRating = skillRatingList.get(skillRatingList.size() - 1);
    assertThat(testSkillRating.getScore().toString()).isEqualTo("50.00");
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
