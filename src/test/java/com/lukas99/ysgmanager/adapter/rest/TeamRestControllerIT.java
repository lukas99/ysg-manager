package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtil.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.TeamTemplates.EHC_ENGELBERG;
import static com.lukas99.ysgmanager.domain.TeamTemplates.EHC_ENGELBERG_LOGO;
import static com.lukas99.ysgmanager.domain.TeamTemplates.SC_BERN;
import static com.lukas99.ysgmanager.domain.TeamTemplates.SC_BERN_LOGO;
import static com.lukas99.ysgmanager.domain.TeamTemplates.ehcEngelberg;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.ysg2019;
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
import java.io.UnsupportedEncodingException;
import java.util.Base64;
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
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamRepository;
import com.lukas99.ysgmanager.domain.TeamService;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;

/**
 * Integration tests for the {@link TeamRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class TeamRestControllerIT extends IntegrationTest {

  @Autowired
  private TeamRepository teamRepository;

  @Autowired
  private TeamService teamService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  @Autowired
  private Validator validator;

  private MockMvc restTeamMockMvc;

  private Team ehcEngelberg;
  private Team scBern;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final TeamRestController teamRestController = new TeamRestController(teamService);
    this.restTeamMockMvc = MockMvcBuilders.standaloneSetup(teamRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = ysg2019(em);
    ehcEngelberg = ehcEngelberg(ysg2019);
    scBern = TeamTemplates.scBern(ysg2019);
  }

  @Test
  @Transactional
  public void createTeam() throws Exception {
    int databaseSizeBeforeCreate = teamRepository.findAll().size();

    // Create the Team
    restTeamMockMvc
        .perform(post("/api/teams").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ehcEngelberg)))
        .andExpect(status().isCreated());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeCreate + 1);
    Team testTeam = teamList.get(teamList.size() - 1);
    assertThat(testTeam.getName()).isEqualTo(EHC_ENGELBERG);
    assertThat(testTeam.getLogo()).isEqualTo(EHC_ENGELBERG_LOGO);
  }

  @Test
  @Transactional
  public void createTeamWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = teamRepository.findAll().size();

    // Create the Team with an existing ID
    ehcEngelberg.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restTeamMockMvc
        .perform(post("/api/teams").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ehcEngelberg)))
        .andExpect(status().isBadRequest());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeCreate);
  }


  @Test
  @Transactional
  public void checkNameIsRequired() throws Exception {
    int databaseSizeBeforeTest = teamRepository.findAll().size();
    // set the field null
    ehcEngelberg.setName(null);

    // Create the Team, which fails.

    restTeamMockMvc
        .perform(post("/api/teams").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ehcEngelberg)))
        .andExpect(status().isBadRequest());

    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllTeams() throws Exception {
    // Initialize the database
    teamRepository.saveAndFlush(ehcEngelberg);
    teamRepository.saveAndFlush(scBern);

    // Get all the teamList
    restTeamMockMvc.perform(get("/api/teams?sort=id,desc")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(ehcEngelberg.getId().intValue())))
        .andExpect(jsonPath("$.[0].name").value(is(TeamTemplates.EHC_ENGELBERG)))
        .andExpect(jsonPath("$.[0].logo").value(is(getBase64EncodedString(EHC_ENGELBERG_LOGO))))
        .andExpect(jsonPath("$.[1].id").value(is(scBern.getId().intValue())))
        .andExpect(jsonPath("$.[1].name").value(is(SC_BERN)))
        .andExpect(jsonPath("$.[1].logo").value(is(getBase64EncodedString(SC_BERN_LOGO))));
  }

  @Test
  @Transactional
  public void getTeam() throws Exception {
    // Initialize the database
    teamRepository.saveAndFlush(ehcEngelberg);

    // Get the team
    restTeamMockMvc.perform(get("/api/teams/{id}", ehcEngelberg.getId())).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.id").value(ehcEngelberg.getId().intValue()))
        .andExpect(jsonPath("$.name").value(EHC_ENGELBERG))
        .andExpect(jsonPath("$.logo").value(getBase64EncodedString(EHC_ENGELBERG_LOGO)));
  }

  private String getBase64EncodedString(byte[] object) throws UnsupportedEncodingException {
    return new String(Base64.getEncoder().encode(object), "UTF8");
  }

  @Test
  @Transactional
  public void getNonExistingTeam() throws Exception {
    // Get the team
    restTeamMockMvc.perform(get("/api/teams/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updateTeam() throws Exception {
    // Initialize the database
    teamService.save(ehcEngelberg);

    int databaseSizeBeforeUpdate = teamRepository.findAll().size();

    // Update the team
    Team updatedTeam = ehcEngelberg.toBuilder().name("HC Engelberg").logo(null).build();

    restTeamMockMvc.perform(put("/api/teams").contentType(TestUtil.APPLICATION_JSON)
        .content(TestUtil.convertObjectToJsonBytes(updatedTeam))).andExpect(status().isOk());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeUpdate);
    Team testTeam = teamList.get(teamList.size() - 1);
    assertThat(testTeam.getName()).isEqualTo("HC Engelberg");
    assertThat(testTeam.getLogo()).isNull();
  }

  @Test
  @Transactional
  public void updateNonExistingTeam() throws Exception {
    int databaseSizeBeforeUpdate = teamRepository.findAll().size();

    // Create the Team

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restTeamMockMvc
        .perform(put("/api/teams").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ehcEngelberg)))
        .andExpect(status().isBadRequest());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deleteTeam() throws Exception {
    // Initialize the database
    teamService.save(ehcEngelberg);

    int databaseSizeBeforeDelete = teamRepository.findAll().size();

    // Delete the team
    restTeamMockMvc
        .perform(delete("/api/teams/{id}", ehcEngelberg.getId()).accept(TestUtil.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
