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
import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerPosition;
import com.lukas99.ysgmanager.domain.PlayerRepository;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;

/**
 * Integration tests for the {@link PlayerRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class PlayerRestControllerIT extends IntegrationTest {

  @Autowired
  private PlayerRepository playerRepository;

  @Autowired
  private PlayerService playerService;

  @Autowired
  private MappingJackson2HttpMessageConverter jacksonMessageConverter;

  @Autowired
  private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

  @Autowired
  private EntityManager em;

  @Autowired
  private Validator validator;

  private MockMvc restPlayerMockMvc;

  private Player romanJosi;
  private Player martinGerber;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.initMocks(this);
    final PlayerRestController playerRestController = new PlayerRestController(playerService);
    this.restPlayerMockMvc = MockMvcBuilders.standaloneSetup(playerRestController)
        .setCustomArgumentResolvers(pageableArgumentResolver)
        .setConversionService(createFormattingConversionService())
        .setMessageConverters(jacksonMessageConverter).setValidator(validator).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    Team ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    romanJosi = PlayerTemplates.romanJosi(ehcEngelberg);
    martinGerber = PlayerTemplates.martinGerber(ehcEngelberg);
  }

  @Test
  @Transactional
  public void createPlayer() throws Exception {
    int databaseSizeBeforeCreate = playerRepository.findAll().size();

    // Create the Player
    restPlayerMockMvc.perform(post("/api/players").contentType(TestUtil.APPLICATION_JSON)
        .content(TestUtil.convertObjectToJsonBytes(romanJosi))).andExpect(status().isCreated());

    // Validate the Player in the database
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeCreate + 1);
    Player testPlayer = playerList.get(playerList.size() - 1);
    assertThat(testPlayer.getFirstName()).isEqualTo(PlayerTemplates.ROMAN);
    assertThat(testPlayer.getLastName()).isEqualTo(PlayerTemplates.JOSI);
    assertThat(testPlayer.getShirtNumber()).isEqualTo(PlayerTemplates.FIFITY_NINE);
    assertThat(testPlayer.getPosition()).isEqualTo(PlayerPosition.SKATER);
  }

  @Test
  @Transactional
  public void createPlayerWithExistingId() throws Exception {
    int databaseSizeBeforeCreate = playerRepository.findAll().size();

    // Create the Player with an existing ID
    romanJosi.setId(1L);

    // An entity with an existing ID cannot be created, so this API call must fail
    restPlayerMockMvc
        .perform(post("/api/players").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(romanJosi)))
        .andExpect(status().isBadRequest());

    // Validate the Player in the database
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeCreate);
  }


  @Test
  @Transactional
  public void checkShirtNumberIsRequired() throws Exception {
    int databaseSizeBeforeTest = playerRepository.findAll().size();
    // set the field null
    romanJosi.setShirtNumber(null);

    // Create the Player, which fails.
    restPlayerMockMvc
        .perform(post("/api/players").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(romanJosi)))
        .andExpect(status().isBadRequest());

    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void checkPositionIsRequired() throws Exception {
    int databaseSizeBeforeTest = playerRepository.findAll().size();
    // set the field null
    romanJosi.setPosition(null);

    // Create the Player, which fails.
    restPlayerMockMvc
        .perform(post("/api/players").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(romanJosi)))
        .andExpect(status().isBadRequest());

    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getAllPlayers() throws Exception {
    // Initialize the database
    playerRepository.saveAndFlush(romanJosi);
    playerRepository.saveAndFlush(martinGerber);

    // Get all the players
    restPlayerMockMvc.perform(get("/api/players?sort=id,desc")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[0].id").value(is(martinGerber.getId().intValue())))
        .andExpect(jsonPath("$.[0].firstName").value(is(PlayerTemplates.MARTIN)))
        .andExpect(jsonPath("$.[0].lastName").value(is(PlayerTemplates.GERBER)))
        .andExpect(jsonPath("$.[0].shirtNumber").value(is(PlayerTemplates.TWENTY_NINE)))
        .andExpect(jsonPath("$.[0].position").value(is(PlayerPosition.GOALTENDER.toString())))
        .andExpect(jsonPath("$.[1].id").value(is(romanJosi.getId().intValue())))
        .andExpect(jsonPath("$.[1].firstName").value(is(PlayerTemplates.ROMAN)))
        .andExpect(jsonPath("$.[1].lastName").value(is(PlayerTemplates.JOSI)))
        .andExpect(jsonPath("$.[1].shirtNumber").value(is(PlayerTemplates.FIFITY_NINE)))
        .andExpect(jsonPath("$.[1].position").value(is(PlayerPosition.SKATER.toString())));
  }

  @Test
  @Transactional
  public void getPlayer() throws Exception {
    // Initialize the database
    playerRepository.saveAndFlush(romanJosi);

    // Get the player
    restPlayerMockMvc.perform(get("/api/players/{id}", romanJosi.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.id").value(romanJosi.getId().intValue()))
        .andExpect(jsonPath("$.firstName").value(PlayerTemplates.ROMAN))
        .andExpect(jsonPath("$.lastName").value(PlayerTemplates.JOSI))
        .andExpect(jsonPath("$.shirtNumber").value(PlayerTemplates.FIFITY_NINE))
        .andExpect(jsonPath("$.position").value(is(PlayerPosition.SKATER.toString())));
  }

  @Test
  @Transactional
  public void getNonExistingPlayer() throws Exception {
    // Get the player
    restPlayerMockMvc.perform(get("/api/players/{id}", Long.MAX_VALUE))
        .andExpect(status().isNotFound());
  }

  @Test
  @Transactional
  public void updatePlayer() throws Exception {
    // Initialize the database
    playerService.save(romanJosi);

    int databaseSizeBeforeUpdate = playerRepository.findAll().size();

    // Update the player
    Player updatedPlayer = romanJosi.toBuilder().firstName("updatedFirstName")
        .lastName("updatedLastName").shirtNumber(99).position(PlayerPosition.GOALTENDER).build();

    restPlayerMockMvc.perform(put("/api/players").contentType(TestUtil.APPLICATION_JSON)
        .content(TestUtil.convertObjectToJsonBytes(updatedPlayer))).andExpect(status().isOk());

    // Validate the Player in the database
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    Player testPlayer = playerList.get(playerList.size() - 1);
    assertThat(testPlayer.getFirstName()).isEqualTo("updatedFirstName");
    assertThat(testPlayer.getLastName()).isEqualTo("updatedLastName");
    assertThat(testPlayer.getShirtNumber()).isEqualTo(99);
    assertThat(testPlayer.getPosition()).isEqualTo(PlayerPosition.GOALTENDER);
  }

  @Test
  @Transactional
  public void updateNonExistingPlayer() throws Exception {
    int databaseSizeBeforeUpdate = playerRepository.findAll().size();

    // Create the Player

    // If the entity doesn't have an ID, it will throw BadRequestAlertException
    restPlayerMockMvc
        .perform(put("/api/players").contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(romanJosi)))
        .andExpect(status().isBadRequest());

    // Validate the Player in the database
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
  }

  @Test
  @Transactional
  public void deletePlayer() throws Exception {
    // Initialize the database
    playerService.save(romanJosi);

    int databaseSizeBeforeDelete = playerRepository.findAll().size();

    // Delete the player
    restPlayerMockMvc
        .perform(delete("/api/players/{id}", romanJosi.getId()).accept(TestUtil.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
