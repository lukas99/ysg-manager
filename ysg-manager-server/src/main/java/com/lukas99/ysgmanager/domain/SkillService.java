package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Skill}.
 */
@Service
@Transactional
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
   * Calculates the skill rankings and the tournament skill rankings for the given tournament.
   *
   * @param tournament The tournament for which the rankings should be calculated.
   */
  public void calculateSkillRankings(Tournament tournament) {
    skillRankingService.deleteAll(tournament);
    skillTournamentRankingService.deleteAll(tournament);
    // without flush, removal will not be persisted and adding new rankings
    // will cause unique constraint violation exceptions
    entityManager.flush();

    skillRankingCalculator.calculateRankings(tournament);
    skillTournamentRankingCalculator.calculateTournamentRankings(tournament);
  }

}
