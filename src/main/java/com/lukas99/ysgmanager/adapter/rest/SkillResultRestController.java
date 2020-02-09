package com.lukas99.ysgmanager.adapter.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
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
import com.lukas99.ysgmanager.adapter.rest.errors.BadRequestException;
import com.lukas99.ysgmanager.domain.SkillResult;
import com.lukas99.ysgmanager.domain.SkillResultService;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.SkillResult}.
 */
@RestController
@RequestMapping("/api")
public class SkillResultRestController {

  private final Logger log = LoggerFactory.getLogger(SkillResultRestController.class);

  private static final String ENTITY_NAME = "skillResult";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final SkillResultService skillResultService;

  public SkillResultRestController(SkillResultService skillResultService) {
    this.skillResultService = skillResultService;
  }

  /**
   * {@code POST  /skill-results} : Create a new skillResult.
   *
   * @param skillResult the skillResult to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new
   *         skillResult, or with status {@code 400 (Bad Request)} if the skillResult has already an
   *         ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("/skill-results")
  public ResponseEntity<SkillResult> createSkillResult(@RequestBody SkillResult skillResult)
      throws URISyntaxException {
    log.debug("REST request to save SkillResult : {}", skillResult);
    if (skillResult.getId() != null) {
      throw new BadRequestException("A new skillResult cannot already have an ID");
    }
    SkillResult result = skillResultService.save(skillResult);
    return ResponseEntity.created(new URI("/api/skill-results/" + result.getId()))
        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
            result.getId().toString()))
        .body(result);
  }

  /**
   * {@code PUT  /skill-results} : Updates an existing skillResult.
   *
   * @param skillResult the skillResult to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated
   *         skillResult, or with status {@code 400 (Bad Request)} if the skillResult is not valid,
   *         or with status {@code 500 (Internal Server Error)} if the skillResult couldn't be
   *         updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/skill-results")
  public ResponseEntity<SkillResult> updateSkillResult(@RequestBody SkillResult skillResult)
      throws URISyntaxException {
    log.debug("REST request to update SkillResult : {}", skillResult);
    if (skillResult.getId() == null) {
      throw new BadRequestException("Invalid id. It is null.");
    }

    SkillResult existingSkillResult = skillResultService.findOne(skillResult.getId()).get();
    existingSkillResult.update(skillResult);

    SkillResult result = skillResultService.save(existingSkillResult);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true,
        ENTITY_NAME, skillResult.getId().toString())).body(result);
  }

  /**
   * {@code GET  /skill-results} : get all the skillResults.
   *
   * @param pageable the pagination information.
   * 
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of skillResults in
   *         body.
   */
  @GetMapping("/skill-results")
  public ResponseEntity<List<SkillResult>> getAllSkillResults(Pageable pageable) {
    log.debug("REST request to get all SkillResults");
    Page<SkillResult> page = skillResultService.findAll(pageable);
    HttpHeaders headers = PaginationUtil
        .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
    return ResponseEntity.ok().headers(headers).body(page.getContent());
  }

  /**
   * {@code GET  /skill-results/:id} : get the "id" skillResult.
   *
   * @param id the id of the skillResult to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the skillResult,
   *         or with status {@code 404 (Not Found)}.
   */
  @GetMapping("/skill-results/{id}")
  public ResponseEntity<SkillResult> getSkillResult(@PathVariable Long id) {
    log.debug("REST request to get SkillResult : {}", id);
    Optional<SkillResult> skillResult = skillResultService.findOne(id);
    return ResponseUtil.wrapOrNotFound(skillResult);
  }

  /**
   * {@code DELETE  /skill-results/:id} : delete the "id" skillResult.
   *
   * @param id the id of the skillResult to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/skill-results/{id}")
  public ResponseEntity<Void> deleteSkillResult(@PathVariable Long id) {
    log.debug("REST request to delete SkillResult : {}", id);
    skillResultService.delete(id);
    return ResponseEntity.noContent()
        .headers(
            HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
        .build();
  }
}
