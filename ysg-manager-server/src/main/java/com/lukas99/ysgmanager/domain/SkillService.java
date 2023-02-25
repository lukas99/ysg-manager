package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Skill}.
 */
@Service
@Transactional
@Slf4j
public class SkillService {

  private final SkillRepository skillRepository;
  private final SkillRankingService skillRankingService;
  private final SkillTournamentRankingService skillTournamentRankingService;
  private final SkillRankingCalculator skillRankingCalculator;
  private final SkillTournamentRankingCalculator skillTournamentRankingCalculator;
  private final EntityManager entityManager;

  public SkillService(
      SkillRepository skillRepository,
      SkillRankingService skillRankingService,
      SkillTournamentRankingService skillTournamentRankingService,
      SkillRankingCalculator skillRankingCalculator,
      SkillTournamentRankingCalculator skillTournamentRankingCalculator,
      EntityManager entityManager) {
    this.skillRepository = skillRepository;
    this.skillRankingService = skillRankingService;
    this.skillTournamentRankingService = skillTournamentRankingService;
    this.skillRankingCalculator = skillRankingCalculator;
    this.skillTournamentRankingCalculator = skillTournamentRankingCalculator;
    this.entityManager = entityManager;
  }

  /**
   * Save a skill.
   *
   * @param skill the entity to save.
   * @return the persisted entity.
   */
  public Skill save(Skill skill) {
    return skillRepository.save(skill);
  }

  /**
   * Get all the skills.
   *
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public List<Skill> findAll() {
    return skillRepository.findAll();
  }


  /**
   * Get one skill by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<Skill> findOne(Long id) {
    return skillRepository.findById(id);
  }

  /**
   * Delete the skill by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    skillRepository.deleteById(id);
  }

  /**
   * @param tournament The tournament for which the skills should be retrieved.
   * @return The skills of the given tournament.
   */
  public List<Skill> findByTournament(Tournament tournament) {
    return skillRepository.findByTournament(tournament);
  }

  @Async
  @Transactional
  public void calculateSkillRankingsAsync(Tournament tournament) {
    calculateSkillRankings(tournament);
  }

  /**
   * To ensure that skill ranking calculation is done by only one thread at once.
   */
  private final ReentrantLock skillCalculationLock = new ReentrantLock();

  /**
   * Calculates the skill rankings and the tournament skill rankings for the given tournament.
   *
   * @param tournament The tournament for which the rankings should be calculated.
   */
  public void calculateSkillRankings(Tournament tournament) {
    boolean locked = skillCalculationLock.tryLock();
    if (locked) {
      try {
        log.info("Start skill ranking calculation");

        skillRankingService.deleteAll(tournament);
        skillTournamentRankingService.deleteAll(tournament);
        // without flush, removal will not be persisted and adding new rankings
        // will cause unique constraint violation exceptions
        entityManager.flush();

        skillRankingCalculator.calculateRankings(tournament);
        skillTournamentRankingCalculator.calculateTournamentRankings(tournament);
        log.info("Finished skill ranking calculation");
      } finally {
        skillCalculationLock.unlock();
      }
    } else {
      // do nothing, skill calculation can only be done by
      log.info("Skill ranking calculation is already running. Request is ignored.");
    }
  }

}
