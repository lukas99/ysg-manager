package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtils.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.TeamTemplates.EHC_ENGELBERG;
import static com.lukas99.ysgmanager.domain.TeamTemplates.EHC_ENGELBERG_LOGO;
import static com.lukas99.ysgmanager.domain.TeamTemplates.SC_BERN;
import static com.lukas99.ysgmanager.domain.TeamTemplates.SC_BERN_LOGO;
import static com.lukas99.ysgmanager.domain.TeamTemplates.ehcEngelberg;
import static com.lukas99.ysgmanager.domain.TeamTemplates.scBern;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.ysg2019;
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

import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamRepository;
import com.lukas99.ysgmanager.domain.TeamService;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
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
  private TournamentService tournamentService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  private MockMvc restTeamMockMvc;

  private Tournament ysg2019;
  private Team ehcEngelberg;
  private Team scBern;
  private TeamModel ehcEngelbergModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final TeamRestController teamRestController =
        new TeamRestController(teamService, tournamentService);
    this.restTeamMockMvc = MockMvcBuilders.standaloneSetup(teamRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter)
        .build();
  }

  @BeforeEach
  public void initTest() {
    ysg2019 = ysg2019(em);
    ehcEngelberg = ehcEngelberg(ysg2019);
    scBern = scBern(ysg2019);
    ehcEngelbergModel = new TeamModelAssembler().toModel(ehcEngelberg);
  }

  @Test
  @Transactional
  public void createTeam() throws Exception {
    int databaseSizeBeforeCreate = teamRepository.findAll().size();

    // Create the Team
    restTeamMockMvc.perform(post("/api/tournaments/{tournamentId}/teams", ysg2019.getId())
        .contentType(TestUtils.APPLICATION_JSON)
        .content(TestUtils.convertObjectToJsonBytes(ehcEngelbergModel)))
        .andExpect(status().isOk());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeCreate + 1);
    Team testTeam = teamList.get(teamList.size() - 1);
    assertThat(testTeam.getName()).isEqualTo(EHC_ENGELBERG);
    assertThat(testTeam.getLogo()).isEqualTo(EHC_ENGELBERG_LOGO);
    assertThat(testTeam.getTournament()).isEqualTo(ysg2019);
  }

  @Test
  @Transactional
  public void checkNameIsRequired() throws Exception {
    int databaseSizeBeforeTest = teamRepository.findAll().size();
    // set the field null
    ehcEngelberg.setName(null);

    // Create the Team, which fails.
    restTeamMockMvc
        .perform(post("/api/tournaments/" + ysg2019.getId() + "/teams")
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(ehcEngelberg)))
        .andExpect(status().isBadRequest());

    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getTeamsOfTournament() throws Exception {
    // Initialize the database
    teamRepository.saveAndFlush(ehcEngelberg);
    teamRepository.saveAndFlush(scBern);

    // Get all the teams of a tournament
    restTeamMockMvc.perform(get("/api/tournaments/{tournamentId}/teams", ysg2019.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].name").value(is(TeamTemplates.EHC_ENGELBERG)))
        .andExpect(jsonPath("$.content.[0].logo")
            .value(is(getBase64EncodedString(EHC_ENGELBERG_LOGO))))
        .andExpect(jsonPath("$.content.[0].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/teams/" + ehcEngelberg.getId())))
        .andExpect(jsonPath("$.content.[1].name").value(is(SC_BERN)))
        .andExpect(jsonPath("$.content.[1].logo").value(is(getBase64EncodedString(SC_BERN_LOGO))))
        .andExpect(jsonPath("$.content.[1].links", hasSize(3)))
        .andExpect(jsonPath("$.content.[1].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[1].links.[0].href", endsWith("/teams/" + scBern.getId())));
  }

  @Test
  @Transactional
  public void getTeam() throws Exception {
    // Initialize the database
    teamRepository.saveAndFlush(ehcEngelberg);

    // Get the team
    restTeamMockMvc.perform(get("/api/teams/{id}", ehcEngelberg.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.name").value(EHC_ENGELBERG))
        .andExpect(jsonPath("$.logo").value(getBase64EncodedString(EHC_ENGELBERG_LOGO)))
        .andExpect(jsonPath("$.links", hasSize(3)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href", endsWith("/teams/" + ehcEngelberg.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("tournament")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/tournaments/" + ysg2019.getId())))
        .andExpect(jsonPath("$.links.[2].rel").value(is("players")))
        .andExpect(jsonPath("$.links.[2].href",
            endsWith("/teams/" + ehcEngelberg.getId() + "/players")));
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
    ehcEngelbergModel.setName("HC Engelberg");
    ehcEngelbergModel.setLogo(null);

    restTeamMockMvc
        .perform(put("/api/teams/{id}", ehcEngelberg.getId()).contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(ehcEngelbergModel)))
        .andExpect(status().isOk());

    // Validate the Team in the database
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeUpdate);
    Team testTeam = teamList.get(teamList.size() - 1);
    assertThat(testTeam.getName()).isEqualTo("HC Engelberg");
    assertThat(testTeam.getLogo()).isNull();
  }

  @Test
  @Transactional
  public void deleteTeam() throws Exception {
    // Initialize the database
    teamService.save(ehcEngelberg);

    int databaseSizeBeforeDelete = teamRepository.findAll().size();

    // Delete the team
    restTeamMockMvc
        .perform(delete("/api/teams/{id}", ehcEngelberg.getId()).accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Team> teamList = teamRepository.findAll();
    assertThat(teamList).hasSize(databaseSizeBeforeDelete - 1);
  }

}
