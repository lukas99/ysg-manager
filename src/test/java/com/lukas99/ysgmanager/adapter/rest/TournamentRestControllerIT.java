package com.lukas99.ysgmanager.adapter.rest;

import static com.lukas99.ysgmanager.adapter.rest.TestUtil.createFormattingConversionService;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.YSG_2019;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.YSG_2019_DATE_DESCRIPTION;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.YSG_2020;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.YSG_2020_DATE_DESCRIPTION;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.ysg2019;
import static com.lukas99.ysgmanager.domain.TournamentTemplates.ysg2020;
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
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentRepository;
import com.lukas99.ysgmanager.domain.TournamentService;

/**
 * Integration tests for the {@link TournamentRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class TournamentRestControllerIT extends IntegrationTest {

  @Autowired
  private TournamentRepository tournamentRepository;

  @Autowired
  private TournamentService tournamentService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private ExceptionTranslator exceptionTranslator;

  @Autowired
  private Validator validator;

  private MockMvc restTournamentMockMvc;

  private Tournament ysg2019;
  private Tournament ysg2020;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final TournamentRestController tournamentRestController =
        new TournamentRestController(tournamentService);
    this.restTournamentMockMvc = MockMvcBuilders.standaloneSetup(tournamentRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setControllerAdvice(exceptionTranslator)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    ysg2019 = ysg2019();
    ysg2020 = ysg2020();
  }

  @Test
  @Transactional
  public void createTournament() throws Exception {
    int databaseSizeBeforeCreate = tournamentRepository.findAll().size();

    // Create the Tournament
    restTournamentMockMvc.perform(post("/api/tournaments").contentType(TestUtil.APPLICATION_JSON)
        .content(TestUtil.convertObjectToJsonBytes(ysg2019))).andExpect(status().isCreated());

    // Validate the Tournament in the database
    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeCreate + 1);
    Tournament testTournament = tournamentList.get(tournamentList.size() - 1);
    assertThat(testTournament.getName()).isEqualTo(YSG_2019);
    assertThat(testTournament.getDateDescription()).isEqualTo(YSG_2019_DATE_DESCRIPTION);
  }

  @Test
  @Transactional
  public void createTournamentWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = tournamentRepository.findAll().size();

    // Create the Tournament with an existing ID
    ysg2019.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restTournamentMockMvc
        .perform(post("/api/tournaments").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ysg2019)))
        .andExpect(status().isBadRequest());

    // Validate the Tournament in the database
    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeCreate);
  }

  @Test
  @Transactional
  public void checkNameIsRequired() throws Exception {
    int databaseSizeBeforeTest = tournamentRepository.findAll().size();
    // set the field null
    ysg2019.setName(null);

    // Create the Tournament, which fails.
    restTournamentMockMvc
        .perform(post("/api/tournaments").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ysg2019)))
        .andExpect(status().isBadRequest());

    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllTournaments() throws Exception {
    // Initialize the database
    tournamentRepository.saveAndFlush(ysg2019);
    tournamentRepository.saveAndFlush(ysg2020);

    // Get all the tournaments
    restTournamentMockMvc.perform(get("/api/tournaments?sort=id,desc")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(ysg2019.getId().intValue())))
        .andExpect(jsonPath("$.[0].name").value(is(YSG_2019)))
        .andExpect(jsonPath("$.[0].dateDescription").value(is(YSG_2019_DATE_DESCRIPTION)))
        .andExpect(jsonPath("$.[1].id").value(is(ysg2020.getId().intValue())))
        .andExpect(jsonPath("$.[1].name").value(is(YSG_2020)))
        .andExpect(jsonPath("$.[1].dateDescription").value(is(YSG_2020_DATE_DESCRIPTION)));
  }

  @Test
  @Transactional
  public void getTournament() throws Exception {
    // Initialize the database
    tournamentRepository.saveAndFlush(ysg2019);

    // Get the tournament
    restTournamentMockMvc.perform(get("/api/tournaments/{id}", ysg2019.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.id").value(ysg2019.getId().intValue()))
        .andExpect(jsonPath("$.name").value(YSG_2019))
        .andExpect(jsonPath("$.dateDescription").value(YSG_2019_DATE_DESCRIPTION));
  }

  @Test
  @Transactional
  public void getNonExistingTournament() throws Exception {
    // Get the tournament
    restTournamentMockMvc.perform(get("/api/tournaments/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updateTournament() throws Exception {
    // Initialize the database
    tournamentService.save(ysg2019);

    int databaseSizeBeforeUpdate = tournamentRepository.findAll().size();

    // Update the tournament
    Tournament updatedTournament = ysg2019().toBuilder().id(ysg2019.getId()).name("updatedName")
        .dateDescription("updatedDateDescription").build();

    restTournamentMockMvc
        .perform(put("/api/tournaments").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTournament)))
        .andExpect(status().isOk());

    // Validate the Tournament in the database
    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeUpdate);
    Tournament testTournament = tournamentList.get(tournamentList.size() - 1);
    assertThat(testTournament.getName()).isEqualTo("updatedName");
    assertThat(testTournament.getDateDescription()).isEqualTo("updatedDateDescription");
  }

  @Test
  @Transactional
  public void updateNonExistingTournament() throws Exception {
    int databaseSizeBeforeUpdate = tournamentRepository.findAll().size();

    // Create the Tournament

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restTournamentMockMvc
        .perform(put("/api/tournaments").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ysg2019)))
        .andExpect(status().isBadRequest());

    // Validate the Tournament in the database
    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deleteTournament() throws Exception {
    // Initialize the database
    tournamentService.save(ysg2019);

    int databaseSizeBeforeDelete = tournamentRepository.findAll().size();

    // Delete the tournament
    restTournamentMockMvc
        .perform(delete("/api/tournaments/{id}", ysg2019.getId()).accept(TestUtil.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Tournament> tournamentList = tournamentRepository.findAll();
    assertThat(tournamentList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
