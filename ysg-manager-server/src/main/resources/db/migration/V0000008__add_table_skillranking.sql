create table skillranking (
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

alter table skillranking
add constraint skillranking_skill_fk foreign key (skill_id) references skill;

alter table skillranking
add constraint skillranking_player_fk foreign key (player_id) references player;

alter table skillranking
    add constraint unique_skillranking_skillId_playerId unique (skill_id, player_id);
