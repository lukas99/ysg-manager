package com.lukas99.ysgmanager.domain;

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
    log.debug("Request to save SkillResult : {}", skillResult);
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
    log.debug("Request to get all SkillResults");
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
    log.debug("Request to get SkillResult : {}", id);
    return skillResultRepository.findById(id);
  }

  /**
   * Delete the skillResult by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    log.debug("Request to delete SkillResult : {}", id);
    skillResultRepository.deleteById(id);
  }
}
