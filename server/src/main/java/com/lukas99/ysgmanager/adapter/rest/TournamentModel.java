package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Tournament;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a tournament used by the REST controllers.
 */
@Getter
@Setter
public class TournamentModel extends RepresentationModel<TournamentModel> {

  @NotNull
  private String name;

  private String dateDescription;

  /**
   * Creates an entity of this model.
   *
   * @return The created entity.
   */
  public Tournament toEntity() {
    Tournament tournament = new Tournament();
    tournament.setName(getName());
    tournament.setDateDescription(getDateDescription());
    return tournament;
  }

}
