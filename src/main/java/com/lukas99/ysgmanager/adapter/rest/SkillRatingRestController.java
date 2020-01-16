package com.lukas99.ysgmanager.adapter.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.lukas99.ysgmanager.adapter.rest.errors.BadRequestAlertException;
import com.lukas99.ysgmanager.domain.SkillRating;
import com.lukas99.ysgmanager.domain.SkillRatingService;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.SkillRating}.
 */
@RestController
@RequestMapping("/api")
public class SkillRatingRestController {

  private final Logger log = LoggerFactory.getLogger(SkillRatingRestController.class);

  private static final String ENTITY_NAME = "skillRating";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final SkillRatingService skillRatingService;

  public SkillRatingRestController(SkillRatingService skillRatingService) {
    this.skillRatingService = skillRatingService;
  }

  /**
   * {@code POST  /skill-ratings} : Create a new skillRating.
   *
   * @param skillRating the skillRating to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new
   *         skillRating, or with status {@code 400 (Bad Request)} if the skillRating has already an
   *         ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("/skill-ratings")
  public ResponseEntity<SkillRating> createSkillRating(@Valid @RequestBody SkillRating skillRating)
      throws URISyntaxException {
    log.debug("REST request to save SkillRating : {}", skillRating);
    if (skillRating.getId() != null) {
      throw new BadRequestAlertException("A new skillRating cannot already have an ID", ENTITY_NAME,
          "idexists");
    }
    SkillRating result = skillRatingService.save(skillRating);
    return ResponseEntity.created(new URI("/api/skill-ratings/" + result.getId()))
        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
            result.getId().toString()))
        .body(result);
  }

  /**
   * {@code PUT  /skill-ratings} : Updates an existing skillRating.
   *
   * @param skillRating the skillRating to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated
   *         skillRating, or with status {@code 400 (Bad Request)} if the skillRating is not valid,
   *         or with status {@code 500 (Internal Server Error)} if the skillRating couldn't be
   *         updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/skill-ratings")
  public ResponseEntity<SkillRating> updateSkillRating(@Valid @RequestBody SkillRating skillRating)
      throws URISyntaxException {
    log.debug("REST request to update SkillRating : {}", skillRating);
    if (skillRating.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    SkillRating result = skillRatingService.save(skillRating);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true,
        ENTITY_NAME, skillRating.getId().toString())).body(result);
  }

  /**
   * {@code GET  /skill-ratings} : get all the skillRatings.
   * 
   * @param pageable the pagination information.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of skillRatings in
   *         body.
   */
  @GetMapping("/skill-ratings")
  public ResponseEntity<List<SkillRating>> getAllSkillRatings(Pageable pageable) {
    log.debug("REST request to get all SkillRatings");
    Page<SkillRating> page = skillRatingService.findAll(pageable);
    HttpHeaders headers = PaginationUtil
        .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
    return ResponseEntity.ok().headers(headers).body(page.getContent());
  }

  /**
   * {@code GET  /skill-ratings/:id} : get the "id" skillRating.
   *
   * @param id the id of the skillRating to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the skillRating,
   *         or with status {@code 404 (Not Found)}.
   */
  @GetMapping("/skill-ratings/{id}")
  public ResponseEntity<SkillRating> getSkillRating(@PathVariable Long id) {
    log.debug("REST request to get SkillRating : {}", id);
    Optional<SkillRating> skillRating = skillRatingService.findOne(id);
    return ResponseUtil.wrapOrNotFound(skillRating);
  }

  /**
   * {@code DELETE  /skill-ratings/:id} : delete the "id" skillRating.
   *
   * @param id the id of the skillRating to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/skill-ratings/{id}")
  public ResponseEntity<Void> deleteSkillRating(@PathVariable Long id) {
    log.debug("REST request to delete SkillRating : {}", id);
    skillRatingService.delete(id);
    return ResponseEntity.noContent()
        .headers(
            HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
        .build();
  }
}
