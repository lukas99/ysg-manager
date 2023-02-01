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
 * Service Implementation for managing {@link SkillRating}.
 */
@Service
@Transactional
public class SkillRatingService {

  private final Logger log = LoggerFactory.getLogger(SkillRatingService.class);

  private final SkillRatingRepository skillRatingRepository;

  public SkillRatingService(SkillRatingRepository skillRatingRepository) {
    this.skillRatingRepository = skillRatingRepository;
  }

  /**
   * Save a skillRating.
   *
   * @param skillRating the entity to save.
   * @return the persisted entity.
   */
  public SkillRating save(SkillRating skillRating) {
    return skillRatingRepository.save(skillRating);
  }

  /**
   * Get all the skillRatings.
   *
   * @param pageable the pagination information.
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public Page<SkillRating> findAll(Pageable pageable) {
    return skillRatingRepository.findAll(pageable);
  }


  /**
   * Get one skillRating by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<SkillRating> findOne(Long id) {
    return skillRatingRepository.findById(id);
  }

  /**
   * Delete the skillRating by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    skillRatingRepository.deleteById(id);
  }

  /**
   * @param skill The skill for which the ratings should be retrieved.
   * @return The ratings of the given skill.
   */
  public List<SkillRating> findBySkill(Skill skill) {
    return skillRatingRepository.findBySkill(skill);
  }

  /**
   * @param skill The skill for which the ratings should be retrieved.
   * @param team  The team for which the ratings should be retrieved.
   * @return the ratings for the given skill and team
   */
  public List<SkillRating> findBySkillAndTeam(Skill skill, Team team) {
    return skillRatingRepository.findBySkillAndPlayerTeam(skill, team);
  }

  /**
   * @param skill             The skill for which the ratings should be retrieved.
   * @param team              The team for which the ratings should be retrieved.
   * @param playerShirtNumber the shirt number of the player for which the ratings should be
   *                          retrieved
   * @return the ratings for the given skill, team and player shirt number
   */
  public List<SkillRating> findBySkillAndTeamAndPlayerShirtNumber(
      Skill skill, Team team, Integer playerShirtNumber) {
    return skillRatingRepository.findBySkillAndPlayerTeamAndPlayerShirtNumber(
        skill, team, playerShirtNumber);
  }

  /**
   * @param player The player for which the ratings should be retrieved.
   * @return The ratings of the given player.
   */
  public List<SkillRating> findByPlayer(Player player) {
    return skillRatingRepository.findByPlayer(player);
  }

}
