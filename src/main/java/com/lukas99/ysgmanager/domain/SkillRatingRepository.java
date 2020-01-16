package com.lukas99.ysgmanager.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillRating entity.
 */
@Repository
public interface SkillRatingRepository extends JpaRepository<SkillRating, Long> {

}
