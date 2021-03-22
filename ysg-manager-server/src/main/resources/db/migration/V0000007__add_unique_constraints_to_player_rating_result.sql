alter table player
    add constraint unique_player_teamId_shirtNumber unique (team_id, shirt_number);

alter table skillrating
    add constraint unique_skillrating_skillId_playerId unique (skill_id, player_id);

alter table skillresult
    add constraint unique_skillresult_skillId_playerId unique (skill_id, player_id);
