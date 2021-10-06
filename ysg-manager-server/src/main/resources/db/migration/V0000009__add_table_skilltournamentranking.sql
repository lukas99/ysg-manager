create table skilltournamentranking (
	id bigint primary key,
	skill_id bigint not null,
	player_id bigint not null,
	rank integer not null,
	sequence integer not null,
	created timestamp not null,
	created_by text not null,
	modified timestamp not null,
	modified_by text not null
);

alter table skilltournamentranking
add constraint skilltournamentranking_skill_fk foreign key (skill_id) references skill;

alter table skilltournamentranking
add constraint skilltournamentranking_player_fk foreign key (player_id) references player;

alter table skilltournamentranking
    add constraint unique_skilltournamentranking_skillId_playerId unique (skill_id, player_id);
