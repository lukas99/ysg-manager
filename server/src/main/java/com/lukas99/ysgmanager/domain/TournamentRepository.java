package com.lukas99.ysgmanager.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the Tournament entity.
 */
@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

}
