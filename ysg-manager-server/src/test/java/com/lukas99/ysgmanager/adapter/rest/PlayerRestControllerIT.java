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

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerPosition;
import com.lukas99.ysgmanager.domain.PlayerRepository;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.PlayerTemplates;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamService;
import com.lukas99.ysgmanager.domain.TeamTemplates;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentTemplates;
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
 * Integration tests for the {@link PlayerRestController}.
 */
@WithMockUser(username = "admin", roles = {"YSG_ADMIN"})
public class PlayerRestControllerIT extends IntegrationTest {

  @Autowired
  private PlayerRepository playerRepository;

  @Autowired
  private PlayerService playerService;

  @Autowired
  private TeamService teamService;

  @Autowired
  private EntityManager em;

  private MockMvc restPlayerMockMvc;

  private Team ehcEngelberg;
  private Player romanJosi;
  private Player martinGerber;
  private PlayerModel romanJosiModel;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
    final PlayerRestController playerRestController =
        new PlayerRestController(playerService, teamService);
    this.restPlayerMockMvc = MockMvcBuilders.standaloneSetup(playerRestController).build();
  }

  @BeforeEach
  public void initTest() {
    Tournament ysg2019 = TournamentTemplates.ysg2019(em);
    ehcEngelberg = TeamTemplates.ehcEngelberg(ysg2019, em);
    romanJosi = PlayerTemplates.romanJosi(ehcEngelberg);
    martinGerber = PlayerTemplates.martinGerber(ehcEngelberg);
    romanJosiModel = new PlayerModelAssembler().toModel(romanJosi);
  }

  @Test
  @Transactional
  public void createPlayer() throws Exception {
    int databaseSizeBeforeCreate = playerRepository.findAll().size();

    // Create the Player
    restPlayerMockMvc.perform(post("/api/teams/{teamId}/players", ehcEngelberg.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(romanJosiModel)))
        .andExpect(status().isOk());

    // Validate the Player in the database
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeCreate + 1);
    Player testPlayer = playerList.get(playerList.size() - 1);
    assertThat(testPlayer.getFirstName()).isEqualTo(PlayerTemplates.ROMAN);
    assertThat(testPlayer.getLastName()).isEqualTo(PlayerTemplates.JOSI);
    assertThat(testPlayer.getShirtNumber()).isEqualTo(PlayerTemplates.FIFITY_NINE);
    assertThat(testPlayer.getPosition()).isEqualTo(PlayerPosition.SKATER);
    assertThat(testPlayer.getTeam()).isEqualTo(ehcEngelberg);
  }

  @Test
  @Transactional
  public void checkShirtNumberIsRequired() throws Exception {
    int databaseSizeBeforeTest = playerRepository.findAll().size();
    // set the field null
    romanJosiModel.setShirtNumber(null);

    // Create the Player, which fails.
    restPlayerMockMvc.perform(post("/api/teams/{teamId}/players", ehcEngelberg.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(romanJosiModel)))
        .andExpect(status().isBadRequest());

    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void checkPositionIsRequired() throws Exception {
    int databaseSizeBeforeTest = playerRepository.findAll().size();
    // set the field null
    romanJosiModel.setPosition(null);

    // Create the Player, which fails.
    restPlayerMockMvc.perform(post("/api/teams/{teamId}/players", ehcEngelberg.getId())
            .contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(romanJosiModel)))
        .andExpect(status().isBadRequest());

    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeTest);
  }

  @Test
  @Transactional
  public void getPlayersOfTeam() throws Exception {
    // Initialize the database
    playerRepository.saveAndFlush(romanJosi);
    playerRepository.saveAndFlush(martinGerber);

    // Get all the players of a team
    restPlayerMockMvc.perform(get("/api/teams/{teamId}/players", ehcEngelberg.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(jsonPath("$.links", empty()))
        .andExpect(jsonPath("$.content", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].firstName").value(is(PlayerTemplates.ROMAN)))
        .andExpect(jsonPath("$.content.[0].lastName").value(is(PlayerTemplates.JOSI)))
        .andExpect(jsonPath("$.content.[0].shirtNumber").value(is(PlayerTemplates.FIFITY_NINE)))
        .andExpect(jsonPath("$.content.[0].position").value(is(PlayerPosition.SKATER.toString())))
        .andExpect(jsonPath("$.content.[0].team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.content.[0].links", hasSize(2)))
        .andExpect(jsonPath("$.content.[0].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[0].links.[0].href",
            endsWith("/players/" + romanJosi.getId())))
        .andExpect(jsonPath("$.content.[1].firstName").value(is(PlayerTemplates.MARTIN)))
        .andExpect(jsonPath("$.content.[1].lastName").value(is(PlayerTemplates.GERBER)))
        .andExpect(jsonPath("$.content.[1].shirtNumber").value(is(PlayerTemplates.TWENTY_NINE)))
        .andExpect(jsonPath("$.content.[1].position")
            .value(is(PlayerPosition.GOALTENDER.toString())))
        .andExpect(jsonPath("$.content.[1].team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.content.[1].links", hasSize(2)))
        .andExpect(jsonPath("$.content.[1].links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.content.[1].links.[0].href",
            endsWith("/players/" + martinGerber.getId())));
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
        .andExpect(jsonPath("$.firstName").value(PlayerTemplates.ROMAN))
        .andExpect(jsonPath("$.lastName").value(PlayerTemplates.JOSI))
        .andExpect(jsonPath("$.shirtNumber").value(PlayerTemplates.FIFITY_NINE))
        .andExpect(jsonPath("$.position").value(is(PlayerPosition.SKATER.toString())))
        .andExpect(jsonPath("$.team.name").value(is(ehcEngelberg.getName())))
        .andExpect(jsonPath("$.links", hasSize(2)))
        .andExpect(jsonPath("$.links.[0].rel").value(is("self")))
        .andExpect(jsonPath("$.links.[0].href", endsWith("/players/" + romanJosi.getId())))
        .andExpect(jsonPath("$.links.[1].rel").value(is("team")))
        .andExpect(jsonPath("$.links.[1].href", endsWith("/teams/" + ehcEngelberg.getId())))
    ;
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
    romanJosiModel.setFirstName("updatedFirstName");
    romanJosiModel.setLastName("updatedLastName");
    romanJosiModel.setShirtNumber(99);
    romanJosiModel.setPosition(PlayerPosition.GOALTENDER);

    restPlayerMockMvc
        .perform(put("/api/players/{id}", romanJosi.getId()).contentType(TestUtils.APPLICATION_JSON)
            .content(TestUtils.convertObjectToJsonBytes(romanJosiModel)))
        .andExpect(status().isOk());

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
  public void deletePlayer() throws Exception {
    // Initialize the database
    playerService.save(romanJosi);

    int databaseSizeBeforeDelete = playerRepository.findAll().size();

    // Delete the player
    restPlayerMockMvc
        .perform(delete("/api/players/{id}", romanJosi.getId()).accept(TestUtils.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Validate the database contains one less item
    List<Player> playerList = playerRepository.findAll();
    assertThat(playerList).hasSize(databaseSizeBeforeDelete - 1);
  }
}
