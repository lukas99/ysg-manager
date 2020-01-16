package com.lukas99.ysgmanager.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillResult entity.
 */
@Repository
public interface SkillResultRepository extends JpaRepository<SkillResult, Long> {

}
