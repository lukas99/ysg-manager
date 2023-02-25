package com.lukas99.ysgmanager.domain;

import static org.mockito.AdditionalAnswers.answerVoid;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

  @InjectMocks
  private SkillService skillService;

  @Mock
  private SkillRepository skillRepository;

  @Mock
  private SkillRankingService skillRankingService;

  @Mock
  private SkillTournamentRankingService skillTournamentRankingService;

  @Mock
  private SkillRankingCalculator skillRankingCalculator;

  @Mock
  private SkillTournamentRankingCalculator skillTournamentRankingCalculator;

  @Mock
  private EntityManager entityManager;

  private Tournament ysg2019;

  @BeforeEach
  public void setUp() {
    ysg2019 = TournamentTemplates.ysg2019();
  }

  @Test
  void calculateSkillRankings_isExecutedByOnlyOneThreadAtOnce() throws Exception {
    // wait to make call of second thread not starting skill ranking calculation
    doAnswer(answerVoid((tournament) -> Thread.sleep(500)))
        .when(skillRankingService).deleteAll(ysg2019);

    int threadCount = 2;
    ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
    IntStream.range(0, threadCount).forEach(
        count -> executorService.execute(() -> skillService.calculateSkillRankings(ysg2019)));

    executorService.shutdown();
    executorService.awaitTermination(1, TimeUnit.SECONDS); // wait for threads to complete

    // each mock should be called only once
    verify(skillRankingService, times(1)).deleteAll(ysg2019);
    verify(skillTournamentRankingService, times(1)).deleteAll(ysg2019);
    verify(entityManager, times(1)).flush();
    verify(skillRankingCalculator, times(1)).calculateRankings(ysg2019);
    verify(skillTournamentRankingCalculator, times(1)).calculateTournamentRankings(ysg2019);
  }

}
