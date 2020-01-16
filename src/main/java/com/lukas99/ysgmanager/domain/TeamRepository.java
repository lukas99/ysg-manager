package com.lukas99.ysgmanager.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the Team entity.
 */
@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

}
