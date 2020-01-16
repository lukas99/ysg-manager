package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Skill}.
 */
@Service
@Transactional
public class SkillService {

  private final Logger log = LoggerFactory.getLogger(SkillService.class);

  private final SkillRepository skillRepository;

  public SkillService(SkillRepository skillRepository) {
    this.skillRepository = skillRepository;
  }

  /**
   * Save a skill.
   *
   * @param skill the entity to save.
   * @return the persisted entity.
   */
  public Skill save(Skill skill) {
    log.debug("Request to save Skill : {}", skill);
    return skillRepository.save(skill);
  }

  /**
   * Get all the skills.
   *
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public List<Skill> findAll() {
    log.debug("Request to get all Skills");
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
    log.debug("Request to get Skill : {}", id);
    return skillRepository.findById(id);
  }

  /**
   * Delete the skill by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    log.debug("Request to delete Skill : {}", id);
    skillRepository.deleteById(id);
  }
}
