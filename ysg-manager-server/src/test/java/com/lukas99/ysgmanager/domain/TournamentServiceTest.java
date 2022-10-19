package com.lukas99.ysgmanager.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TournamentServiceTest {

  @InjectMocks
  private TournamentService tournamentService;

  @Mock
  private TournamentRepository tournamentRepository;

  @Captor
  private ArgumentCaptor<Tournament> tournamentCaptor;

  @Test
  void save_saveFirstActiveTournament() {
    when(tournamentRepository.findByActiveTrue()).thenReturn(Collections.emptyList());

    Tournament ysg2020 = TournamentTemplates.ysg2020().toBuilder().active(true).build();
    tournamentService.save(ysg2020);

    verify(tournamentRepository).save(ysg2020);
  }

  @Test
  void save_addActiveTournament() {
    Tournament ysg2019 = TournamentTemplates.ysg2019().toBuilder().active(true).build();
    when(tournamentRepository.findByActiveTrue()).thenReturn(List.of(ysg2019));

    Tournament ysg2020 = TournamentTemplates.ysg2020().toBuilder().active(true).build();
    tournamentService.save(ysg2020);

    verify(tournamentRepository, times(2)).save(tournamentCaptor.capture());
    List<Tournament> savedTournaments = tournamentCaptor.getAllValues();
    assertThat(savedTournaments).hasSize(2);
    Tournament savedTournament1 = savedTournaments.get(0);
    Tournament savedTournament2 = savedTournaments.get(1);
    assertThat(savedTournament1.getName()).isEqualTo(TournamentTemplates.YSG_2019);
    assertThat(savedTournament1.isActive()).isFalse();
    assertThat(savedTournament2.getName()).isEqualTo(TournamentTemplates.YSG_2020);
    assertThat(savedTournament2.isActive()).isTrue();
  }

  @Test
  void save_changeActiveTournament() {
    Tournament ysg2019 = TournamentTemplates.ysg2019().toBuilder().active(true).build();
    Tournament ysg2020 = TournamentTemplates.ysg2020().toBuilder().active(true).build();
    when(tournamentRepository.findByActiveTrue()).thenReturn(List.of(ysg2019, ysg2020));

    tournamentService.save(ysg2020);

    verify(tournamentRepository, times(2)).save(tournamentCaptor.capture());
    List<Tournament> savedTournaments = tournamentCaptor.getAllValues();
    assertThat(savedTournaments).hasSize(2);
    Tournament savedTournament1 = savedTournaments.get(0);
    Tournament savedTournament2 = savedTournaments.get(1);
    assertThat(savedTournament1.getName()).isEqualTo(TournamentTemplates.YSG_2019);
    assertThat(savedTournament1.isActive()).isFalse();
    assertThat(savedTournament2.getName()).isEqualTo(TournamentTemplates.YSG_2020);
    assertThat(savedTournament2.isActive()).isTrue();
  }

  @Test
  void save_saveInactiveTournament() {
    Tournament ysg2020 = TournamentTemplates.ysg2020().toBuilder().active(false).build();
    tournamentService.save(ysg2020);
    verify(tournamentRepository).save(ysg2020);
  }

}
