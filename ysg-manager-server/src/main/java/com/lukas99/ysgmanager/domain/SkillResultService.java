package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SkillResult}.
 */
@Service
@Transactional
public class SkillResultService {

  private final Logger log = LoggerFactory.getLogger(SkillResultService.class);

  private final SkillResultRepository skillResultRepository;

  public SkillResultService(SkillResultRepository skillResultRepository) {
    this.skillResultRepository = skillResultRepository;
  }

  /**
   * Save a skillResult.
   *
   * @param skillResult the entity to save.
   * @return the persisted entity.
   */
  public SkillResult save(SkillResult skillResult) {
    return skillResultRepository.save(skillResult);
  }

  /**
   * Get all the skillResults.
   *
   * @param pageable the pagination information.
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public Page<SkillResult> findAll(Pageable pageable) {
    return skillResultRepository.findAll(pageable);
  }


  /**
   * Get one skillResult by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<SkillResult> findOne(Long id) {
    return skillResultRepository.findById(id);
  }

  /**
   * Delete the skillResult by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    skillResultRepository.deleteById(id);
  }

  /**
   * @param skill The skill for which the results should be retrieved.
   * @return The results of the given skill.
   */
  public List<SkillResult> findBySkill(Skill skill) {
    return skillResultRepository.findBySkill(skill);
  }

  /**
   * @param skill The skill for which the results should be retrieved.
   * @param team  The team for which the results should be retrieved.
   * @return the results for the given skill and team
   */
  public List<SkillResult> findBySkillAndTeam(Skill skill, Team team) {
    return skillResultRepository.findBySkillAndPlayerTeam(skill, team);
  }

  /**
   * @param skill             The skill for which the results should be retrieved.
   * @param team              The team for which the results should be retrieved.
   * @param playerShirtNumber the shirt number of the player for which the results should be
   *                          retrieved
   * @return the results for the given skill, team and player shirt number
   */
  public List<SkillResult> findBySkillAndTeamAndPlayerShirtNumber(
      Skill skill, Team team, Integer playerShirtNumber) {
    return skillResultRepository.findBySkillAndPlayerTeamAndPlayerShirtNumber(
        skill, team, playerShirtNumber);
  }

  /**
   * @param player The skill for which the results should be retrieved.
   * @return The results of the given player.
   */
  public List<SkillResult> findByPlayer(Player player) {
    return skillResultRepository.findByPlayer(player);
  }

}
