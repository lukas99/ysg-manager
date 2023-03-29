package com.lukas99.ysgmanager.adapter.rest;

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

import com.lukas99.ysgmanager.domain.PlayerPosition;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRepository;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.SkillTemplates;
import com.lukas99.ysgmanager.domain.SkillType;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import com.lukas99.ysgmanager.domain.TournamentTemplates;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import jakarta.persistence.EntityManager;
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
  private EntityManager em;

  private MockMvc restSkillMockMvc;

  private Tournament ysg2019;
  private Skill magicTransitions;
  private Skill bestShot;
  private SkillModel magicTransitionsModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
    final SkillRestController skillRestController =
        new SkillRestController(skillService, tournamentService);
    this.restSkillMockMvc = MockMvcBuilders.standaloneSetup(skillRestController).build();
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
    assertThat(testSkill.getTypeForPlayers()).isEqualTo(SkillType.TIME_WITH_RATING);
    assertThat(testSkill.getTypeForGoaltenders()).isEqualTo(SkillType.TIME_WITH_RATING);
    assertThat(testSkill.getTournamentRankingPlayerPosition()).isEqualTo(PlayerPosition.SKATER);
    assertThat(testSkill.getName()).isEqualTo(SkillTemplates.MAGIC_TRANSITIONS);
    assertThat(testSkill.getNumber()).isEqualTo(SkillTemplates.ONE);
    assertThat(testSkill.getTournament()).isEqualTo(ysg2019);
  }

  @Test
  @Transactional
  public void checkSkillTypeForPlayersIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitionsModel.setTypeForPlayers(null);

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
  public void checkSkillTypeForGoaltendersIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitionsModel.setTypeForGoaltenders(null);

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
  public void checkTournamentRankingPlayerPositionIsRequired() throws Exception {
    int databaseSizeBeforeTest = skillRepository.findAll().size();
    // set the field null
    magicTransitionsModel.setTournamentRankingPlayerPosition(null);

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
        .andExpect(jsonPath("$.content.[0].id").value(is(magicTransitions.getId().intValue())))
        .andExpect(jsonPath("$.content.[0].typeForPlayers").value(
            is(SkillType.TIME_WITH_RATING.toString())))
        .andExpect(jsonPath("$.content.[0].typeForGoaltenders").value(
            is(SkillType.TIME_WITH_RATING.toString())))
        .andExpect(jsonPath("$.content.[0].tournamentRankingPlayerPosition").value(
            is(PlayerPosition.SKATER.toString())))
        .andExpect(jsonPath("$.content.[0].name").value(is(SkillTemplates.MAGIC_TRANSITIONS)))
        .andExpect(jsonPath("$.content.[0].number").value(is(SkillTemplates.ONE)))
        .andExpect(jsonPath("$.content.[0].links", hasSize(8)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/skills/" + magicTransitions.getId())))
        .andExpect(jsonPath("$.content.[1].id").value(is(bestShot.getId().intValue())))
        .andExpect(jsonPath("$.content.[1].typeForPlayers").value(
            is(SkillType.POINTS.toString())))
        .andExpect(jsonPath("$.content.[1].typeForGoaltenders").value(
            is(SkillType.POINTS.toString())))
        .andExpect(jsonPath("$.content.[1].tournamentRankingPlayerPosition").value(
            is(PlayerPosition.SKATER.toString())))
        .andExpect(jsonPath("$.content.[1].name").value(is(SkillTemplates.BEST_SHOT)))
        .andExpect(jsonPath("$.content.[1].number").value(is(SkillTemplates.TWO)))
        .andExpect(jsonPath("$.content.[1].links", hasSize(8)))
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
        .andExpect(jsonPath("$.id").value(magicTransitions.getId().intValue()))
        .andExpect(jsonPath("$.typeForPlayers").value(SkillType.TIME_WITH_RATING.toString()))
        .andExpect(jsonPath("$.typeForGoaltenders").value(SkillType.TIME_WITH_RATING.toString()))
        .andExpect(
            jsonPath("$.tournamentRankingPlayerPosition").value(PlayerPosition.SKATER.toString()))
        .andExpect(jsonPath("$.name").value(SkillTemplates.MAGIC_TRANSITIONS))
        .andExpect(jsonPath("$.number").value(SkillTemplates.ONE))
        .andExpect(jsonPath("$.links", hasSize(8)))

        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href", endsWith("/skills/" + magicTransitions.getId())))

        .andExpect(jsonPath("$.links.[1].rel").value(is("tournament")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/tournaments/" + ysg2019.getId())))

        .andExpect(jsonPath("$.links.[2].rel").value(is("skillresults")))
        .andExpect(jsonPath("$.links.[2].href",
            endsWith("/skills/" + magicTransitions.getId() + "/skill-results")))

        .andExpect(jsonPath("$.links.[3].rel").value(is("skillResultsByTeam")))
        .andExpect(jsonPath("$.links.[3].href",
            endsWith("/skills/%s/skill-results?teamId=%s".formatted(
                magicTransitions.getId(), URLEncoder.encode(":teamId", StandardCharsets.UTF_8)))))

        .andExpect(jsonPath("$.links.[4].rel").value(is("skillResultsByTeamAndPlayerShirtNumber")))
        .andExpect(jsonPath("$.links.[4].href",
            endsWith("/skills/%s/skill-results?teamId=%s&playerShirtNumber=%s".formatted(
                magicTransitions.getId(), URLEncoder.encode(":teamId", StandardCharsets.UTF_8),
                URLEncoder.encode(":playerShirtNumber", StandardCharsets.UTF_8)))))

        .andExpect(jsonPath("$.links.[5].rel").value(is("skillratings")))
        .andExpect(jsonPath("$.links.[5].href",
            endsWith("/skills/" + magicTransitions.getId() + "/skill-ratings")))

        .andExpect(jsonPath("$.links.[6].rel").value(is("skillRatingsByTeam")))
        .andExpect(jsonPath("$.links.[6].href",
            endsWith("/skills/%s/skill-ratings?teamId=%s".formatted(
                magicTransitions.getId(), URLEncoder.encode(":teamId", StandardCharsets.UTF_8)))))

        .andExpect(jsonPath("$.links.[7].rel").value(is("skillRatingsByTeamAndPlayerShirtNumber")))
        .andExpect(jsonPath("$.links.[7].href",
            endsWith("/skills/%s/skill-ratings?teamId=%s&playerShirtNumber=%s".formatted(
                magicTransitions.getId(), URLEncoder.encode(":teamId", StandardCharsets.UTF_8),
                URLEncoder.encode(":playerShirtNumber", StandardCharsets.UTF_8)))))
    ;
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
    magicTransitionsModel.setTypeForPlayers(SkillType.TIME_WITH_POINTS);
    magicTransitionsModel.setTypeForGoaltenders(SkillType.RATING);
    magicTransitionsModel.setTournamentRankingPlayerPosition(PlayerPosition.GOALTENDER);
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
    assertThat(testSkill.getTypeForPlayers()).isEqualTo(SkillType.TIME_WITH_POINTS);
    assertThat(testSkill.getTypeForGoaltenders()).isEqualTo(SkillType.RATING);
    assertThat(testSkill.getTournamentRankingPlayerPosition()).isEqualTo(PlayerPosition.GOALTENDER);
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

  @Test
  @Transactional
  public void calculateSkillRankings() throws Exception {
    skillService.save(magicTransitions);
    skillService.save(bestShot);

    // just check the availability of the REST service and the response code
    // there is a separate test which checks the ranking calculation itself
    restSkillMockMvc.perform(
            post("/api/tournaments/{tournamentId}/skills/calculate-rankings",
                ysg2019.getId()).accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isAccepted());
  }

}
