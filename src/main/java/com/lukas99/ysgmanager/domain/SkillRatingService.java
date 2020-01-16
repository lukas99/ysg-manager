package com.lukas99.ysgmanager.domain;

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
    log.debug("Request to save SkillRating : {}", skillRating);
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
    log.debug("Request to get all SkillRatings");
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
    log.debug("Request to get SkillRating : {}", id);
    return skillRatingRepository.findById(id);
  }

  /**
   * Delete the skillRating by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    log.debug("Request to delete SkillRating : {}", id);
    skillRatingRepository.deleteById(id);
  }
}
