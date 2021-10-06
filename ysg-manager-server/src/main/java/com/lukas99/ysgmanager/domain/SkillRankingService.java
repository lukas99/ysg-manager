package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SkillRanking}.
 */
@Service
@Transactional
public class SkillRankingService {

  private final SkillRankingRepository skillRankingRepository;

  public SkillRankingService(SkillRankingRepository skillRankingRepository) {
    this.skillRankingRepository = skillRankingRepository;
  }

  /**
   * Save a skillRanking.
   *
   * @param skillRanking the entity to save.
   * @return the persisted entity.
   */
  public SkillRanking save(SkillRanking skillRanking) {
    return skillRankingRepository.save(skillRanking);
  }

  /**
   * Get one skillRanking by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<SkillRanking> findOne(Long id) {
    return skillRankingRepository.findById(id);
  }

  /**
   * Delete the skillRanking by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    skillRankingRepository.deleteById(id);
  }

  /**
   * Deletes all skill rankings for the given tournament.
   *
   * @param tournament The tournament for which the skill rankings should be deleted.
   */
  public void deleteAll(Tournament tournament) {
    skillRankingRepository.deleteAll(skillRankingRepository.findBySkillTournament(tournament));
  }

  /**
   * @param skill The skill for which the rankings should be retrieved.
   * @return The rankings of the given skill.
   */
  @Transactional(readOnly = true)
  public List<SkillRanking> findBySkill(Skill skill) {
    return skillRankingRepository.findBySkillOrderBySequenceAsc(skill);
  }

}
